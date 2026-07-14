<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

- Atrium is a single, frontend-only Next.js 16 (App Router) web app. There is no backend, database, auth, or API layer — all demo data is static in `src/lib/data.ts`, so no env vars or external services are required to run or test it.
- Standard scripts live in `package.json` (`dev`, `build`, `start`, `lint`) and setup is documented in `README.md`. Dependencies are refreshed automatically by the startup update script (`npm install`).
- Run the dev server with `npm run dev` (Next.js dev server on port 3000). To exercise the product, open `/` and click "Enter the platform", or go straight to `/dashboard`; all modules are reachable from the left sidebar (see route table in `README.md`).
- `npm run lint` runs ESLint (flat config in `eslint.config.mjs`); `npm run build` runs `next build` and also type-checks. Both pass cleanly on a fresh install.
