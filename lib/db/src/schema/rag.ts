import { pgTable, serial, text, integer, real, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ragQueriesTable = pgTable("rag_queries", {
  id: serial("id").primaryKey(),
  query: text("query").notNull(),
  answer: text("answer").notNull(),
  chunksUsed: integer("chunks_used").notNull().default(0),
  confidence: real("confidence").notNull().default(0),
  elapsedMs: integer("elapsed_ms").notNull().default(0),
  agentTrace: jsonb("agent_trace").$type<any[]>().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRagQuerySchema = createInsertSchema(ragQueriesTable).omit({ id: true, createdAt: true });
export type InsertRagQuery = z.infer<typeof insertRagQuerySchema>;
export type RagQuery = typeof ragQueriesTable.$inferSelect;
