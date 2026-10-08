<a name="top"></a>

<p align="center">
  <a href="README.md">🇪🇸 Español</a> · <a href="README.en.md">🇬🇧 English</a>
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/banner-dark.svg">
    <img src="assets/banner-light.svg" alt="Beta3M — Apuntes a mano en tablet, potenciados con IA" width="100%">
  </picture>
</p>

<h3 align="center">Apuntes a mano en tablet, potenciados con IA</h3>

<p align="center">
  App web para tomar apuntes con stylus en tablets Android e iPad: escritura de baja latencia,<br>
  fórmulas manuscritas convertidas en LaTeX, OCR de fotos y un asistente de estudio con IA.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/PWA_%28en_camino%29-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA en camino">
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI">
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
  <img src="https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white" alt="Railway">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Proyecto-DAM-048A81?style=flat-square" alt="Proyecto DAM">
  <img src="https://img.shields.io/badge/estado-en_desarrollo_activo-d97706?style=flat-square" alt="En desarrollo activo">
  <img src="https://img.shields.io/badge/c%C3%B3digo_fuente-privado-555?style=flat-square&logo=lock&logoColor=white" alt="Código fuente privado">
  <a href="https://marcgaalvez.github.io/beta3m-showcase/"><img src="https://img.shields.io/badge/🌐_Web_del_proyecto-048A81?style=flat-square" alt="Web del proyecto"></a>
</p>

<p align="center">
  <b><a href="#demo">Demo</a></b> ·
  <b><a href="#features">Features</a></b> ·
  <b><a href="#tech">Tech</a></b> ·
  <b><a href="#arquitectura">Arquitectura</a></b> ·
  <b><a href="#retos">Retos</a></b> ·
  <b><a href="#equipo">Equipo</a></b>
</p>

---

<a name="demo"></a>

## 🎬 Demo

<p align="center">
  <!-- TODO Marc: sustituir por assets/gifs/stylus-writing.gif cuando esté grabado -->
  <img src="assets/gifs/ink-demo.svg" alt="Escritura con stylus convertida en una fórmula LaTeX" width="85%">
</p>

<!-- TODO Marc: URL demo. Si la web desplegada es pública y no muestra datos reales, añadir aquí:
<p align="center"><a href="URL_DEMO"><img src="https://img.shields.io/badge/▶_Probar_la_demo-048A81?style=for-the-badge" alt="Probar la demo"></a></p>
-->

## 💡 El problema

Los estudiantes de carreras y ciclos técnicos llenan páginas de fórmulas, diagramas y
ejercicios. En iPad tienen apps de apuntes a mano muy pulidas, pero en **Android** no hay una
alternativa equivalente **pensada para asignaturas técnicas**, y ninguna convierte lo que escribes
en algo con lo que estudiar. Beta3M une la libertad del papel con un editor estructurado
y una IA que entiende tus apuntes.

<a name="features"></a>

## ✨ Features

<table>
  <tr>
    <td width="33%" valign="top">
      <h4>✍️ Stylus de baja latencia</h4>
      Motor de tinta propio con Pointer Events, eventos agrupados y doble capa canvas/SVG.
      <br><br><img src="assets/screenshots/editor-light-landscape.svg" alt="Editor con stylus">
    </td>
    <td width="33%" valign="top">
      <h4>∑ Fórmulas → LaTeX</h4>
      Escribe una ecuación a mano y se convierte en LaTeX renderizado con KaTeX.
      <br><br><img src="assets/gifs/ink-demo.svg" alt="Fórmula manuscrita reconocida">
    </td>
    <td width="33%" valign="top">
      <h4>📷 OCR de fotos</h4>
      Pizarras, libros y fichas pasan a ser un apunte editable, con fórmulas y tablas.
      <br><br><img src="assets/screenshots/ocr-light-portrait.svg" alt="Foto convertida en apunte">
    </td>
  </tr>
  <tr>
    <td valign="top">
      <h4>🤖 IA para estudiar</h4>
      Mejorar, resumir, chatear con la nota, preguntas de repaso y flashcards.
      <br><br><img src="assets/screenshots/ai-dark-portrait.svg" alt="IA: resumen y repaso">
    </td>
    <td valign="top">
      <h4>🔷 Formas y lazo</h4>
      Las figuras a mano alzada se enderezan solas. El lazo selecciona, mueve y redimensiona.
      <br><br><img src="assets/screenshots/shapes-dark-landscape.svg" alt="Formas y lazo">
    </td>
    <td valign="top">
      <h4>🗂️ Asignaturas</h4>
      Organización por asignaturas con color y emoji, búsqueda full-text e historial de versiones.
      <br><br><img src="assets/screenshots/dashboard-light-landscape.svg" alt="Asignaturas y notas">
    </td>
  </tr>
