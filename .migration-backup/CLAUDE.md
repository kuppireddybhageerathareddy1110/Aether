# CLAUDE.md — AI Agent Guide for Aether

This document is the canonical reference for any AI agent (Claude, GPT, Gemini, etc.) working on the Aether project.

## Project Philosophy

Aether is a **benchmark production-grade research platform** that unifies:
- Document intelligence
- Knowledge graphs
- Explainable AI
- Collaborative authoring
- Automated QA
- Personal research journaling

Every feature must feel **premium, thoughtful, and deeply integrated**.

## Core Principles

1. **Everything is connected** — Journal entries, PDFs, graphs, and AI outputs should reference each other.
2. **Explainability first** — Every AI action must be explainable (XAI).
3. **Beautiful by default** — Dark, minimal, modern UI with excellent typography.
4. **Production ready** — Always think about auth, error handling, logging, and scalability.

## Tech Stack Rules

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind
- **Backend**: FastAPI (Python)
- **Data**: MongoDB + Redis + FAISS
- **AI**: Groq / Gemini + SentenceTransformers

## When Adding New Features

1. Always update `CLAUDE.md` and `FEATURES.md`
2. Add proper TypeScript types
3. Create both frontend page + backend endpoint
4. Make it work with real data when possible
5. Keep the UI consistent with existing design language

## Current Status (June 2026)

- 10 fully working pages
- Real backend with WebSocket support
- PDF upload + search + RAG chat
- Knowledge graphs + XAI + QA generation
- Mood journal with analytics

## Recommended Next Features

- User authentication (JWT)
- Real RAG pipeline with FAISS
- Graph visualization using React Flow
- LaTeX real-time collaboration via WebSocket
- Agent orchestration dashboard
- Export to Notion / Obsidian / PDF

## Code Style

- Use functional components with hooks
- Prefer server actions when possible
- Keep components small and reusable
- Use `lucide-react` for icons
- Dark theme only

## Important Files

- `backend/main.py` — Main API
- `frontend/src/app/layout.tsx` — Root layout
- `frontend/src/components/Sidebar.tsx` — Navigation

---

**Last updated**: 2026-06-12
**Maintained by**: Aether Core Team