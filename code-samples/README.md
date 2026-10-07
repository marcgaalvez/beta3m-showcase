# 🧩 Extractos de código

> El código fuente completo de Beta3M es **privado**. Estos archivos son extractos seleccionados,
> limpiados y en algunos casos resumidos, para mostrar cómo está construido el proyecto.
> Dependen de módulos que no se incluyen, así que **no compilan por sí solos**, a propósito.
> © 2026 Marc Gálvez & Ignasi Palau. Todos los derechos reservados (ver [LICENSE](../LICENSE)).

## Frontend (React 19 + TypeScript)

| Archivo | Qué muestra |
|---|---|
| [`frontend/ink/InkCanvas.tsx`](frontend/ink/InkCanvas.tsx) | Motor de escritura a mano: doble capa canvas/SVG, `getCoalescedEvents`, repintado agrupado con `requestAnimationFrame`, ajuste a `devicePixelRatio`, grosor dinámico según velocidad y agrupación de trazos por líneas para el OCR. |
| [`frontend/ink/inkGeometry.ts`](frontend/ink/inkGeometry.ts) | Funciones puras: suavizado con curvas cuadráticas, cajas envolventes, render offscreen para OCR y la heurística que distingue una fórmula de texto. |
| [`frontend/ink/shapeDetection.ts`](frontend/ink/shapeDetection.ts) | Reconocimiento de figuras a mano alzada **sin IA**: ratio de relleno (fórmula del área de Gauss), detección de esquinas y desviación respecto a la recta. |
| [`frontend/hooks/useMultiTouch.ts`](frontend/hooks/useMultiTouch.ts) | Mapa de punteros activos: dos dedos desplazan y el lápiz dibuja. |
| [`frontend/hooks/useFocusTrap.ts`](frontend/hooks/useFocusTrap.ts) | Accesibilidad: foco atrapado en modales y devuelto al cerrarlos. |
| [`frontend/store/notesStore.ts`](frontend/store/notesStore.ts) | Store de Zustand **offline-first**: IndexedDB (Dexie) al instante, cola de sincronización con *debounce*, ids temporales, borrados pendientes y reconciliación con `last-write-wins`. |
| [`frontend/types/models.ts`](frontend/types/models.ts) | Tipos del modelo de datos (entidades de servidor y objetos del lienzo). |

## Backend (Node.js + Express 5, CommonJS)

| Archivo | Qué muestra |
|---|---|
| [`backend/app.js`](backend/app.js) | Arranque de la API: helmet, CORS con lista blanca, `trust proxy`, limitadores, rutas por dominio y manejador de errores que no filtra detalles internos. |
| [`backend/routes/notes.routes.js`](backend/routes/notes.routes.js) | Rutas declarativas: auth → validación → controlador. |
| [`backend/middleware/validate.js`](backend/middleware/validate.js) | Validación y saneado de entradas declarativo, sin dependencias. |
| [`backend/services/openai.client.js`](backend/services/openai.client.js) | Cliente HTTP de OpenAI sin SDK: timeout por intento, plazo total, *backoff* exponencial con *jitter*, `Retry-After` y errores mapeados a HTTP. |
| [`backend/controllers/ai.controller.js`](backend/controllers/ai.controller.js) | Endpoints de IA. Los prompts reales **no se publican**: viven en un módulo privado. |
| [`backend/sql/schema.sql`](backend/sql/schema.sql) | Esquema PostgreSQL simplificado: relaciones, triggers (`updated_at`, recuento de palabras), índices parciales, GIN full-text y trigramas. |

## Qué se ha quitado y por qué

- **Autenticación, planes y cuotas**: describirían cómo funciona la seguridad del servicio en producción.
- **Prompts de IA**: son parte del valor del producto. En [`docs/ai-features.md`](../docs/ai-features.md) se explica qué hacen.
- **Políticas RLS, configuración de límites y despliegue**: se describen a alto nivel en [`docs/security.md`](../docs/security.md).
- **Logs de depuración y código muerto.**