</table>

<table>
  <tr>
    <td>📴 <b>Offline-first</b><br><sub>Escribe sin conexión: se sincroniza al volver la red.</sub></td>
    <td>📄 <b>Exportación</b><br><sub>PDF y Markdown.</sub></td>
    <td>🌗 <b>Modo claro y oscuro</b><br><sub>Y el PDF sale siempre legible.</sub></td>
  </tr>
  <tr>
    <td>📏 <b>Regla y herramientas</b><br><sub>Lápiz, pluma, subrayador, goma y regla.</sub></td>
    <td>🔎 <b>Búsqueda full-text</b><br><sub>PostgreSQL GIN, con alternativa offline.</sub></td>
    <td>🧾 <b>Editor enriquecido</b><br><sub>Tiptap: tablas, código, fórmulas, comandos <code>/</code>.</sub></td>
  </tr>
</table>

> 🧭 En el [roadmap](docs/roadmap.md): PWA instalable, fondos de página y modo zurdo.

## 🖼️ Galería

<table>
  <tr>
    <td align="center"><img src="assets/screenshots/editor-light-landscape.svg" alt="Editor, modo claro"><br><sub>Editor · claro · horizontal</sub></td>
    <td align="center"><img src="assets/screenshots/editor-dark-landscape.svg" alt="Editor, modo oscuro"><br><sub>Editor · oscuro · horizontal</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="assets/screenshots/ocr-light-portrait.svg" alt="OCR, vertical" width="70%"><br><sub>Foto → apunte · claro · vertical</sub></td>
    <td align="center"><img src="assets/screenshots/ai-dark-portrait.svg" alt="IA, vertical" width="70%"><br><sub>IA · oscuro · vertical</sub></td>
  </tr>
</table>

## ⚖️ Comparativa

| | **Beta3M** | GoodNotes | Notion | Samsung Notes | Evernote |
|---|:---:|:---:|:---:|:---:|:---:|
| Escritura a mano con stylus | ✅ | ✅ | ❌ | ✅ | ➖ |
| Editor de texto estructurado | ✅ | ➖ | ✅ | ➖ | ✅ |
| Fórmula manuscrita → LaTeX | ✅ | ➖ | ❌ | ➖ | ❌ |
| OCR de fotos con fórmulas | ✅ | ➖ | ❌ | ➖ | ➖ |
| Repaso con IA (preguntas, flashcards) | ✅ | ➖ | ➖ | ➖ | ❌ |
| Funciona sin conexión | ✅ | ✅ | ➖ | ✅ | ➖ |
| Android + iPad + web | ✅ | ✅ | ✅ | ❌ | ✅ |
| Madurez y ecosistema | ➖ | ✅ | ✅ | ✅ | ✅ |

<sub>✅ sí · ➖ parcial o de pago · ❌ no. Comparativa orientativa (2026): las funciones de otras apps cambian a menudo.</sub>

<a name="tech"></a>

## 🛠️ Tech stack

