// Extracto de Beta3M (código fuente privado). Mostrado con fines de portfolio. © 2026 Marc Gálvez & Ignasi Palau.
//
// Validación y saneado de entradas declarativo, sin dependencias.
// Uso en una ruta:
//   router.post('/', validateBody({ title: { type: 'string', maxLength: 500 } }), notes.create);

const CONTROL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g; // ASCII < 32 excepto \n (\x0A) y \t (\x09)

/**
 * Elimina caracteres de control, hace trim y trunca a maxLength.
 * @param {any}    str
 * @param {number} [maxLength]
 * @returns {string}
 */
function sanitizeString(str, maxLength) {
  if (typeof str !== 'string') return str;
  let clean = str.replace(CONTROL_CHARS, '').trim();
  if (maxLength && clean.length > maxLength) {
    clean = clean.slice(0, maxLength);
  }
  return clean;
}

/**
 * Devuelve un middleware de Express que valida req.body según las reglas dadas.
 *
 * Reglas por campo:
 *   type       : 'string' | 'integer' | 'array'
 *   required   : boolean
 *   minLength  : number  (solo string)
 *   maxLength  : number  (string → sanea y trunca; array → longitud)
 *   maxBytes   : number  (solo array: tamaño máximo serializado)
 *   pattern    : RegExp  (solo string, se comprueba ANTES de truncar)
 *   max        : number  (solo integer: valor máximo)
 *
 * Si algo falla → 400 { error: 'Entrada inválida' }.
 * Nunca se indica qué campo ha fallado, para no dar pistas sobre el esquema.
 *
 * @param {Object} rules
 * @returns {import('express').RequestHandler}
 */
function validateBody(rules) {
  return (req, res, next) => {
    for (const [field, rule] of Object.entries(rules)) {
      let value = req.body[field];

      // --- required ----------------------------------------------------------
      if (rule.required) {
        const missing =
          value === undefined ||
          value === null ||
          value === '' ||
          (rule.type === 'array' && (!Array.isArray(value) || value.length === 0));
        if (missing) {
          return res.status(400).json({ error: 'Entrada inválida' });
        }
      }

      // Campo ausente y opcional: nada que validar
      if (value === undefined || value === null) continue;

      // --- tipos -------------------------------------------------------------
      if (rule.type === 'string') {
        if (typeof value !== 'string') {
          return res.status(400).json({ error: 'Entrada inválida' });
        }

        // pattern (ANTES de truncar)
        if (rule.pattern && !rule.pattern.test(value)) {
          return res.status(400).json({ error: 'Entrada inválida' });
        }

        value = sanitizeString(value, rule.maxLength);
        req.body[field] = value;

        // minLength (después del trim)
        if (rule.minLength && value.length < rule.minLength) {
          return res.status(400).json({ error: 'Entrada inválida' });
        }

      } else if (rule.type === 'integer') {
        // Acepta number o string numérico
        const parsed = parseInt(value, 10);
        if (isNaN(parsed) || parsed <= 0 || (rule.max && parsed > rule.max)) {
          return res.status(400).json({ error: 'Entrada inválida' });
        }
        req.body[field] = parsed;

      } else if (rule.type === 'array') {
        if (!Array.isArray(value)) {
          return res.status(400).json({ error: 'Entrada inválida' });
        }
        if (rule.maxLength && value.length > rule.maxLength) {
          return res.status(400).json({ error: 'Entrada inválida' });
        }
        // maxBytes: evita cargas enormes (p. ej. arrays enviados a la IA)
        if (rule.maxBytes && JSON.stringify(value).length > rule.maxBytes) {
          return res.status(400).json({ error: 'Entrada demasiado grande' });
        }
      }
    }

    next();
  };
}

/**
 * Valida que req.params.id sea un entero positivo.
 * Si no lo es → 400 { error: 'ID inválido' }
 */
function validateId(req, res, next) {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'ID inválido' });
  }
  next();
}

// Patrones reutilizables
validateBody.HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

module.exports = { sanitizeString, validateBody, validateId };
