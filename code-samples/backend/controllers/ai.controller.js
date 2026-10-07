// Extracto de Beta3M (código fuente privado). Mostrado con fines de portfolio. © 2026 Marc Gálvez & Ignasi Palau.
//
// Controlador de IA: route → controller → service → cliente HTTP.
// El controlador valida y da forma a la respuesta; el servicio decide modelo, temperatura y
// límite de tokens. Los prompts de sistema viven en un módulo privado y no se publican.

const { chatCompletion, messageContent, parseJsonContent, sendAIError, MODELS } = require('../services/openai.client');
const PROMPTS = require('../services/prompts'); // privado: no incluido en el extracto
const pool = require('../config/db');

// ── Servicio (simplificado) ────────────────────────────────────────────────────

async function complete(systemPrompt, userText, { temperature = 0.3, maxTokens = 1500, json = false } = {}) {
  const data = await chatCompletion({
    model: MODELS.fast,
    temperature,
    max_tokens: maxTokens, // tope de coste por petición
    ...(json ? { response_format: { type: 'json_object' } } : {}),
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userText },
    ],
  });
  return json ? parseJsonContent(data) : messageContent(data);
}

// ── Contexto de la nota ────────────────────────────────────────────────────────

// gpt-4o-mini admite contextos largos: ~12k caracteres (~3k tokens) cubren casi cualquier nota
const NOTE_CONTEXT_CHARS = 12_000;

/** Contexto de la nota abierta. Filtra siempre por propietario: nunca se lee una nota ajena. */
async function noteContext(noteId, userId) {
  if (!noteId) return '';
  const { rows } = await pool.query(`
    SELECT n.title, n.content_plain, s.name AS subject_name
    FROM notes n
    LEFT JOIN subjects s ON n.subject_id = s.id
    WHERE n.id = $1 AND n.user_id = $2 AND n.deleted_at IS NULL
  `, [noteId, userId]);
  const note = rows[0];
  if (!note) return '';
  const subject = note.subject_name ? `Asignatura: ${note.subject_name}\n` : '';
  return `Título: ${note.title || 'Sin título'}\n${subject}\n${(note.content_plain || '').slice(0, NOTE_CONTEXT_CHARS)}`;
}

// ── Endpoints ──────────────────────────────────────────────────────────────────

const MIN_TEXT_CHARS = 10;

/** Corrige, estructura en Markdown y resalta conceptos clave. */
const improve = async (req, res) => {
  const { text } = req.body;
  if (!text || text.length <= MIN_TEXT_CHARS) {
    return res.status(400).json({ error: 'Texto demasiado corto o inexistente' });
  }
  try {
    res.json({ result: await complete(PROMPTS.improve, text) });
  } catch (err) {
    sendAIError(res, err);
  }
};

/** Resumen + puntos clave, en el mismo idioma que el apunte. */
const summarize = async (req, res) => {
  const { text } = req.body;
  if (!text || text.length <= MIN_TEXT_CHARS) {
    return res.status(400).json({ error: 'Texto demasiado corto o inexistente' });
  }
  try {
    res.json({ result: await complete(PROMPTS.summarize, text) });
  } catch (err) {
    sendAIError(res, err);
  }
};

/** Preguntas de repaso generadas a partir de la nota abierta. */
const quiz = async (req, res) => {
  const { note_id, count = 5 } = req.body;
  const context = await noteContext(note_id, req.user.id);
  if (!context) {
    return res.status(400).json({ error: 'No hay ninguna nota abierta para generar preguntas' });
  }

  try {
    const result = await complete(PROMPTS.quiz(count), context, {
      temperature: 0.5,
      maxTokens: 300 + count * 150, // el presupuesto de tokens escala con lo que se pide
      json: true,
    });
    // Nunca se confía en la forma de la salida del modelo: se descarta lo mal formado
    const questions = (Array.isArray(result.questions) ? result.questions : []).filter(
      (q) => typeof q?.question === 'string' && q.question.trim()
          && typeof q?.answer === 'string' && q.answer.trim()
    );
    res.json({ questions });
  } catch (err) {
    sendAIError(res, err);
  }
};

module.exports = { improve, summarize, quiz };
