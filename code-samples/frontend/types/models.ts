// Extracto de Beta3M (código fuente privado). Mostrado con fines de portfolio. © 2026 Marc Gálvez & Ignasi Palau.
//
// Modelo de datos compartido por el frontend. Las entidades de servidor reflejan las tablas
// de PostgreSQL (snake_case); los objetos del lienzo solo existen en el cliente.

// ── Entidades de servidor ──────────────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  display_name?: string | null;
  avatar_url?: string | null;
  language?: 'ca' | 'es' | 'en' | null;
  theme?: 'light' | 'dark' | 'system' | null;
  onboarding_done?: boolean;
  created_at?: string;
}

export interface Subject {
  id: number;
  name: string;
  color: string;          // hex, p. ej. '#048A81'
  icon?: string | null;   // emoji
  position?: number | null;
  user_id: number;
  created_at?: string;
}

export interface Note {
  /** Negativo mientras la nota solo existe en local (creada sin conexión). */
  id: number;
  title: string;
  content: string;        // HTML de Tiptap
  content_plain?: string; // texto plano para búsqueda e IA
  subject_id: number | null;
  subject_name?: string;
  subject_color?: string;
  user_id: number;
  ai_processed: boolean;
  is_pinned?: boolean;
  is_archived?: boolean;
  tags?: string[] | null;
  word_count?: number | null;
  cover_color?: string | null;
  created_at: string;
  updated_at: string;
}

// ── Objetos del lienzo ─────────────────────────────────────────────────────────

export type FloatingObjectType =
  | 'stroke' | 'shape' | 'image' | 'ocr-scan' | 'equation' | 'connector' | 'text' | 'sticker';

export type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

/** Cualquier elemento libre sobre la página: trazos, figuras, fórmulas, imágenes, conectores... */
export interface FloatingObject {
  id: string;
  type: FloatingObjectType;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  isSelected: boolean;
  rotation: number;

  /** Path SVG con coordenadas relativas a la caja del propio objeto. */
  svgData?: string;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;

  /** Fórmula reconocida desde la escritura a mano (renderizada con KaTeX). */
  latexSource?: string;

  imageBase64?: string;
  ocrText?: string;

  /** Conectores: flechas entre dos objetos. */
  sourceId?: string;
  targetId?: string;
  arrowStart?: boolean;
  arrowEnd?: boolean;

  textContent?: string;
  fontSize?: number;
  stickerEmoji?: string;
}
