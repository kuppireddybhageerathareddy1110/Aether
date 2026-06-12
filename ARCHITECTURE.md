# Aether Architecture — Deep Dive

## 1. Frontend Architecture (Next.js 14)

### Component Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout + Sidebar
│   ├── page.tsx            # Dashboard
│   ├── editor/             # Monaco LaTeX
│   ├── graph/              # Knowledge Graph
│   ├── journal/            # Mood Journal
│   ├── qa/                 # Test Generator
│   ├── xai/                # Explainability
│   ├── upload/             # PDF Upload
│   ├── search/             # Universal Search
│   └── chat/               # RAG Chat
├── components/
│   ├── Sidebar.tsx
│   └── ui/
│       └── Card.tsx
```

### State Management
- Local state with `useState` + `useEffect`
- No global state library yet (Zustand planned for v1.1)
- Server state via direct `fetch` to FastAPI

### Styling
- Tailwind CSS
- Consistent dark theme (`zinc-950`, `zinc-900`)
- Rounded corners (`rounded-2xl`, `rounded-3xl`)

## 2. Backend Architecture (FastAPI)

### Module Responsibilities
- `main.py` — All routes + WebSocket
- Future modularization:
  - `routers/journal.py`
  - `routers/graph.py`
  - `routers/qa.py`
  - `routers/xai.py`
  - `services/rag.py`
  - `services/graph_engine.py`

### Data Models
All models use Pydantic for validation.

### WebSocket Layer
- Real-time LaTeX collaboration
- Session-based rooms
- Broadcast to all connected clients

## 3. AI & ML Layer

### Embedding Pipeline
1. Text extraction (PyMuPDF)
2. Chunking (sliding window)
3. `all-MiniLM-L6-v2` embeddings
4. FAISS indexing

### LLM Integration
- Primary: Groq (Mixtral / Llama-3)
- Fallback: Google Gemini
- Mood detection: Gemini

### Graph Intelligence
- NER + SVO extraction (spaCy)
- Graph construction (NetworkX)
- GAT training (PyTorch Geometric)

## 4. Data Layer

| Data Type         | Storage     | Purpose                     |
|-------------------|-------------|-----------------------------|
| Journal Entries   | MongoDB     | User research notes         |
| PDF Content       | MongoDB     | Raw + extracted text        |
| Embeddings        | FAISS       | Vector search               |
| Sessions          | Redis       | WebSocket + rate limiting   |
| Graphs            | MongoDB     | Serialized NetworkX graphs  |

## 5. Deployment Architecture

```
Docker Compose (Local)
├── frontend (Next.js)
├── backend  (FastAPI)
├── mongo
└── redis

Kubernetes (Production)
├── Ingress
├── Frontend Deployment
├── Backend Deployment (3 replicas)
├── MongoDB StatefulSet
├── Redis
└── Celery Workers (for heavy jobs)
```

---

**Version**: 1.0
**Date**: 2026-06-12