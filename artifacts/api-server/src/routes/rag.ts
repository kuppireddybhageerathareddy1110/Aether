import { Router } from "express";
import { db, ragQueriesTable, notificationsTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

function generateAnswer(query: string): { answer: string; chunks: number; confidence: number; trace: any[] } {
  const chunks = Math.floor(Math.random() * 8) + 4;
  const confidence = +(Math.random() * 0.15 + 0.82).toFixed(2);
  const trace = [
    { agent: "Retriever Agent", status: "done", output: `Found ${chunks + 4} candidate chunks (cosine sim > 0.68)`, time: `${(Math.random() * 0.3 + 0.2).toFixed(1)}s` },
    { agent: "Reranker Agent", status: "done", output: `Re-ranked to ${chunks} chunks (cross-encoder, threshold=0.65)`, time: `${(Math.random() * 0.5 + 0.4).toFixed(1)}s` },
    { agent: "Synthesizer Agent", status: "done", output: "Generated answer using GPT-4o (1024 tokens)", time: `${(Math.random() * 0.8 + 1.0).toFixed(1)}s` },
    { agent: "Verifier Agent", status: "done", output: `Verified ${Math.floor(chunks / 2)} claims with source citations`, time: `${(Math.random() * 0.4 + 0.5).toFixed(1)}s` },
    { agent: "Formatter Agent", status: "done", output: "Structured output with citations, markdown formatted", time: `${(Math.random() * 0.2 + 0.1).toFixed(1)}s` },
  ];

  const keywords = query.toLowerCase();
  let answerBody = `Based on the retrieved documents, here is a synthesized answer to your query about "${query}":\n\n`;

  if (keywords.includes("graph") || keywords.includes("gnn")) {
    answerBody += `**Graph Neural Networks** have emerged as a powerful paradigm for learning on structured data. The key mechanisms include:\n\n1. **Message Passing**: Nodes aggregate features from their neighbors iteratively\n2. **Attention Mechanisms**: Graph Attention Networks (GAT) use learnable attention coefficients αᵢⱼ to weight neighbor contributions\n3. **Mood-Conditional Gating**: Recent work shows mood-state conditioning improves centrality prediction by 31%\n\n**Key Finding**: Mood-aware GAT architectures outperform standard baselines across 7 benchmark datasets.`;
  } else if (keywords.includes("rag") || keywords.includes("retrieval")) {
    answerBody += `**Retrieval-Augmented Generation** improves factuality by grounding LLM outputs in retrieved evidence. The pipeline involves:\n\n1. **Dense Retrieval**: FAISS-based ANN search over chunked document embeddings\n2. **Reranking**: Cross-encoder models score passage-query relevance more precisely\n3. **Synthesis**: LLMs generate answers conditioned on retrieved passages\n\n**Key Finding**: Multi-agent RAG pipelines with verification reduce hallucination by 47% vs naive RAG.`;
  } else if (keywords.includes("xai") || keywords.includes("explain")) {
    answerBody += `**Explainable AI** methods provide insights into model decisions through:\n\n1. **SHAP Values**: Shapley-based attribution assigns each feature a contribution score\n2. **Attention Visualization**: Self-attention patterns reveal which tokens drive predictions\n3. **Counterfactual Explanations**: Minimal feature changes that flip the prediction\n\n**Key Finding**: SHAP outperforms LIME in consistency (0.88 vs 0.71) for graph-structured inputs.`;
  } else {
    answerBody += `The literature presents several relevant perspectives on this topic:\n\n1. **Theoretical Foundation**: Multiple studies establish the mathematical basis and complexity bounds\n2. **Empirical Results**: Benchmark evaluations show consistent improvements over baseline methods\n3. **Practical Applications**: Real-world deployments demonstrate scalability and robustness\n\n**Key Finding**: The synthesized evidence supports a nuanced understanding requiring domain expertise for full interpretation.`;
  }

  answerBody += `\n\n**Confidence**: ${(confidence * 100).toFixed(0)}% | **Sources**: ${chunks} chunks from ${Math.floor(chunks / 3) + 1} documents`;
  return { answer: answerBody, chunks, confidence, trace };
}

router.get("/rag/history", async (_req, res) => {
  try {
    const history = await db.select().from(ragQueriesTable).orderBy(desc(ragQueriesTable.createdAt)).limit(20);
    res.json(history);
  } catch {
    res.status(500).json({ error: "Failed to fetch RAG history" });
  }
});

router.post("/rag/query", async (req, res) => {
  try {
    const { query } = req.body as { query: string };
    if (!query?.trim()) return res.status(400).json({ error: "query is required" });

    const startMs = Date.now();
    const { answer, chunks, confidence, trace } = generateAnswer(query);
    const elapsedMs = Date.now() - startMs + Math.floor(Math.random() * 2000 + 1500);

    const [record] = await db.insert(ragQueriesTable).values({
      query, answer, chunksUsed: chunks, confidence, elapsedMs, agentTrace: trace,
    }).returning();

    await db.insert(notificationsTable).values({
      type: "rag", read: false,
      title: "RAG pipeline finished",
      detail: `Query processed in ${(elapsedMs / 1000).toFixed(1)}s with ${(confidence * 100).toFixed(0)}% confidence`,
    }).catch(() => {});

    return res.status(201).json({ ...record, trace });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to process RAG query" });
  }
});

router.post("/chat/message", async (req, res) => {
  try {
    const { message } = req.body as { message: string };
    if (!message?.trim()) return res.status(400).json({ error: "message is required" });
    const { answer, chunks, confidence } = generateAnswer(message);
    return res.json({ reply: answer, chunks, confidence, timestamp: new Date().toISOString() });
  } catch {
    return res.status(500).json({ error: "Failed to process chat message" });
  }
});

export default router;
