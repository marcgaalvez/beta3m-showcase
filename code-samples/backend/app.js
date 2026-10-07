// Extracto de Beta3M (código fuente privado). Mostrado con fines de portfolio. © 2026 Marc Gálvez & Ignasi Palau.
//
// Punto de entrada de la API (Express 5, CommonJS). Estructura en capas:
//   routes/       → define endpoints y encadena middlewares (auth, validación, límites)
//   controllers/  → lógica de cada endpoint
//   services/     → integraciones externas (OpenAI, email)
//   middleware/   → autenticación JWT, validación, rate limiting
// Toda la configuración sensible llega por variables de entorno.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { globalLimiter, authLimiter, aiLimiter } = require('./middleware/rateLimiters');

const ALLOWED_ORIGINS = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((url) => url.trim())
  .filter(Boolean);

const app = express();

// Detrás de un proxy inverso hay que confiar en X-Forwarded-For para que el
// rate limiting vea la IP real del cliente y no la del proxy.
const TRUST_PROXY = parseInt(process.env.TRUST_PROXY, 10);
if (TRUST_PROXY > 0) app.set('trust proxy', TRUST_PROXY);

app.use(helmet({
  // La API solo sirve JSON: una CSP estricta no protegería nada aquí
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS con lista blanca de orígenes
app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || ALLOWED_ORIGINS.includes(origin));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' })); // imágenes en base64 para OCR
app.use(globalLimiter);

// ── Rutas ──────────────────────────────────────────────────────────────────────
app.use('/api/auth', authLimiter, require('./routes/auth.routes'));
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/subjects', require('./routes/subjects.routes'));
app.use('/api/notes', require('./routes/notes.routes'));
app.use('/api/ai', aiLimiter, require('./routes/ai.routes'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Errores ────────────────────────────────────────────────────────────────────
// Ningún detalle interno (stack, SQL) llega al cliente.
app.use((err, req, res, next) => {
  console.error('[error]', err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

process.on('unhandledRejection', (reason) => console.error('[unhandledRejection]', reason));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API escuchando en el puerto ${PORT}`));
