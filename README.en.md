<a name="top"></a>

<p align="center">
  <a href="README.md">🇪🇸 Español</a> · <a href="README.en.md">🇬🇧 English</a>
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/banner-dark.svg">
    <img src="assets/banner-light.svg" alt="Beta3M — Handwritten notes on your tablet, supercharged with AI" width="100%">
  </picture>
</p>

<h3 align="center">Handwritten notes on your tablet, supercharged with AI</h3>

<p align="center">
  A web app for taking stylus notes on Android tablets and iPad: low-latency inking,<br>
  handwritten formulas turned into LaTeX, photo OCR and an AI study assistant.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/PWA_%28coming_soon%29-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA coming soon">
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI">
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel">
  <img src="https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white" alt="Railway">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/project-final_degree_%28DAM%29-048A81?style=flat-square" alt="Final degree project">
  <img src="https://img.shields.io/badge/status-active_development-d97706?style=flat-square" alt="Active development">
  <img src="https://img.shields.io/badge/source_code-private-555?style=flat-square&logo=lock&logoColor=white" alt="Private source code">
  <a href="https://marcgalvez2006.github.io/beta3m-showcase/"><img src="https://img.shields.io/badge/🌐_Project_website-048A81?style=flat-square" alt="Project website"></a>
</p>

<p align="center">
  <b><a href="#demo">Demo</a></b> ·
  <b><a href="#features">Features</a></b> ·
  <b><a href="#tech">Tech</a></b> ·
  <b><a href="#architecture">Architecture</a></b> ·
  <b><a href="#challenges">Challenges</a></b> ·
  <b><a href="#team">Team</a></b>
</p>

---

<a name="demo"></a>

## 🎬 Demo

<p align="center">
  <!-- TODO Marc: replace with assets/gifs/stylus-writing.gif once recorded -->
  <img src="assets/gifs/ink-demo.svg" alt="Stylus handwriting converted into a LaTeX formula" width="85%">
</p>

<!-- TODO Marc: demo URL. If the deployed app is public and shows no real data, add:
<p align="center"><a href="DEMO_URL"><img src="https://img.shields.io/badge/▶_Try_the_demo-048A81?style=for-the-badge" alt="Try the demo"></a></p>
-->

## 💡 The problem

Engineering and technical students fill pages with formulas, diagrams and exercises. iPad users
have polished handwriting apps, but **Android** has no equivalent **built for technical subjects**,
and none of them turn what you write into something you can study with. Beta3M combines the
freedom of paper with a structured editor and an AI that understands your notes.

<a name="features"></a>

## ✨ Features

<table>
  <tr>
    <td width="33%" valign="top">
      <h4>✍️ Low-latency stylus</h4>
      Custom ink engine built on Pointer Events, coalesced events and a two-layer canvas/SVG renderer.
      <br><br><img src="assets/screenshots/editor-light-landscape.svg" alt="Stylus editor">
    </td>
    <td width="33%" valign="top">
      <h4>∑ Formulas → LaTeX</h4>
      Handwrite an equation and it becomes LaTeX rendered with KaTeX.
      <br><br><img src="assets/gifs/ink-demo.svg" alt="Recognized handwritten formula">
    </td>
    <td width="33%" valign="top">
      <h4>📷 Photo OCR</h4>
      Whiteboards, books and handouts become editable notes, including formulas and tables.
      <br><br><img src="assets/screenshots/ocr-light-portrait.svg" alt="Photo turned into a note">
    </td>
  </tr>
  <tr>
    <td valign="top">
      <h4>🤖 AI for studying</h4>
      Improve, summarize, chat with your note, review questions and flashcards.
      <br><br><img src="assets/screenshots/ai-dark-portrait.svg" alt="AI summary and review">
    </td>
    <td valign="top">
      <h4>🔷 Shapes & lasso</h4>
      Freehand shapes snap into clean geometry. The lasso selects, moves and resizes.
      <br><br><img src="assets/screenshots/shapes-dark-landscape.svg" alt="Shapes and lasso">
    </td>
    <td valign="top">
      <h4>🗂️ Subjects</h4>
      Color- and emoji-coded subjects, full-text search and version history.
      <br><br><img src="assets/screenshots/dashboard-light-landscape.svg" alt="Subjects and notes">
    </td>
  </tr>
</table>

<table>
  <tr>
    <td>📴 <b>Offline-first</b><br><sub>Write without a connection; it syncs when you're back online.</sub></td>
    <td>📄 <b>Export</b><br><sub>PDF and Markdown.</sub></td>
    <td>🌗 <b>Light & dark mode</b><br><sub>And PDFs always print readable.</sub></td>
  </tr>
  <tr>
    <td>📏 <b>Ruler & tools</b><br><sub>Pencil, fountain pen, highlighter, eraser and ruler.</sub></td>
    <td>🔎 <b>Full-text search</b><br><sub>PostgreSQL GIN, with an offline fallback.</sub></td>
    <td>🧾 <b>Rich-text editor</b><br><sub>Tiptap: tables, code, formulas, <code>/</code> commands.</sub></td>
  </tr>
