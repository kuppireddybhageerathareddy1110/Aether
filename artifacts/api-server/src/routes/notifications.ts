import { Router } from "express";
import { db, notificationsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/notifications", async (_req, res) => {
  try {
    const items = await db.select().from(notificationsTable).orderBy(desc(notificationsTable.createdAt));
    res.json(items);
  } catch {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

router.post("/notifications", async (req, res) => {
  try {
    const { type, title, detail } = req.body as { type: string; title: string; detail: string };
    const [item] = await db.insert(notificationsTable).values({ type, title, detail, read: false }).returning();
    res.status(201).json(item);
  } catch {
    res.status(500).json({ error: "Failed to create notification" });
  }
});

router.patch("/notifications/read-all", async (_req, res) => {
  try {
    await db.update(notificationsTable).set({ read: true });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to mark all read" });
  }
});

router.patch("/notifications/:id/read", async (req, res) => {
  try {
    const [item] = await db.update(notificationsTable)
      .set({ read: true })
      .where(eq(notificationsTable.id, Number(req.params.id)))
      .returning();
    res.json(item);
  } catch {
    res.status(500).json({ error: "Failed to mark read" });
  }
});

router.delete("/notifications/:id", async (req, res) => {
  try {
    await db.delete(notificationsTable).where(eq(notificationsTable.id, Number(req.params.id)));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete notification" });
  }
});

export default router;
