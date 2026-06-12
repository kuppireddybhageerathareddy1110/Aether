import { Router } from "express";
import { db, userSettingsTable } from "@workspace/db";
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

export default router;
