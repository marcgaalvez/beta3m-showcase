-- Extracto de Beta3M (código fuente privado). Mostrado con fines de portfolio. © 2026 Marc Gálvez & Ignasi Palau.
--
-- Esquema simplificado (PostgreSQL 15 / Supabase).
-- Omitido a propósito: columnas de autenticación, planes y cuotas, tablas internas,
-- políticas RLS concretas y datos de ejemplo.

CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- búsqueda parcial por trigramas

-- ── Usuarios ───────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id               SERIAL PRIMARY KEY,
  email            TEXT UNIQUE NOT NULL,
  display_name     TEXT,
  avatar_url       TEXT,
  language         TEXT NOT NULL DEFAULT 'es',      -- 'ca' | 'es' | 'en'
  theme            TEXT NOT NULL DEFAULT 'system',  -- 'light' | 'dark' | 'system'
  onboarding_done  BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at       TIMESTAMP,                       -- borrado lógico
  created_at       TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ── Asignaturas ────────────────────────────────────────────────────────────────
CREATE TABLE subjects (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  color       TEXT NOT NULL DEFAULT '#048A81',
  icon        TEXT,                                 -- emoji
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  position    INT NOT NULL DEFAULT 0,               -- orden en la barra lateral
  created_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ── Apuntes ────────────────────────────────────────────────────────────────────
CREATE TABLE notes (
  id             SERIAL PRIMARY KEY,
  title          TEXT NOT NULL DEFAULT 'Sin título',
  content        TEXT NOT NULL DEFAULT '',          -- HTML del editor
  content_plain  TEXT NOT NULL DEFAULT '',          -- texto plano: búsqueda e IA
  subject_id     INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
  user_id        INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ai_processed   BOOLEAN NOT NULL DEFAULT FALSE,
  is_pinned      BOOLEAN NOT NULL DEFAULT FALSE,
  is_archived    BOOLEAN NOT NULL DEFAULT FALSE,
  deleted_at     TIMESTAMP,                         -- papelera
  word_count     INT NOT NULL DEFAULT 0,
  reading_time   INT NOT NULL DEFAULT 0,            -- minutos estimados
  tags           TEXT[] NOT NULL DEFAULT '{}',
  cover_color    TEXT,
  created_at     TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ── Historial de versiones ─────────────────────────────────────────────────────
CREATE TABLE note_versions (
  id             SERIAL PRIMARY KEY,
  note_id        INTEGER NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  content_html   TEXT NOT NULL,
  content_plain  TEXT NOT NULL DEFAULT '',
  action         TEXT NOT NULL DEFAULT 'auto',      -- 'auto' | 'manual' | 'ai' | 'restore'
  created_by     INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ── Adjuntos ───────────────────────────────────────────────────────────────────
CREATE TABLE attachments (
  id            SERIAL PRIMARY KEY,
  note_id       INTEGER NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type          TEXT NOT NULL DEFAULT 'image',      -- 'image' | 'pdf' | 'audio'
  storage_path  TEXT NOT NULL,
  filename      TEXT,
  size_bytes    INT,
  mime_type     TEXT,
  width         INT,
  height        INT,
  created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ── Triggers ───────────────────────────────────────────────────────────────────

-- updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Recuento de palabras y tiempo de lectura calculados en la propia base de datos
CREATE OR REPLACE FUNCTION calculate_word_count()
RETURNS TRIGGER AS $$
DECLARE
  plain TEXT := trim(COALESCE(NEW.content_plain, ''));
BEGIN
  IF plain = '' THEN
    NEW.word_count := 0;
    NEW.reading_time := 1;
  ELSE
    NEW.word_count := COALESCE(array_length(
      string_to_array(regexp_replace(plain, '\s+', ' ', 'g'), ' '), 1), 0);
    NEW.reading_time := GREATEST(1, ROUND(NEW.word_count::numeric / 200));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_notes_word_count
  BEFORE INSERT OR UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION calculate_word_count();

-- ── Índices ────────────────────────────────────────────────────────────────────

-- Búsqueda full-text (título + contenido). La consulta usa exactamente la misma
-- expresión to_tsvector para que el planificador aproveche el índice GIN.
CREATE INDEX idx_notes_fts ON notes USING gin (
  to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(content_plain, ''))
);

-- Búsqueda parcial por título ("cinem" → "Cinemática")
CREATE INDEX idx_notes_title_trgm ON notes USING gin (title gin_trgm_ops);

-- Listado principal: notas vivas de un usuario, más recientes primero (índice parcial)
CREATE INDEX idx_notes_user_updated ON notes (user_id, updated_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_notes_subject ON notes (subject_id)
  WHERE subject_id IS NOT NULL AND deleted_at IS NULL;

CREATE INDEX idx_notes_tags          ON notes USING gin (tags);
CREATE INDEX idx_subjects_user       ON subjects (user_id);
CREATE INDEX idx_note_versions_note  ON note_versions (note_id, created_at DESC);
CREATE INDEX idx_attachments_note    ON attachments (note_id);

-- ── Ejemplo de consulta: búsqueda con ranking ──────────────────────────────────
-- SELECT id, title,
--        ts_rank(to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(content_plain,'')),
--                plainto_tsquery('simple', $1)) AS rank
-- FROM notes
-- WHERE user_id = $2 AND deleted_at IS NULL
--   AND to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(content_plain,''))
--       @@ plainto_tsquery('simple', $1)
-- ORDER BY rank DESC, updated_at DESC
-- LIMIT 20;

-- Row Level Security activado en todas las tablas (políticas omitidas en este extracto).
