# AGENTS.md

## Project

React + TypeScript + Vite SPA — a chat widget with a mock AI assistant. UI is in Russian.

## Commands

- `npm run dev` — Vite dev server with HMR
- `npm run build` — runs `tsc -b && vite build` (typecheck then bundle; must pass sequentially)
- `npm run preview` — serves the built `dist/` locally

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
- No backend — AI responses are faked client-side with a 500–1500ms random delay
