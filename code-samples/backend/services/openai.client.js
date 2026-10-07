// Extracto de Beta3M (código fuente privado). Mostrado con fines de portfolio. © 2026 Marc Gálvez & Ignasi Palau.
//
// Cliente mínimo de OpenAI (chat/completions) sobre fetch nativo, sin SDK:
//   · timeout por intento + plazo total para todos los intentos
//   · reintentos con backoff exponencial y jitter solo en errores transitorios (429/5xx/red)
//   · respeta la cabecera Retry-After
//   · traduce cualquier fallo a una respuesta HTTP coherente para el cliente

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const TIMEOUT_MS = Number(process.env.OPENAI_TIMEOUT_MS) || 60_000;
const DEADLINE_MS = Number(process.env.OPENAI_DEADLINE_MS) || 90_000;
const MAX_RETRIES = 2;
const RETRYABLE_STATUS = new Set([408, 409, 429, 500, 502, 503, 504]);

// Modelo rápido y barato para texto; uno con visión para OCR. Configurables por entorno.
const MODELS = {
  fast:   process.env.OPENAI_MODEL_FAST   || 'gpt-4o-mini',
  vision: process.env.OPENAI_MODEL_VISION || 'gpt-4o',
};

class OpenAIError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'OpenAIError';
    this.status = status;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function retryDelay(response, attempt) {
  const retryAfter = Number(response?.headers?.get('retry-after'));
  if (retryAfter > 0) return Math.min(retryAfter * 1000, 8000);
  return Math.min(500 * 2 ** attempt, 4000) + Math.random() * 250;
}

// Espera antes de reintentar; false si no quedan intentos o la espera rebasa el plazo total.
async function waitBeforeRetry(response, attempt, deadline) {
  if (attempt >= MAX_RETRIES) return false;
  const delay = retryDelay(response, attempt);
  if (Date.now() + delay >= deadline) return false;
  await sleep(delay);
  return true;
}

/**
 * Llama a chat/completions con timeout y reintentos.
 * Devuelve el JSON completo de la respuesta; lanza OpenAIError si falla.
 */
async function chatCompletion(body, { deadlineMs = DEADLINE_MS } = {}) {
  if (!process.env.OPENAI_API_KEY) {
    throw new OpenAIError('OPENAI_API_KEY no configurada', 500);
  }

  const deadline = Date.now() + deadlineMs;
  let lastError;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw lastError || new OpenAIError('Timeout esperando a OpenAI', 504);

    let response;
    try {
      response = await fetch(OPENAI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(Math.min(TIMEOUT_MS, remaining)),
      });
    } catch (err) {
      const timedOut = err.name === 'TimeoutError' || err.name === 'AbortError';
      lastError = new OpenAIError(timedOut ? 'Timeout esperando a OpenAI' : `Error de red: ${err.message}`, timedOut ? 504 : 502);
      if (await waitBeforeRetry(null, attempt, deadline)) continue;
      throw lastError;
    }

    if (response.ok) return response.json();

    const errData = await response.json().catch(() => ({}));
    lastError = new OpenAIError(errData.error?.message || `Error OpenAI: ${response.status}`, response.status);
    if (RETRYABLE_STATUS.has(response.status) && await waitBeforeRetry(response, attempt, deadline)) continue;
    throw lastError;
  }
  throw lastError;
}

/** Contenido del primer mensaje de la respuesta. */
function messageContent(data) {
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string') throw new OpenAIError('Respuesta vacía de OpenAI', 502);
  return content.trim();
}

/** Parsea una respuesta JSON, tolerando que venga envuelta en ```json ... ```. */
function parseJsonContent(data) {
  const raw = messageContent(data)
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');
  try {
    return JSON.parse(raw);
  } catch {
    throw new OpenAIError('La IA ha devuelto un JSON no válido', 502);
  }
}

/** Responde al cliente con un estado coherente según el tipo de error. */
function sendAIError(res, err, fallback = 'Error interno') {
  if (res.headersSent) return;
  const status = err instanceof OpenAIError ? err.status : 500;
  if (status === 429) return res.status(503).json({ error: 'El servicio de IA está saturado. Inténtalo de nuevo en unos segundos.' });
  if (status === 504) return res.status(504).json({ error: 'La IA ha tardado demasiado en responder. Inténtalo de nuevo.' });
  if (err instanceof OpenAIError) return res.status(502).json({ error: 'Error al procesar con IA. Inténtalo de nuevo.' });
  return res.status(500).json({ error: fallback });
}

module.exports = { chatCompletion, messageContent, parseJsonContent, sendAIError, MODELS, OpenAIError };
