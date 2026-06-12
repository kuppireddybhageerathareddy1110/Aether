import { Router } from "express";
import { db, journalEntriesTable, notificationsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

const INSIGHTS: Record<string, string> = {
  Curious: "High curiosity correlates with 2.3× better graph quality",
  Focused: "Focus peak — schedule deep research now",
  Creative: "Creative sessions produce denser knowledge graphs",
  Energized: "High energy = 3× concept retention from reading",
  Motivated: "Motivation peak — tackle the hardest problems",
  Inspired: "Inspiration window open — generate that paper!",
  Happy: "Positive affect boosts cross-domain synthesis",
  Amazing: "Peak state detected — optimal for graph generation",
};

router.get("/journal", async (_req, res) => {
  try {
    const entries = await db.select().from(journalEntriesTable).orderBy(desc(journalEntriesTable.createdAt));
    res.json(entries);
  } catch {
    res.status(500).json({ error: "Failed to fetch journal entries" });
  }
});

router.post("/journal", async (req, res) => {
  try {
    const { content, moodScore, moodLabel, tags = [] } = req.body as { content: string; moodScore: number; moodLabel: string; tags?: string[] };
    if (!content || !moodScore || !moodLabel) {
      return res.status(400).json({ error: "content, moodScore, moodLabel are required" });
    }
    const sentiment = Math.min(1, Math.max(0, (moodScore - 1) / 9 + (Math.random() - 0.5) * 0.15));
    const energy = Math.min(10, Math.max(1, moodScore + (Math.random() - 0.5) * 2));
    const focus = Math.min(10, Math.max(1, moodScore + (Math.random() - 0.5) * 3));
    const aiInsight = INSIGHTS[tags[0]] ?? "Track patterns over time to unlock personalized insights";

    const [entry] = await db.insert(journalEntriesTable).values({
      content, moodScore, moodLabel, tags, sentiment, energy, focus, aiInsight,
    }).returning();

    await db.insert(notificationsTable).values({
      type: "journal", read: false,
      title: "Journal entry analyzed",
      detail: `Mood: ${moodLabel} (${sentiment.toFixed(2)}). ${aiInsight}`,
    }).catch(() => {});

    return res.status(201).json(entry);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to create journal entry" });
  }
});

router.delete("/journal/:id", async (req, res) => {
  try {
    await db.delete(journalEntriesTable).where(eq(journalEntriesTable.id, Number(req.params.id)));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete entry" });
  }
});

export default router;