| Capa | Tecnología | Por qué |
|---|---|---|
| UI | <img src="https://skillicons.dev/icons?i=react,ts,vite,tailwind" height="28" alt="React, TypeScript, Vite, Tailwind"> | React 19 y TypeScript estricto. Vite para builds rápidos y Tailwind 4 para el sistema de diseño. |
| Editor | **Tiptap 3** + **KaTeX** | Editor extensible (bloques propios de fórmulas y gráficos) y render de LaTeX rápido sin MathJax. |
| Tinta | **Motor propio** (Pointer Events, Canvas, SVG) | Ninguna librería daba la latencia y el control necesarios. |
| Estado | **Zustand** | Stores pequeños por dominio y selectores que evitan renders en el editor. |
| Offline | **Dexie** (IndexedDB) | Persistencia local tipada y transacciones para la cola de sincronización. |
| API | <img src="https://skillicons.dev/icons?i=nodejs,express" height="28" alt="Node.js, Express"> | Express 5 en CommonJS, rutas → controladores → servicios. |
| Datos | <img src="https://skillicons.dev/icons?i=postgres,supabase" height="28" alt="PostgreSQL, Supabase"> | PostgreSQL por la búsqueda full-text con GIN, los índices parciales y RLS. |
| Seguridad | **bcrypt · JWT · helmet · express-rate-limit** | Defensa en capas: ver [security.md](docs/security.md). |
| IA | **OpenAI** `gpt-4o-mini` + visión | Buen equilibrio coste/calidad, salidas JSON y OCR de imágenes. |
| Email | **Resend** | Verificación de cuenta y recuperación de contraseña. |
| Deploy | <img src="https://skillicons.dev/icons?i=vercel" height="28" alt="Vercel"> **Vercel** + **Railway** | Front estático en CDN y API con despliegue continuo desde Git. |
| Tests | **Vitest** · `node:test` | Geometría del lienzo, validación, controladores y cliente de IA. |

<a name="arquitectura"></a>

## 🏗️ Arquitectura

```mermaid
flowchart LR
    subgraph Cliente["📱 Tablet / navegador"]
        UI["React 19 + TS<br/>Tiptap · KaTeX · Zustand"]
        INK["Motor de tinta<br/>Pointer Events"]
        IDB[("IndexedDB<br/>Dexie")]
        UI <--> INK
        UI <--> IDB
    end
    API["⚙️ API Node.js + Express<br/>helmet · CORS · rate limit · JWT"]
    PG[("PostgreSQL<br/>Supabase + RLS")]
    OAI["OpenAI"]
    MAIL["Resend"]
    UI -- "HTTPS + JWT" --> API
    API --> PG
    API --> OAI
    API --> MAIL
```

<details>
<summary><b>Flujo: escribir → guardar en local → sincronizar</b></summary>

```mermaid
sequenceDiagram
    actor U as Usuario
    participant S as notesStore
    participant D as IndexedDB
    participant W as Worker de sync
    participant A as API
    U->>S: edita la nota
    S->>D: put inmediato
    S->>W: encola (fusiona por nota)
    Note over W: espera a que el usuario deje de escribir
    W->>A: PUT /notes/:id
    alt OK
        A-->>D: versión del servidor
    else sin red
        W-->>W: re-encola
    end
```
</details>

<details>
<summary><b>Flujo: foto → OCR → IA → apunte</b></summary>

```mermaid
sequenceDiagram
    actor U as Usuario
    participant F as Frontend
    participant A as API
    participant V as OpenAI (visión)
    U->>F: foto de la pizarra
    F->>F: recorte y compresión
    F->>A: imagen + modo (texto / fórmula / tabla)
    A->>A: auth · validación · límites
    A->>V: imagen + instrucciones
    V-->>A: texto / LaTeX / tabla
    A-->>F: resultado validado
    F-->>U: apunte editable (KaTeX)
```
</details>

📚 Documentación técnica: [arquitectura](docs/architecture.md) · [motor de tinta](docs/ink-engine.md) · [offline y sync](docs/offline-sync.md) · [IA y OCR](docs/ai-features.md) · [seguridad](docs/security.md)

## 🗄️ Modelo de datos

```mermaid
erDiagram
    USERS ||--o{ SUBJECTS : crea
    USERS ||--o{ NOTES : escribe
    SUBJECTS |o--o{ NOTES : agrupa
    NOTES ||--o{ NOTE_VERSIONS : historial
    NOTES ||--o{ ATTACHMENTS : adjunta
```

Full-text search con índice **GIN**, trigramas para búsqueda parcial, índices parciales sobre las
notas activas y triggers para `updated_at` y el recuento de palabras. **Próximas versiones**:
etiquetas normalizadas, analítica de uso de IA y suscripciones con Stripe → [database.md](docs/database.md).

<a name="retos"></a>

## 🧗 Retos técnicos

<details>
<summary><b>✍️ Latencia del stylus</b>: que escribir se sienta como en papel</summary>

**Problema.** Un stylus reporta a 120–240 Hz, pero el navegador entrega un solo `pointermove` por
frame, y React renderiza en cada `setState`. Escribiendo deprisa, las curvas salían a trozos
rectos y el trazo iba por detrás de la punta.

