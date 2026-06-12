import { pgTable, serial, text, integer, real, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const journalEntriesTable = pgTable("journal_entries", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  moodScore: integer("mood_score").notNull(),
  moodLabel: text("mood_label").notNull(),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  sentiment: real("sentiment"),
  energy: real("energy"),
  focus: real("focus"),
  aiInsight: text("ai_insight"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertJournalEntrySchema = createInsertSchema(journalEntriesTable).omit({ id: true, createdAt: true });
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type JournalEntry = typeof journalEntriesTable.$inferSelect;
