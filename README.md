# DrawLayout Studio

DrawLayout Studio is an experimental, production-minded Next.js app for quickly sketching layout wireframes on a canvas and compiling them into responsive Tailwind CSS markup.

This repository contains a full-stack prototype with a client canvas, compile API (AI-backed generator fallback), layout vault (save/load), and authentication integration points.

Key goals:
- Fast sketch → Tailwind workflow (sketch, compile, preview, export)
- Lightweight, reactive state (Zustand) for canvas + compiler
- Server routes for compiling and storing layouts
- Clear separation between UI, state, and server logic for easy production hardening

---

## Features

- Canvas-based sketching: brushes, rectangles, text blocks, panning + zoom
- Tooling panel with undo/redo, clear canvas, stroke color/width
- Compile endpoint (`/api/compile`) that converts canvas data into HTML/Tailwind (uses Gemini/AI when API key provided; fallback sample returned otherwise)
- Live preview iframe and code inspector with HTML/React/Vue tabs and copy functionality
- Vault API (`/api/vault`) to persist layouts per-user (requires auth)
- Drizzle schema and database wiring prepared for PostgreSQL

---

## Quick Start (local)

Prerequisites
- Node 18+ (or the version required by Next.js in package.json)
- PostgreSQL database (optional unless you want persistence)

Install and run locally

```bash
npm install
cp .env.example .env.local
# edit .env.local to add your DATABASE_URL, BETTER_AUTH_SECRET, GEMINI_API_KEY, etc.
npm run dev
```

Open http://localhost:3000

Available npm scripts
- `npm run dev` — start development server
- `npm run build` — build for production
- `npm start` — run built app
- `npm run lint` — run ESLint

---

## Environment Variables

Copy `.env.example` to `.env.local` and set values. Important variables:

- `DATABASE_URL` — Postgres connection string used by Drizzle (optional for sketches, required for vault/auth persistence)
- `BETTER_AUTH_SECRET` — secret used by Better Auth adapter
- `BETTER_AUTH_URL` — application base URL for auth callbacks
- `GEMINI_API_KEY` — API key for the Gemini/AI compile flow (if not present, the app returns a static fallback layout)

Security note: Never commit `.env.local` with secrets. Use your platform's secret storage for deployments (Vercel/Netlify/AWS/GCP).

---

## Project Structure (high level)

- `app/` — Next.js App Router pages and API routes
  - `app/api/compile/route.ts` — compile endpoint
  - `app/api/vault/route.ts` — vault save/load endpoint
- `components/` — React UI components: `Toolbar`, `DrawingCanvas`, `LivePreview`, `CodeInspector`, `LayoutVault`, `AuthStatus`
- `store/` — Zustand stores: `canvasStore.ts`, `compilerStore.ts`
- `lib/` — backend helpers: `db.ts`, `auth.ts`, `gemini.ts` (AI prompt + request)
- `db/` — Drizzle schema definitions
- `types/` — shared TypeScript types

Refer to these files when extending features or hardening APIs.

---

## API Endpoints

- `POST /api/compile` — Accepts `{ canvasElements: CanvasElement[] }` and returns generated `code` (HTML) and optional `warning` or `error`. When `GEMINI_API_KEY` is missing, a fallback static example is returned.
- `GET /api/vault` — Returns saved layouts for authenticated user.
- `POST /api/vault` — Saves a named layout for the authenticated user: `{ name: string, data: CanvasElement[] }`.

All API responses are JSON and use appropriate HTTP status codes (200, 201, 400, 401, 500). See `app/api/*/route.ts` for details.

---

## Development Notes & Production Hardening Recommendations

1. Database and Auth
	- Provide a real `DATABASE_URL` and run migrations using `drizzle-kit`.
	- Configure `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` before enabling the vault and auth flows.

2. AI Compile
	- `lib/gemini.ts` contains the prompt and HTTP call to the Gemini endpoint. Validate API quotas and sanitize user input before sending to the model.

3. Security
	- Sanitize and validate all inputs server-side (some validation is already present in `app/api/vault/route.ts`).
	- Use HTTP-only cookies for sessions and enable CSRF protections if enabling cookie-auth flows.

4. Observability
	- Add structured logging for server routes and add Sentry/Logflare for error monitoring.

5. Testing
	- Add unit tests for the API handlers and integration tests for end-to-end compile+preview flows.

---

## CI / GitHub

Suggested GitHub Actions workflow (example):

1. Install & cache Node modules
2. Run `npm ci` and `npm run build`
3. Run TypeScript typecheck and `npm run lint`

You can add a `.github/workflows/ci.yml` that runs the steps above on pull requests.

---

## Contributing

Contributions are welcome. A suggested workflow:

1. Fork the repository
2. Create a feature branch
3. Run and update tests / linting
4. Open a PR with a clear description and screenshots for UI changes

For larger architectural changes (auth, DB migrations, deploy), open an issue first to discuss design.

---

## License

This repository does not include a license by default. Add a `LICENSE` file (MIT, Apache-2.0, etc.) to make the project open source.

---

If you want, I can:

- Add a CI workflow file for GitHub Actions.
- Add test scaffolding for the API routes.
- Create a `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md`.

Tell me which you'd like me to add next.
