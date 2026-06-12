import { Router } from "express";
import { db, userSettingsTable, documentsTable, knowledgeGraphsTable, documentChunksTable, journalEntriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const DEFAULTS: Record<string, any> = {
  theme: "dark",
  accentColor: "#10b981",
  density: "default",
  model: "gpt-4o",
  ragChunkSize: 512,
  ragTopK: 12,
  xaiThreshold: 0.7,
  notifGraph: true,
  notifRag: true,
  notifAgent: false,
  notifJournal: true,
  notifSystem: true,
  notifDigest: false,
  twoFactor: false,
  sessionTimeout: true,
  loginNotifications: true,
};

router.get("/settings", async (_req, res) => {
  try {
    const rows = await db.select().from(userSettingsTable);
    const settings = { ...DEFAULTS };
    for (const row of rows) {
      settings[row.key] = row.value;
    }
    res.json(settings);
  } catch {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.put("/settings", async (req, res) => {
  try {
    const updates = req.body as Record<string, any>;
    for (const [key, value] of Object.entries(updates)) {
      const existing = await db.select().from(userSettingsTable).where(eq(userSettingsTable.key, key));
      if (existing.length > 0) {
        await db.update(userSettingsTable).set({ value, updatedAt: new Date() }).where(eq(userSettingsTable.key, key));
      } else {
        await db.insert(userSettingsTable).values({ key, value });
      }
    }
    const rows = await db.select().from(userSettingsTable);
    const settings = { ...DEFAULTS };
    for (const row of rows) settings[row.key] = row.value;
    res.json(settings);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

router.get("/settings/stats", async (_req, res) => {
  try {
    const [docs, graphs, chunks, journal] = await Promise.all([
      db.select().from(documentsTable),
      db.select().from(knowledgeGraphsTable),
      db.select().from(documentChunksTable),
      db.select().from(journalEntriesTable).catch(() => []),
    ]);
    res.json({
      documents: docs.length,
      graphs: graphs.length,
      chunks: chunks.length,
      journalEntries: journal.length,
    });
  } catch {
    res.json({ documents: 0, graphs: 0, chunks: 0, journalEntries: 0 });
  }
});

export default router;
