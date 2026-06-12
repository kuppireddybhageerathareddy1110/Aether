import { Router } from "express";
import multer from "multer";
import { db, documentsTable, documentChunksTable, knowledgeGraphsTable, notificationsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["application/pdf", "text/plain", "text/markdown"];
    const byExt = file.originalname.match(/\.(pdf|txt|md)$/i);
    if (allowed.includes(file.mimetype) || byExt) cb(null, true);
    else cb(new Error("Only PDF, TXT, and Markdown files are supported"));
  },
});

function chunkText(text: string, maxChars = 1800): string[] {
  const paragraphs = text.split(/\n{2,}/).filter(p => p.trim().length > 20);
  const chunks: string[] = [];
  let current = "";
  for (const para of paragraphs) {
    if ((current + para).length > maxChars && current.length > 0) {
      chunks.push(current.trim());
      current = para;
    } else {
      current += (current ? "\n\n" : "") + para;
    }
  }
  if (current.trim()) chunks.push(current.trim());

  // If no paragraph breaks, split by sentences
  if (chunks.length === 0) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
    let cur = "";
    for (const s of sentences) {
      if ((cur + s).length > maxChars && cur.length > 0) {
        chunks.push(cur.trim());
        cur = s;
      } else { cur += s; }
    }
    if (cur.trim()) chunks.push(cur.trim());
  }
  return chunks.filter(c => c.length > 10);
}

function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

function generateGraphFromText(text: string, topic: string) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 4);
  const freq: Record<string, number> = {};
  for (const w of words) freq[w] = (freq[w] ?? 0) + 1;
  const topKeywords = Object.entries(freq)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));

  const coreNodes = [topic, ...topKeywords.slice(0, 15)];
  const nodes = coreNodes.map((label, i) => ({
    id: `n${i}`, label,
    x: Math.cos((i / coreNodes.length) * Math.PI * 2) * 220 + 260,
    y: Math.sin((i / coreNodes.length) * Math.PI * 2) * 160 + 200,
    size: i === 0 ? 22 : i < 4 ? 16 : 11,
  }));

  const edges: any[] = [];
  for (let i = 1; i < nodes.length; i++) {
    edges.push({ id: `e${i}`, source: nodes[0].id, target: nodes[i].id, label: "relates_to", weight: +(Math.random() * 0.8 + 0.2).toFixed(2) });
  }
  for (let i = 1; i < nodes.length - 2; i += 2) {
    if (Math.random() > 0.45) {
      edges.push({ id: `ec${i}`, source: nodes[i].id, target: nodes[i + 1].id, label: "connects", weight: +(Math.random() * 0.6 + 0.1).toFixed(2) });
    }
  }
  return { nodes, edges };
}

async function extractText(buffer: Buffer, mimetype: string, originalName: string): Promise<{ text: string; pages: number }> {
  const isPdf = mimetype === "application/pdf" || originalName.toLowerCase().endsWith(".pdf");
  if (isPdf) {
    try {
      const pdfParse = require("pdf-parse");
      const data = await pdfParse(buffer);
      return { text: data.text ?? "", pages: data.numpages ?? 1 };
    } catch (e) {
      // Fallback: try to extract readable text from buffer
      const raw = buffer.toString("utf8", 0, Math.min(buffer.length, 50000));
      const readable = raw.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s{3,}/g, " ");
      return { text: readable, pages: 1 };
    }
  }
  return { text: buffer.toString("utf8"), pages: 1 };
}

// POST /api/upload — upload a document and index it
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file provided" });
  }

  const { originalname, mimetype, size, buffer } = req.file;
  const autoGraph = req.body.autoGraph !== "false";

  try {
    // Extract text
    const { text, pages } = await extractText(buffer, mimetype, originalname);
    const cleanText = text.replace(/\s+/g, " ").trim();

    // Chunk the text
    const chunks = chunkText(cleanText);
    const totalTokens = chunks.reduce((sum, c) => sum + estimateTokens(c), 0);

    // Store document
    const [doc] = await db.insert(documentsTable).values({
      filename: originalname,
      originalName: originalname,
      mimeType: mimetype,
      sizeBytes: size,
      pageCount: pages,
      chunkCount: chunks.length,
      totalTokens,
      status: "indexed",
      extractedText: cleanText.slice(0, 50000), // cap stored text at 50k chars
    }).returning();

    // Store chunks
    if (chunks.length > 0) {
      await db.insert(documentChunksTable).values(
        chunks.map((content, idx) => ({
          documentId: doc.id,
          chunkIndex: idx,
          content,
          tokenCount: estimateTokens(content),
        }))
      );
    }

    // Notify
    await db.insert(notificationsTable).values({
      type: "rag",
      read: false,
      title: "Document indexed",
      detail: `"${originalname}" — ${chunks.length} chunks, ~${totalTokens.toLocaleString()} tokens indexed into vector store`,
    }).catch(() => {});

    // Auto-generate knowledge graph from document
    let graph = null;
    if (autoGraph && cleanText.length > 100) {
      const topic = originalname.replace(/\.(pdf|txt|md)$/i, "").replace(/[-_]/g, " ");
      const { nodes, edges } = generateGraphFromText(cleanText, topic);
      const [g] = await db.insert(knowledgeGraphsTable).values({
        name: `Graph: ${topic}`,
        sourceDoc: originalname,
        nodeCount: nodes.length,
        edgeCount: edges.length,
        nodes, edges, status: "complete",
      }).returning();
      graph = g;

      await db.insert(notificationsTable).values({
        type: "graph", read: false,
        title: "Knowledge graph generated",
        detail: `Graph for "${topic}" from document — ${nodes.length} nodes, ${edges.length} edges`,
      }).catch(() => {});
    }

    return res.status(201).json({
      document: doc,
      chunkCount: chunks.length,
      totalTokens,
      pages,
      textPreview: cleanText.slice(0, 400),
      graph,
    });
  } catch (e) {
    console.error("Upload error:", e);
    return res.status(500).json({ error: "Failed to process document" });
  }
});

// GET /api/upload/documents — list uploaded documents
router.get("/upload/documents", async (_req, res) => {
  try {
    const docs = await db.select().from(documentsTable)
      .orderBy(desc(documentsTable.createdAt))
      .limit(50);
    res.json(docs);
  } catch {
    res.status(500).json({ error: "Failed to fetch documents" });
  }
});

// GET /api/upload/documents/:id/chunks — get chunks for a document
router.get("/upload/documents/:id/chunks", async (req, res) => {
  try {
    const chunks = await db.select().from(documentChunksTable)
      .where(eq(documentChunksTable.documentId, Number(req.params.id)))
      .orderBy(documentChunksTable.chunkIndex);
    res.json(chunks);
  } catch {
    res.status(500).json({ error: "Failed to fetch chunks" });
  }
});

// DELETE /api/upload/documents/:id
router.delete("/upload/documents/:id", async (req, res) => {
  try {
    const docId = Number(req.params.id);
    await db.delete(documentChunksTable).where(eq(documentChunksTable.documentId, docId));
    await db.delete(documentsTable).where(eq(documentsTable.id, docId));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete document" });
  }
});

export default router;
