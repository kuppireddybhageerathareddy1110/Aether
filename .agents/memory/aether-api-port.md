---
name: Aether API server port
description: How the API server port is configured in this Replit pnpm-workspace setup
---

# Aether API Server Port Configuration

## Rule
The API server (artifacts/api-server) listens on port 8080 because Replit's workflow system assigns PORT=8080 to that workflow. The env var API_PORT=8080 is set in shared environment and read by the server via `process.env["API_PORT"] ?? process.env["PORT"]`.

**Why:** Replit workflow system dynamically assigns PORT to each artifact workflow. The API server workflow gets 8080. Vite (frontend) gets the port in its own PORT env var (24696 → external 80). The vite proxy in vite.config.ts forwards `/api/*` to `http://localhost:${process.env.API_PORT ?? 5000}`.

**How to apply:** If the API server stops working after redeployment or restart, check that API_PORT=8080 is still set. If Replit reassigns a different port, update API_PORT to match.

## Current Setup
- API_PORT=8080 (shared env var, set via setEnvVars)
- Vite proxy: /api/* → http://localhost:8080
- Frontend calls /api/* (relative, goes through vite proxy in dev)
- All frontend API calls use src/lib/api.ts helper
