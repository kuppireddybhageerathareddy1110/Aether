# Aether — The Benchmark AI-Native Research & Knowledge Platform

**Aether** is a production-grade, end-to-end platform that unifies document intelligence, knowledge graphs, explainable AI, collaborative authoring, automated QA, and personal research journaling.

It integrates **every idea** from the seven source repositories into one cohesive, benchmark-quality system.

## Vision

Turn any collection of PDFs, notes, and research into a living, queryable, explainable knowledge graph with mood-aware assistance and automated testing.

## Features (Mapped to Original Repos)

| Feature | Source Repo | Description |
|---------|-------------|-------------|
| PDF → Knowledge Graph + GAT | pdf-graph | Upload PDF → page-wise graphs → Graph Attention Networks |
| RAG Test Case & Selenium Generator | sel-gen | Grounded test cases + runnable automation scripts |
| Modern Agentic RAG Architecture | new | Skills-based agents, tool calling, persistent memory |
| Professional LaTeX Editor | TexFlow | Monaco-based editor, real-time collab, Pandoc exports |
| Explainable AI Layer | aizenx | Counterfactuals, feature importance, bias detection on every AI output |
| AI Mood Journal & Analytics | myjournal | Mood detection (Gemini), trend charts, mood boards |
| Central Orchestration | NEXUS | FastAPI backend, Docker/K8s, microservices-ready |

## Architecture

```
User → Next.js Frontend
        ├── Monaco LaTeX Editor (TexFlow)
        ├── Graph Visualizer (pdf-graph)
        ├── RAG Chat + QA Generator (sel-gen + new)
        ├── XAI Dashboard (aizenx)
        └── Mood Journal (myjournal)

Backend (FastAPI)
├── Agents Layer (new)
├── Graph Pipeline (pdf-graph)
├── RAG + LLM Router
├── XAI Module (aizenx)
├── Journal Service (myjournal)
├── Editor Service + WebSockets (TexFlow)
└── QA Generator (sel-gen)

Data Layer
├── MongoDB (journal + user data)
├── FAISS / Vector Store
├── PostgreSQL (graphs & metadata)
└── Redis (sessions & cache)
```

## Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind + shadcn/ui + Monaco Editor + Chart.js + React Flow / PyVis
- **Backend**: FastAPI + Uvicorn + WebSockets + Pydantic
- **AI**: Groq / Gemini + SentenceTransformers + spaCy + PyTorch Geometric
- **Infrastructure**: Docker + Kubernetes + GitHub Actions

## Quick Start (Benchmark Setup)

```bash
git clone <this-repo>
cd aether
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Project Structure

```
aether/
├── frontend/                 # Next.js application
├── backend/                  # FastAPI core
│   ├── agents/               # Reusable agent skills
│   ├── graph/                # pdf-graph pipeline
│   ├── xai/                  # AizenX explanations
│   ├── qa/                   # sel-gen test generator
│   ├── journal/              # mood journal
│   ├── editor/               # TexFlow integration
│   └── main.py
├── docker-compose.yml
├── k8s/
├── README.md
└── .env.example
```

## Why This Is a Benchmark Project

- **Full integration** of all 7 repos
- Production patterns (auth, logging, error handling, XAI)
- Scalable architecture
- Beautiful, modern UI
- Comprehensive documentation
- Ready for real research workflows

---

**Status**: Initial skeleton created. Core modules will be expanded iteratively.

Built with ❤️ by synthesizing the best ideas from the original repositories.