**Solución.**
- `getCoalescedEvents()` recupera todas las muestras intermedias del frame.
- Los puntos viven en un `useRef`: **cero `setState` por punto**.
- Repintado agrupado con `requestAnimationFrame` (máximo uno por frame).
- **Doble capa**: canvas para el trazo en vivo y SVG para los trazos terminados, que no se repintan.
- Tamaño del canvas × `devicePixelRatio` con `ResizeObserver`, para un trazo nítido en HiDPI.

**Resultado.** El trazo sigue a la punta a la tasa de refresco de la pantalla y React no se entera
hasta que levantas el lápiz. → [ink-engine.md](docs/ink-engine.md) · [`InkCanvas.tsx`](code-samples/frontend/ink/InkCanvas.tsx)
</details>

<details>
<summary><b>🖐️ Palm rejection y gestos</b></summary>

**Problema.** Al escribir, la palma toca la pantalla y pinta, o hace scroll.

**Solución.** Un **mapa de punteros activos** (`pointerId → posición`) decide qué es cada contacto:
el lápiz dibuja, un dedo se ignora en modo solo lápiz y dos dedos desplazan la página. Con
`touch-action: none` y *pointer capture*, el navegador no se queda el gesto.

**Resultado.** Puedes apoyar la mano y desplazarte con dos dedos sin cambiar de herramienta.
→ [`useMultiTouch.ts`](code-samples/frontend/hooks/useMultiTouch.ts)
</details>

<details>
<summary><b>🔷 Reconocer figuras sin IA</b></summary>

**Problema.** Enviar cada figura a un modelo sería lento y caro. Y el primer algoritmo
("radios parecidos al centro") convertía los cuadrados en círculos.

**Solución.** Geometría pura en el dispositivo: **ratio de relleno** (área por la fórmula de Gauss
÷ área de la caja: rectángulo ≈ 1, círculo ≈ π/4, triángulo ≈ ½), detección de esquinas para
los casos dudosos y validación de áreas para los triángulos.

**Resultado.** Clasificación instantánea, sin red y sin coste. → [`shapeDetection.ts`](code-samples/frontend/ink/shapeDetection.ts)
</details>

<details>
<summary><b>📴 Offline-first y conflictos</b></summary>

**Problema.** En clase el wifi falla, y perder un apunte es inaceptable.

**Solución.** Dos capas: **IndexedDB al instante** y la API en diferido mediante una cola que
fusiona cambios por nota y los sube cuando el usuario deja de escribir. Las notas creadas sin
conexión usan **ids temporales negativos**; los borrados pendientes evitan que una nota "resucite".
Los conflictos se resuelven con *last-write-wins* por `updated_at`, con el historial de versiones como red de seguridad.

**Resultado.** Escribir nunca espera a la red. Al reconectar se sube todo en orden.
→ [offline-sync.md](docs/offline-sync.md) · [`notesStore.ts`](code-samples/frontend/store/notesStore.ts)
</details>

<details>
<summary><b>💸 IA con control de coste</b></summary>

**Problema.** Cada llamada cuesta dinero, y un timeout no debe acabar en tres reintentos pagados que nadie lee.

**Solución.** Modelo pequeño por defecto y visión solo con imágenes; `max_tokens` por función;
contexto recortado; validación de tamaño antes de llamar; **reintentos con *backoff* y *jitter* dentro
de un plazo total**; salidas JSON validadas; límites de uso por usuario. El reconocimiento de
escritura pasó de dos llamadas a una.

**Resultado.** Coste por acción predecible y errores claros (503 / 504 / 502) en lugar de esperas
infinitas. → [ai-features.md](docs/ai-features.md) · [`openai.client.js`](code-samples/backend/services/openai.client.js)
</details>

<details>
<summary><b>🌗 Modo oscuro en la exportación a PDF</b></summary>

**Problema.** Con el tema oscuro activo, el PDF salía con fondo negro y texto claro: ilegible al
imprimirlo y un desperdicio de tinta.

**Solución.** La exportación usa el motor de impresión del navegador (fidelidad tipográfica
perfecta) con una hoja `@media print` que **fuerza la paleta clara** sea cual sea el tema, oculta
la interfaz y los controles flotantes y ajusta la tipografía a puntos.