</table>

> 🧭 On the [roadmap](docs/roadmap.md): installable PWA, page backgrounds and left-handed mode.

## 🖼️ Gallery

<table>
  <tr>
    <td align="center"><img src="assets/screenshots/editor-light-landscape.svg" alt="Editor, light mode"><br><sub>Editor · light · landscape</sub></td>
    <td align="center"><img src="assets/screenshots/editor-dark-landscape.svg" alt="Editor, dark mode"><br><sub>Editor · dark · landscape</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="assets/screenshots/ocr-light-portrait.svg" alt="OCR, portrait" width="70%"><br><sub>Photo → note · light · portrait</sub></td>
    <td align="center"><img src="assets/screenshots/ai-dark-portrait.svg" alt="AI, portrait" width="70%"><br><sub>AI · dark · portrait</sub></td>
  </tr>
</table>

## ⚖️ How it compares

| | **Beta3M** | GoodNotes | Notion | Samsung Notes | Evernote |
|---|:---:|:---:|:---:|:---:|:---:|
| Stylus handwriting | ✅ | ✅ | ❌ | ✅ | ➖ |
| Structured text editor | ✅ | ➖ | ✅ | ➖ | ✅ |
| Handwritten formula → LaTeX | ✅ | ➖ | ❌ | ➖ | ❌ |
| Photo OCR with formulas | ✅ | ➖ | ❌ | ➖ | ➖ |
| AI review (questions, flashcards) | ✅ | ➖ | ➖ | ➖ | ❌ |
| Works offline | ✅ | ✅ | ➖ | ✅ | ➖ |
| Android + iPad + web | ✅ | ✅ | ✅ | ❌ | ✅ |
| Maturity & ecosystem | ➖ | ✅ | ✅ | ✅ | ✅ |

<sub>✅ yes · ➖ partial or paid · ❌ no. Indicative comparison (2026): other apps' features change often.</sub>

<a name="tech"></a>

## 🛠️ Tech stack

| Layer | Technology | Why |
|---|---|---|
| UI | <img src="https://skillicons.dev/icons?i=react,ts,vite,tailwind" height="28" alt="React, TypeScript, Vite, Tailwind"> | React 19 with strict TypeScript. Vite for fast builds and Tailwind 4 for the design system. |
| Editor | **Tiptap 3** + **KaTeX** | Extensible editor (custom formula and chart blocks) and fast LaTeX rendering without MathJax. |
| Ink | **Custom engine** (Pointer Events, Canvas, SVG) | No library offered the latency and control we needed. |
| State | **Zustand** | Small per-domain stores; selectors keep the editor from re-rendering. |
| Offline | **Dexie** (IndexedDB) | Typed local persistence and transactions for the sync queue. |
| API | <img src="https://skillicons.dev/icons?i=nodejs,express" height="28" alt="Node.js, Express"> | Express 5 (CommonJS): routes → controllers → services. |
| Data | <img src="https://skillicons.dev/icons?i=postgres,supabase" height="28" alt="PostgreSQL, Supabase"> | PostgreSQL for GIN full-text search, partial indexes and RLS. |
| Security | **bcrypt · JWT · helmet · express-rate-limit** | Defense in depth: see [security.md](docs/security.md). |
| AI | **OpenAI** `gpt-4o-mini` + vision | Good cost/quality balance, JSON outputs and image OCR. |
| Email | **Resend** | Account verification and password reset. |
| Deploy | <img src="https://skillicons.dev/icons?i=vercel" height="28" alt="Vercel"> **Vercel** + **Railway** | Static front end on a CDN and an API with continuous deployment from Git. |
| Tests | **Vitest** · `node:test` | Canvas geometry, validation, controllers and the AI client. |

<a name="architecture"></a>

## 🏗️ Architecture

```mermaid
flowchart LR
    subgraph Client["📱 Tablet / browser"]
        UI["React 19 + TS<br/>Tiptap · KaTeX · Zustand"]
        INK["Ink engine<br/>Pointer Events"]
        IDB[("IndexedDB<br/>Dexie")]
        UI <--> INK
        UI <--> IDB
    end
    API["⚙️ Node.js + Express API<br/>helmet · CORS · rate limit · JWT"]
    PG[("PostgreSQL<br/>Supabase + RLS")]
    OAI["OpenAI"]
    MAIL["Resend"]
    UI -- "HTTPS + JWT" --> API
    API --> PG
    API --> OAI
    API --> MAIL
```

