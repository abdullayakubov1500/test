# AGENTS.md

## Project

React + TypeScript + Vite SPA — a chat widget with a mock AI assistant. UI is in Russian.

## Commands

- `npm run dev` — starts the API server (`server/server.mjs` on :8787) plus the Vite dev server (HMR); Vite proxies `/api` to the API server
- `npm run build` — runs `tsc -b && vite build` (typecheck then bundle; must pass sequentially)
- `npm run start` — standalone server: serves `dist/` + `/api/chat` (Node, `server/server.mjs`)
- `npm run preview` — serves the built `dist/` locally (with `/api` proxied to the API server)

## Linting

Uses **Oxlint** (not ESLint). Config: `.oxlintrc.json`. Rules: `react/rules-of-hooks` (error), `react/only-export-components` (warn).

## TypeScript

Two-project references setup:
- `tsconfig.app.json` — all source in `src/`, target `es2023`, JSX `react-jsx`, strict unused checks (`noUnusedLocals`, `noUnusedParameters`)
- `tsconfig.node.json` — only `vite.config.ts`
- `verbatimModuleSyntax: true` — use `import type` for type-only imports

## Source structure

```
src/
  main.tsx          — React root, StrictMode
  App.tsx           — toggles ChatWidget ↔ ChatWindow via useChat hook
  hooks/useChat.ts  — state + mock AI responses (random from hardcoded list)
  components/       — ChatWidget, ChatWindow, Header, MessageList, Message, ChatInput
  types/index.ts    — Message interface
  App.css / index.css
public/             — favicon.svg, icons.svg
```

## Key details

- `dist/` is gitignored but currently present — do not depend on it being fresh
- No test framework, no CI config, no formatter config
- All AI responses are generated **server-side**: the Gemini key never reaches the client
  - `server/gemini.mjs` — calls the Gemini REST API using `GEMINI_API_KEY` / `GEMINI_MODEL` from the server env (`.env` locally, Vercel env vars in production); contains the agent system prompt
  - `server/chatHandler.mjs` — request validation + shared `handleChat()` used by both the local server and the Vercel function
  - `server/server.mjs` — Node HTTP server for local dev / `npm start`; serves `dist/` and `POST /api/chat`
  - `api/chat.ts` — Vercel serverless function (same behavior as the local endpoint)
  - `src/lib/api.ts` — client posts message history to `/api/chat`; the chat hook falls back to hardcoded mock responses on any server failure (min typing delay ~700ms keeps the typing indicator visible)