**Resultado.** El mismo apunte se ve oscuro en pantalla y limpio en papel.
</details>

## 📊 Métricas del proyecto

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript_%2B_TSX-~17.4k_líneas-3178C6?style=for-the-badge" alt="~17.4k líneas TS">
  <img src="https://img.shields.io/badge/JavaScript_%2B_JSX-~5.4k_líneas-F7DF1E?style=for-the-badge&labelColor=333" alt="~5.4k líneas JS">
  <img src="https://img.shields.io/badge/componentes-84-61DAFB?style=for-the-badge&labelColor=20232A" alt="84 componentes">
  <img src="https://img.shields.io/badge/endpoints_REST-45-339933?style=for-the-badge" alt="45 endpoints">
  <img src="https://img.shields.io/badge/commits-160%2B-d97706?style=for-the-badge" alt="160+ commits">
</p>

| | |
|---|---|
| 🧩 Componentes React (`.tsx` / `.jsx`) | 84 |
| 🪝 Hooks propios | 24 |
| 🌐 Endpoints REST | 45 |
| 🧪 Archivos de test | 10 (Vitest + `node:test`) |
| 📅 Desarrollo | desde febrero de 2026 |

<sub>Líneas sin contar las vacías, ni dependencias, builds o tests.</sub>

## 🗺️ Roadmap

- [x] Motor de tinta, formas, lazo y regla
- [x] Escritura → texto y LaTeX · OCR de fotos
- [x] IA: mejorar, resumir, chat, repaso, flashcards
- [x] Offline-first con sincronización
- [x] Búsqueda full-text e historial de versiones
- [ ] 🚧 PWA instalable (service worker)
- [ ] 🚧 Fondos de página · rendimiento con miles de trazos
- [ ] 🔭 Modo zurdo · Stripe · colaboración

→ [Roadmap completo](docs/roadmap.md)

<a name="equipo"></a>

## 👥 Equipo

<table align="center">
  <tr>
    <td align="center" width="50%">
      <img src="https://github.com/marcgaalvez.png?size=120" width="96" alt="Marc Gálvez"><br>
      <b>Marc Gálvez</b><br>
      <sub>Frontend · motor de tinta · interfaz<br>IA, OCR y sincronización</sub><br><br>
      <a href="https://github.com/marcgaalvez"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github" alt="GitHub de Marc"></a>
      <a href="https://www.linkedin.com/search/results/people/?keywords=Marc%20G%C3%A1lvez%20Comajuan"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn de Marc"></a>
      <a href="mailto:marcgalvezcomajuan@gmail.com"><img src="https://img.shields.io/badge/Email-048A81?style=flat-square&logo=gmail&logoColor=white" alt="Email"></a>
    </td>
    <td align="center" width="50%">
      <!-- TODO Marc: confirmar enlace y que Ignasi está de acuerdo en aparecer -->
      <img src="https://github.com/1ByNacho.png?size=120" width="96" alt="Ignasi Palau"><br>
      <b>Ignasi (Nacho) Palau</b><br>
      <sub>Backend · API · base de datos<br>IA, OCR y sincronización</sub><br><br>
      <a href="https://github.com/1ByNacho"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github" alt="GitHub de Ignasi"></a>
    </td>
  </tr>
</table>

<p align="center"><sub>Proyecto de final de ciclo de Desarrollo de Aplicaciones Multiplataforma (DAM).</sub></p>

## 🔒 Sobre el código

> **El código fuente completo es privado.** Este repositorio muestra la arquitectura, las decisiones
> técnicas y [extractos seleccionados](code-samples/). Si eres reclutador/a y quieres ver más,
> escríbeme y hago una **demo en directo**.
>
> 📬 Contacto: [marcgalvezcomajuan@gmail.com](mailto:marcgalvezcomajuan@gmail.com) · [LinkedIn — Marc Gálvez Comajuan](https://www.linkedin.com/search/results/people/?keywords=Marc%20G%C3%A1lvez%20Comajuan)

© 2026 Marc Gálvez & Ignasi Palau. **Todos los derechos reservados**: ver [LICENSE](LICENSE).
Se permite ver el contenido con fines de evaluación; no se permite copiarlo, modificarlo ni redistribuirlo.

---

<p align="center">
  Hecho con ☕ en Barcelona<br>
  <a href="#top">⬆ Volver arriba</a>
</p>