<details>
<summary><b>Flow: write → save locally → sync</b></summary>

```mermaid
sequenceDiagram
    actor U as User
    participant S as notesStore
    participant D as IndexedDB
    participant W as Sync worker
    participant A as API
    U->>S: edits the note
    S->>D: immediate put
    S->>W: enqueue (merged per note)
    Note over W: waits until the user stops typing
    W->>A: PUT /notes/:id
    alt OK
        A-->>D: server version
    else offline
        W-->>W: re-enqueue
    end
```
</details>

<details>
<summary><b>Flow: photo → OCR → AI → note</b></summary>

```mermaid
sequenceDiagram
    actor U as User
    participant F as Front end
    participant A as API
    participant V as OpenAI (vision)
    U->>F: photo of the whiteboard
    F->>F: crop and compress
    F->>A: image + mode (text / formula / table)
    A->>A: auth · validation · usage limits
    A->>V: image + instructions
    V-->>A: text / LaTeX / table
    A-->>F: validated result
    F-->>U: editable note (KaTeX)
```
</details>

📚 Technical docs (Spanish): [architecture](docs/architecture.md) · [ink engine](docs/ink-engine.md) · [offline & sync](docs/offline-sync.md) · [AI & OCR](docs/ai-features.md) · [security](docs/security.md)

## 🗄️ Data model

```mermaid
erDiagram
    USERS ||--o{ SUBJECTS : creates
    USERS ||--o{ NOTES : writes
    SUBJECTS |o--o{ NOTES : groups
    NOTES ||--o{ NOTE_VERSIONS : history
    NOTES ||--o{ ATTACHMENTS : attaches
```

Full-text search with a **GIN** index, trigrams for partial matches, partial indexes over live notes
and triggers for `updated_at` and word counts. **Coming next**: normalized tags, AI usage analytics
and Stripe subscriptions → [database.md](docs/database.md).

<a name="challenges"></a>

## 🧗 Technical challenges

<details>
<summary><b>✍️ Stylus latency</b>: making writing feel like paper</summary>

**Problem.** A stylus reports at 120–240 Hz, but the browser delivers a single `pointermove` per
frame, and React re-renders on every `setState`. Fast writing produced jagged curves and a stroke
lagging behind the pen tip.

**Solution.**
- `getCoalescedEvents()` recovers every intermediate sample in the frame.
- Points live in a `useRef`: **zero `setState` per point**.
- Redraws batched with `requestAnimationFrame` (at most one per frame).
- **Two layers**: a canvas for the live stroke and SVG for finished strokes, which are never redrawn.
- Canvas size × `devicePixelRatio` via `ResizeObserver` for crisp HiDPI strokes.

**Result.** The stroke follows the tip at the display's refresh rate, and React only hears about it
when you lift the pen. → [ink-engine.md](docs/ink-engine.md) · [`InkCanvas.tsx`](code-samples/frontend/ink/InkCanvas.tsx)
</details>

<details>
<summary><b>🖐️ Palm rejection & gestures</b></summary>

**Problem.** While writing, your palm touches the screen and draws, or scrolls the page.

**Solution.** An **active pointer map** (`pointerId → position`) decides what each contact is:
the pen draws, a single finger is ignored in pen-only mode, two fingers pan. With
`touch-action: none` and pointer capture, the browser never hijacks the gesture.

**Result.** Rest your hand and pan with two fingers without switching tools.
→ [`useMultiTouch.ts`](code-samples/frontend/hooks/useMultiTouch.ts)
</details>

<details>
<summary><b>🔷 Shape recognition without AI</b></summary>

**Problem.** Sending every shape to a model would be slow and expensive. And the first algorithm
("similar radii from the center") turned squares into circles.

**Solution.** Pure on-device geometry: a **fill ratio** (shoelace polygon area ÷ bounding-box area:
rectangle ≈ 1, circle ≈ π/4, triangle ≈ ½), corner detection for ambiguous cases and an area check
for triangles.

**Result.** Instant classification, offline and free. → [`shapeDetection.ts`](code-samples/frontend/ink/shapeDetection.ts)
</details>

<details>
<summary><b>📴 Offline-first & conflicts</b></summary>

**Problem.** Classroom Wi-Fi fails, and losing a note is unacceptable.

**Solution.** Two layers: **IndexedDB instantly**, and the API later through a queue that merges
changes per note and uploads them once the user stops typing. Notes created offline get
**negative temporary ids**; pending deletions stop notes from "coming back". Conflicts are resolved
with last-write-wins on `updated_at`, with version history as a safety net.

