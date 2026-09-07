# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

## Gemini setup

The chat answers questions via the [Gemini REST API](https://ai.google.dev/), but the request is made **server-side** so the API key never reaches the client.

Local `.env`:

```
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.6-flash # optional override
```

Without the key the agent falls back to hardcoded mock responses, so `npm run dev` still works out of the box.

On Vercel, set `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`) in **Project → Settings → Environment Variables** — the `api/chat.ts` serverless function reads it from the server environment.

## Available scripts

- `npm run dev` — API server (`server/server.mjs`, :8787) + Vite dev server (HMR), `/api` proxied to the API server
- `npm run build` — typecheck (`tsc -b`) then bundle
- `npm run start` — standalone: serves `dist/` + `/api/chat` on one port (Node)
- `npm run preview` — serve the built `dist/` locally (`/api` proxied to the API server)

## Current plugins

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
