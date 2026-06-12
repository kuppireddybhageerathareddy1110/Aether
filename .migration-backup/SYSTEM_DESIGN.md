# Aether System Design

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│  Next.js 14 (React) + Tailwind + Monaco + React Flow        │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / WebSocket
┌──────────────────────────────▼──────────────────────────────┐
│                      API GATEWAY LAYER                      │
│                    FastAPI (Python)                         │
│  - Authentication & Rate Limiting                           │
│  - Request Validation (Pydantic)                            │
│  - WebSocket Manager                                        │
└──────────────────────────────┬──────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
┌───────▼──────┐      ┌────────▼────────┐     ┌───────▼──────┐
│   RAG        │      │  Graph Engine   │     │   XAI        │
│   Service    │      │  (NetworkX +    │     │   Service    │
│   (FAISS)    │      │   PyG GAT)      │     │   (AizenX)   │
└───────┬──────┘      └────────┬────────┘     └───────┬──────┘
        │                      │                      │
┌───────▼──────┐      ┌────────▼────────┐     ┌───────▼──────┐
│   LLM        │      │   MongoDB       │     │   Redis      │
│   (Groq/     │      │   (Journal +    │     │   (Cache +   │
│    Gemini)   │      │    Documents)   │     │    Sessions) │
└──────────────┘      └─────────────────┘     └──────────────┘
```

## Data Flow

1. **PDF Upload** → PyMuPDF extraction → SentenceTransformer embeddings → FAISS + MongoDB
2. **Journal Entry** → Gemini mood detection → MongoDB
3. **RAG Query** → FAISS retrieval → LLM generation → XAI explanation
4. **Graph Analysis** → spaCy NER/SVO → NetworkX → PyTorch Geometric GAT
5. **LaTeX Edit** → WebSocket broadcast → Real-time sync

## Scalability Considerations

- Horizontal scaling via Kubernetes
- Redis for session + rate limiting
- FAISS sharded by user/project
- Background workers for heavy PDF/Graph processing (Celery)

## Security

- JWT authentication
- File upload validation
- Rate limiting on all endpoints
- Input sanitization

## Future Enhancements

- Vector database (Pinecone / Weaviate)
- Event-driven architecture with Kafka
- Multi-tenant support
- Audit logging

---

**Version**: 1.0
**Date**: 2026-06-12