**Result.** Writing never waits for the network. On reconnect, everything is uploaded in order.
→ [offline-sync.md](docs/offline-sync.md) · [`notesStore.ts`](code-samples/frontend/store/notesStore.ts)
</details>

<details>
<summary><b>💸 AI with cost control</b></summary>

**Problem.** Every call costs money, and a timeout must not end in three paid retries nobody reads.

**Solution.** A small model by default and vision only for images; `max_tokens` per feature;
trimmed context; size validation before calling; **retries with backoff and jitter inside an overall
deadline**; validated JSON outputs; per-user usage limits. Handwriting recognition went from two
calls to one.

**Result.** Predictable cost per action and clear errors (503 / 504 / 502) instead of endless waits.
→ [ai-features.md](docs/ai-features.md) · [`openai.client.js`](code-samples/backend/services/openai.client.js)
</details>

<details>
<summary><b>🌗 Dark mode in PDF export</b></summary>

**Problem.** With the dark theme on, PDFs came out with a black background and light text:
unreadable on paper and a waste of ink.

**Solution.** Export uses the browser's print engine (perfect typographic fidelity) with an
`@media print` stylesheet that **forces the light palette** whatever the theme, hides the UI and
floating controls, and switches type to points.

**Result.** The same note looks dark on screen and clean on paper.
</details>

## 📊 Project metrics

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript_%2B_TSX-~17.4k_lines-3178C6?style=for-the-badge" alt="~17.4k lines of TS">
  <img src="https://img.shields.io/badge/JavaScript_%2B_JSX-~5.4k_lines-F7DF1E?style=for-the-badge&labelColor=333" alt="~5.4k lines of JS">
  <img src="https://img.shields.io/badge/components-84-61DAFB?style=for-the-badge&labelColor=20232A" alt="84 components">
  <img src="https://img.shields.io/badge/REST_endpoints-45-339933?style=for-the-badge" alt="45 endpoints">
  <img src="https://img.shields.io/badge/commits-160%2B-d97706?style=for-the-badge" alt="160+ commits">
</p>

| | |
|---|---|
| 🧩 React components (`.tsx` / `.jsx`) | 84 |
| 🪝 Custom hooks | 24 |
| 🌐 REST endpoints | 45 |
| 🧪 Test files | 10 (Vitest + `node:test`) |
| 📅 Development | since February 2026 |

<sub>Non-blank lines, excluding dependencies, builds and tests.</sub>

## 🗺️ Roadmap

- [x] Ink engine, shapes, lasso and ruler
- [x] Handwriting → text and LaTeX · photo OCR
- [x] AI: improve, summarize, chat, review, flashcards
- [x] Offline-first with sync
- [x] Full-text search and version history
- [ ] 🚧 Installable PWA (service worker)
- [ ] 🚧 Page backgrounds · performance with thousands of strokes
- [ ] 🔭 Left-handed mode · Stripe · collaboration

→ [Full roadmap](docs/roadmap.md)

<a name="team"></a>

## 👥 Team

<table align="center">
  <tr>
    <td align="center" width="50%">
      <img src="https://github.com/marcgalvez2006.png?size=120" width="96" alt="Marc Gálvez"><br>
      <b>Marc Gálvez</b><br>
      <sub>Front end · ink engine · interface<br>AI, OCR and sync</sub><br><br>
      <a href="https://github.com/marcgalvez2006"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github" alt="Marc's GitHub"></a>
      <!-- TODO Marc: LinkedIn -->
    </td>
    <td align="center" width="50%">
      <!-- TODO Marc: confirm the link and that Ignasi agrees to appear here -->
      <img src="https://github.com/1ByNacho.png?size=120" width="96" alt="Ignasi Palau"><br>
      <b>Ignasi (Nacho) Palau</b><br>
      <sub>Back end · API · database<br>AI, OCR and sync</sub><br><br>
      <a href="https://github.com/1ByNacho"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github" alt="Ignasi's GitHub"></a>
    </td>
  </tr>
</table>

<p align="center"><sub>Final project for the Multiplatform Application Development (DAM) vocational degree.</sub></p>

## 🔒 About the code

> **The full source code is private.** This repository showcases the architecture, technical decisions
> and [selected excerpts](code-samples/). If you're a recruiter and would like to see more,
> get in touch and I'll give you a **live demo**.
>
> 📬 <!-- TODO Marc: contact link (LinkedIn / email) --> Contact: via my [GitHub profile](https://github.com/marcgalvez2006).

© 2026 Marc Gálvez & Ignasi Palau. **All rights reserved**: see [LICENSE](LICENSE).
You may view this content for evaluation purposes; copying, modifying or redistributing it is not permitted.

---

<p align="center">
  Made with ☕ in Barcelona<br>
  <a href="#top">⬆ Back to top</a>
</p>
