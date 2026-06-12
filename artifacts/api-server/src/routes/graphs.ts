import { Router } from "express";
import { db, knowledgeGraphsTable, notificationsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

function generateGraph(topic: string) {
  const baseNodes = [
    topic, "Graph Neural Network", "Attention Mechanism", "Node Embedding",
    "Edge Features", "Message Passing", "Aggregation", "Readout",
    "Training Loss", "Optimization", "Evaluation Metric", "Benchmark Dataset",
  ];
  const extraCount = Math.floor(Math.random() * 8) + 4;
  const extras = ["Dropout", "Batch Norm", "Skip Connection", "Pooling", "Encoder", "Decoder", "Attention Head", "Feature Map"];
  const nodeLabels = [...baseNodes, ...extras.slice(0, extraCount)];
  const nodes = nodeLabels.map((label, i) => ({
    id: `n${i}`, label, x: Math.cos((i / nodeLabels.length) * Math.PI * 2) * 200 + 250,
    y: Math.sin((i / nodeLabels.length) * Math.PI * 2) * 150 + 200,
    size: i < 3 ? 20 : 12,
  }));
  const edges: any[] = [];
  for (let i = 1; i < nodes.length; i++) {
    edges.push({ id: `e${i}`, source: nodes[0].id, target: nodes[i].id, label: "relates_to", weight: +(Math.random() * 0.8 + 0.2).toFixed(2) });
  }
  for (let i = 1; i < nodes.length - 1; i += 2) {
    if (Math.random() > 0.4) {
      edges.push({ id: `ec${i}`, source: nodes[i].id, target: nodes[i + 1].id, label: "connects", weight: +(Math.random() * 0.7 + 0.1).toFixed(2) });
    }
  }
  return { nodes, edges };
}

router.get("/graphs", async (_req, res) => {
  try {
    const graphs = await db.select().from(knowledgeGraphsTable).orderBy(desc(knowledgeGraphsTable.createdAt));
    res.json(graphs);
  } catch {
    res.status(500).json({ error: "Failed to fetch graphs" });
  }
});

router.post("/graphs/generate", async (req, res) => {
  try {
    const { topic = "Research Topic", sourceDoc = "manual" } = req.body as { topic?: string; sourceDoc?: string };
    const { nodes, edges } = generateGraph(topic);

    const [graph] = await db.insert(knowledgeGraphsTable).values({
      name: `Graph: ${topic}`,
      sourceDoc, nodeCount: nodes.length, edgeCount: edges.length,
      nodes, edges, status: "complete",
    }).returning();

    await db.insert(notificationsTable).values({
      type: "graph", read: false,
      title: "Knowledge graph generated",
      detail: `Graph for "${topic}" — ${nodes.length} nodes, ${edges.length} edges generated successfully`,
    }).catch(() => {});

    res.status(201).json(graph);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to generate graph" });
  }
});

router.get("/graphs/:id", async (req, res) => {
  try {
    const [graph] = await db.select().from(knowledgeGraphsTable)
      .where(eq(knowledgeGraphsTable.id, Number(req.params.id)));
    if (!graph) return res.status(404).json({ error: "Graph not found" });
    return res.json(graph);
  } catch {
    return res.status(500).json({ error: "Failed to fetch graph" });
  }
});

router.delete("/graphs/:id", async (req, res) => {
  try {
    await db.delete(knowledgeGraphsTable).where(eq(knowledgeGraphsTable.id, Number(req.params.id)));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete graph" });
  }
});

export default router;
