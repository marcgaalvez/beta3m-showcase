# 🗄️ Modelo de datos

[← Volver al README](../README.md)

PostgreSQL alojado en Supabase. El esquema simplificado está en
[`code-samples/backend/sql/schema.sql`](../code-samples/backend/sql/schema.sql).

## Diagrama entidad-relación (implementado)

```mermaid
erDiagram
    USERS ||--o{ SUBJECTS : "crea"
    USERS ||--o{ NOTES : "escribe"
    SUBJECTS |o--o{ NOTES : "agrupa"
    NOTES ||--o{ NOTE_VERSIONS : "historial"
    NOTES ||--o{ ATTACHMENTS : "adjunta"
    USERS ||--o{ ATTACHMENTS : "sube"

    USERS {
        int id PK
        text email UK
        text display_name
        text language
        text theme
        timestamp deleted_at
        timestamp updated_at
    }
    SUBJECTS {
        int id PK
        text name
        text color
        text icon
        int position
        int user_id FK
    }
    NOTES {
        int id PK
        text title
        text content
        text content_plain
        int subject_id FK
        int user_id FK
        bool is_pinned
        bool is_archived
        text_array tags
        int word_count
        timestamp deleted_at
        timestamp updated_at
    }
    NOTE_VERSIONS {
        int id PK
        int note_id FK
        text content_html
        text action
        timestamp created_at
    }
    ATTACHMENTS {
        int id PK
        int note_id FK
        int user_id FK
        text type
        text storage_path
        text mime_type
    }
```

## Decisiones de diseño

- **`content` + `content_plain`**: el HTML de Tiptap se guarda tal cual para renderizarlo, y una copia en texto plano alimenta la búsqueda y el contexto de la IA sin tener que parsear HTML en cada consulta.
- **Borrado lógico (`deleted_at`)**: la papelera y la restauración salen gratis. Los índices son **parciales** (`WHERE deleted_at IS NULL`), así que las notas borradas no penalizan el listado principal.
- **Full-text search con GIN** sobre `to_tsvector(title || content_plain)` y ranking con `ts_rank`. Si la consulta FTS no devuelve nada útil, la API recurre a `ILIKE`.
- **Trigramas (`pg_trgm`)** en el título, para búsquedas parciales del tipo "cinem" → *Cinemática*.
- **Triggers**: `updated_at` automático y recuento de palabras / tiempo de lectura calculados en la propia BD, de modo que ningún cliente puede dejarlos inconsistentes.
- **`ON DELETE SET NULL`** en `notes.subject_id`: borrar una asignatura no borra sus apuntes.
- **Historial de versiones** con el origen de cada cambio (`auto`, `manual`, `ai`, `restore`).

## Próximas versiones

```mermaid
erDiagram
    USERS ||--o{ SUBSCRIPTIONS : "tiene"
    PLANS ||--o{ SUBSCRIPTIONS : "define"
    USERS ||--o{ AI_USAGE_LOGS : "consume"
    NOTES }o--o{ TAGS : "etiquetada"

    PLANS { text id PK }
    SUBSCRIPTIONS { int id PK }
    AI_USAGE_LOGS { int id PK }
    TAGS { int id PK }
```

| Versión | Cambio |
|---|---|
| v2 | Tabla `tags` normalizada (hoy es `TEXT[]` con índice GIN) y registro detallado del uso de IA para analítica de costes. |
| v3 | Suscripciones con Stripe (`plans`, `subscriptions`, webhooks) y colaboración en notas compartidas. |
