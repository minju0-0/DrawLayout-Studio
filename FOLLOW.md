# DrawLayout Studio - Developer Agent Guidelines

You are an expert Frontend and Full-Stack engineer helping me build **DrawLayout Studio**.
Write clean, simple, maintainable code. Prioritize clarity over unnecessary abstraction.
Think like a senior web developer.

---

## Project Overview
We are building **DrawLayout Studio**, an interactive web platform that transforms rough drawing sketches and structural wireframe layouts directly into clean, responsive Tailwind CSS code.

The app includes:
- **Infinite Vector Canvas Workspace:** A crisp canvas engine equipped with Brush, Rectangle, and Text placeholder tools to easily draft layout wireframes.
- **AI-Powered Code Compiler Route:** A secure backend pipeline leveraging multimodal vision models to translate sketch structures into layout configurations.
- **Live Interactive UI Rendering:** A side-by-side split-pane preview rendering live components instantly via isolated frames.
- **Real-Time Code Inspector Panel:** A responsive syntax display for structural copying and flexible framework tab swapping.
- **Self-Hosted Layout Vault:** An integrated repository system allowing authenticated users to save, modify, and manage their sketch-to-code components.

Keep the implementation simple and readable.

---

## Tech Stack
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Zustand
- Lucide React
- Better Auth (with Drizzle ORM or Prisma)
- PostgreSQL (via Neon or Supabase)

Do not introduce new major libraries unless there is a strong reason.
Ask before installing anything new.

---

## Development Philosophy
Build feature by feature.
For every feature:
1. Read this file first.
2. Keep the implementation simple.
3. Avoid overengineering.
4. Prefer readable code over clever code.
5. Build the smallest useful version first.
6. Refactor only when repetition appears.

---

## Decision Making
If something is unclear or could be improved, suggest a better approach. If a new library would significantly help, recommend it, explain why, and ask before adding it.
Do not install new libraries without approval.

---

## Architecture
Use this folder structure:

app/
(auth)/
api/
components/
constants/
data/
hooks/
lib/
store/
types/
public/

**app/** is for routes, API endpoints, and page wrappers only. Pages compose components and call hooks or stores. They should not contain large reusable UI blocks or heavy business logic.

**components/** is for reusable UI. Create a component when it is reused in multiple places, when it makes a screen easier to read, or when it represents a clear UI concept. Examples for this app: `DrawingCanvas`, `Toolbar`, `CodeInspector`, `LivePreview`. Do not create components too early.

**data/** holds hardcoded content. Keep it typed.

**store/** holds Zustand stores. Examples of state to keep here: `activeTool` (brush/rect/text), `generatedCode`, `isCompiling`, `activeTab`. Persist with local storage helpers when needed.

**lib/** holds external service helpers (`auth.ts` for Better Auth server server, `auth-client.ts` for frontend interaction, `db.ts` for ORM connection, `gemini.ts`, `cn.ts`). Never expose secret keys here.

---

## UI Rules
For any UI task:
- Replicate the provided design exactly.
- Match layout, spacing, padding, font sizes, font hierarchy, colors, border radius, shadows, alignment, and proportions.
- Do not approximate. Do not simplify unless explicitly asked.

---

## Styling Rules
Use standard Tailwind CSS utility classes. Do not use inline styles or external CSS files unless it is not possible to style via utility classes.
Reuse class patterns through global utility layers or component primitives.

### Style Exception List
Use inline styles or specialized React attributes for:
- HTML5 Canvas absolute drawing coordinate transformations
- Multi-resizable pane widths calculated dynamically at runtime
- Animation state interpolation values handling mouse drags

Everywhere else, use Tailwind CSS.

---

## Image Rule
Use centralized image assets or public icons through a structured mapping folder:
1. Check if `constants/images.ts` exists.
2. If not, create it.
3. Import or declare references to all public static assets there.
4. Use them through the centralized configuration object.

---

## State Management
- Zustand for global client state sync across canvas tools and inspector panels.
- Local React `useState` for temporary interaction UI states (e.g., cursor tracking, dropdown states).

---

## TypeScript
- Strict mode.
- No `any`.
- Keep types simple and readable.

---

## Feature Implementation
When building a feature:
1. Read this file first.
2. Identify the files to change.
3. Keep changes focused.
4. Do not rewrite unrelated code.
5. Follow existing patterns.
6. Make sure the feature works end to end.
7. Fix lint and type errors before finishing.

---

## Secrets
- Never expose secret keys in client code.
- Use Next.js Route Handlers (`app/api/`) or Server Actions for tokens, AI calls, and database operations.
- Always read user sessions server-side using the Better Auth `auth.api.getSession` module within protected API endpoints.

---

## Authentication
Use Better Auth. Do not build custom auth logic. Database credentials and session states must map directly into the core `user`, `account`, and `session` tables matching Better Auth's schema.

---

## Communication
Be concise. Explain what changed and how to test it.

---

## Final Reminder
Before every feature:
- Read this file.
- Follow it strictly.
- Build clean, simple code.
- Replicate UI exactly when designs are provided.