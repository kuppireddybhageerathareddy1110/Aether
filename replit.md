# Aether — Benchmark AI-Native Research & Knowledge Platform

Aether is a production-grade research platform that unifies document intelligence, knowledge graphs, explainable AI, collaborative authoring, automated QA, and personal research journaling into one cohesive app.

## Run & Operate

- `pnpm --filter @workspace/aether run dev` — run the frontend (port assigned by workflow)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (Tailwind CSS, wouter routing, @tanstack/react-query)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/aether/` — React + Vite frontend (ported from Next.js)
- `artifacts/aether/src/pages/` — all 26 route pages
- `artifacts/aether/src/components/Sidebar.tsx` — navigation sidebar
- `artifacts/api-server/` — Express backend
- `lib/db/` — Drizzle ORM schema (PostgreSQL)
- `lib/api-spec/openapi.yaml` — OpenAPI contract

## Architecture decisions

- Converted from Next.js 14 (App Router) to Vite + React with wouter routing
- `next/link` replaced with wouter `<Link>`, `next/navigation` hooks replaced with wouter hooks
- All pages are client-rendered (no SSR); backend API calls use `useEffect` + `fetch`
- Backend (FastAPI) runs separately; frontend calls `localhost:8000` for live data with graceful fallback to demo data when disconnected
- Monaco editor (`@monaco-editor/react`) retained for LaTeX editor feature

## Product

- Dashboard with cross-platform stats
- Knowledge Graph builder (PDF → graph → GAT analysis)
- LaTeX collaborative editor (Monaco-based)
- QA automation (RAG test cases + Selenium scripts)
- Research Journal with AI mood detection
- Explainable AI (counterfactuals, feature importance)
- RAG Chat, Universal Search, Agent System, Project management
- Timeline, Smart Dashboard, Deep Insights, Mood × Graph correlation
- Auto Research pipeline, Research Brain, Research OS, Aether Core

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Frontend makes API calls to `http://localhost:8000` (Python FastAPI backend from original project). All pages include graceful fallback to demo data when backend is not connected.
- Monaco editor requires both `@monaco-editor/react` and `monaco-editor` packages installed.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
