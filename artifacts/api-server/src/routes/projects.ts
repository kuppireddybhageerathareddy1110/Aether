import { Router } from "express";
import { db, projectsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/projects", async (_req, res) => {
  try {
    const projects = await db.select().from(projectsTable).orderBy(desc(projectsTable.createdAt));
    res.json(projects);
  } catch {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

router.post("/projects", async (req, res) => {
  try {
    const { name, description, tags = [] } = req.body as { name: string; description?: string; tags?: string[] };
    if (!name) return res.status(400).json({ error: "name is required" });
    const [project] = await db.insert(projectsTable).values({ name, description, tags, status: "active" }).returning();
    return res.status(201).json(project);
  } catch {
    return res.status(500).json({ error: "Failed to create project" });
  }
});

router.patch("/projects/:id", async (req, res) => {
  try {
    const updates = req.body;
    const [project] = await db.update(projectsTable)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projectsTable.id, Number(req.params.id)))
      .returning();
    res.json(project);
  } catch {
    res.status(500).json({ error: "Failed to update project" });
  }
});

router.delete("/projects/:id", async (req, res) => {
  try {
    await db.delete(projectsTable).where(eq(projectsTable.id, Number(req.params.id)));
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to delete project" });
  }
});

export default router;
