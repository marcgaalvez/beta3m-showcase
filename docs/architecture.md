# 🏗️ Arquitectura

[← Volver al README](../README.md)

Beta3M es una SPA en React servida desde un CDN, que habla con una API REST propia en Node.js.
La API es la **única** que accede a la base de datos y a los servicios de IA: el cliente nunca
tiene claves de terceros.

## Vista general

```mermaid
flowchart LR
    subgraph Cliente["📱 Tablet / navegador"]
        UI["React 19 + TypeScript<br/>Tiptap · KaTeX · Zustand"]
        INK["Motor de tinta<br/>Pointer Events + Canvas/SVG"]
        IDB[("IndexedDB<br/>Dexie")]
        UI <--> INK
        UI <--> IDB
    end

    subgraph Edge["☁️ Vercel"]
        CDN["Build estático (Vite)"]
    end

    subgraph API["⚙️ Railway · Node.js + Express 5"]
        MW["helmet · CORS · rate limit<br/>JWT · validación"]
        CTRL["Controladores<br/>auth · notes · subjects · ai · ocr"]
        MW --> CTRL
    end

    PG[("PostgreSQL<br/>Supabase · RLS")]
    OAI["OpenAI<br/>gpt-4o-mini · visión"]
    MAIL["Resend<br/>email transaccional"]

    CDN -. sirve .-> UI
    UI -- "HTTPS + JWT" --> MW
    CTRL --> PG
    CTRL --> OAI
    CTRL --> MAIL
```

## Capas del backend

```mermaid
flowchart TB
    R["routes/<br/>endpoints + cadena de middlewares"] --> M["middleware/<br/>verifyToken · validateBody · limitadores"]
    M --> C["controllers/<br/>lógica de cada endpoint"]
    C --> S["services/<br/>OpenAI · email"]
    C --> DB["config/db<br/>pool de pg · SQL parametrizado"]
```

- **Rutas declarativas**: cada endpoint enumera sus middlewares en orden (auth → validación → controlador). Ver [`notes.routes.js`](../code-samples/backend/routes/notes.routes.js).
- **SQL parametrizado** con `pg` (sin ORM): consultas explícitas y planes predecibles, que importan para la búsqueda full-text.
- **Integraciones aisladas en servicios**: el cliente de OpenAI gestiona timeouts, reintentos y la traducción de errores ([`openai.client.js`](../code-samples/backend/services/openai.client.js)).
- **Errores opacos**: el cliente recibe mensajes genéricos y el detalle solo queda en los logs del servidor.

## Estructura del frontend

```mermaid
flowchart TB
    Pages["pages/<br/>Dashboard · Perfil · Planes · Login"] --> Comp["components/<br/>notes · toolbar · layout · ui"]
    Comp --> Feat["features/<br/>editor · ai · math · filesystem"]
    Comp --> Hooks["hooks/<br/>useMultiTouch · useHistory · useFocusTrap…"]
    Comp --> Stores["store/ (Zustand)<br/>notes · subjects · auth · ui"]
    Stores --> Api["api/client<br/>fetch + JWT + NetworkError"]
    Stores --> Dexie["db/dexie<br/>IndexedDB"]
```

- **Estado global con Zustand**: stores pequeños por dominio y sin *boilerplate*. Los temporizadores y las colas viven fuera de React.
- **El editor tiene dos mundos**: Tiptap para el texto enriquecido y una capa de **objetos flotantes** (trazos, fórmulas, figuras, imágenes) posicionados encima. Ver [ink-engine.md](ink-engine.md).
- **Cliente HTTP mínimo** que distingue los errores de red (`NetworkError`) de los del servidor. Es la base del modo offline ([offline-sync.md](offline-sync.md)).

## Flujo: escribir → guardar en local → sincronizar

```mermaid
sequenceDiagram
    actor U as Usuario
    participant E as Editor
    participant S as notesStore
    participant D as IndexedDB
    participant W as Worker de sync
    participant A as API

    U->>E: escribe / dibuja
    E->>S: updateNote(id, cambios)
    S->>D: put (inmediato)
    S-->>E: estado actualizado (sin esperar a la red)
    S->>W: encola y fusiona cambios por nota
    Note over W: espera a que el usuario<br/>deje de escribir
    W->>A: PUT /notes/:id
    alt OK
        A-->>W: nota guardada
        W->>D: put (versión del servidor)
    else sin red
        W-->>W: re-encola para el siguiente ciclo
    end
```

## Flujo: foto → OCR → IA → apunte

```mermaid
sequenceDiagram
    actor U as Usuario
    participant C as Cámara / archivo
    participant F as Frontend
    participant A as API
    participant V as OpenAI (visión)

    U->>C: foto de la pizarra o del libro
    C->>F: imagen
    F->>F: recorte y compresión en canvas
    F->>A: POST imagen (base64) + modo (texto / fórmula / tabla)
    A->>A: auth · validación · límites de uso
    A->>V: imagen + instrucciones del modo
    V-->>A: texto / LaTeX / tabla
    A-->>F: resultado normalizado
    F->>F: inserta en Tiptap (KaTeX para fórmulas)
    F-->>U: apunte editable
```

## Decisiones clave

| Decisión | Alternativa descartada | Por qué |
|---|---|---|
| API propia entre cliente y BD | Cliente → Supabase directo | Las claves y la lógica de cuotas no salen nunca del servidor. RLS queda como segunda barrera. |
| `pg` + SQL a mano | ORM | Control total sobre la búsqueda full-text, los índices parciales y los JOIN. |
| Zustand | Redux / Context | Menos código, y los selectores evitan renders en el editor, que es la parte más pesada. |
| SVG + canvas en el lienzo | Solo canvas | El SVG da trazos vectoriales seleccionables y exportables. El canvas da el trazo en vivo a 60 fps. |
| Express 5 | Fastify / NestJS | Proyecto de 2 personas: ecosistema conocido y async nativo en los handlers. |
