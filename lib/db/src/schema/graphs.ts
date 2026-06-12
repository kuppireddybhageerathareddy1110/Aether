import { pgTable, serial, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const knowledgeGraphsTable = pgTable("knowledge_graphs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sourceDoc: text("source_doc"),
  nodeCount: integer("node_count").notNull().default(0),
  edgeCount: integer("edge_count").notNull().default(0),
  nodes: jsonb("nodes").$type<any[]>().notNull().default([]),
  edges: jsonb("edges").$type<any[]>().notNull().default([]),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertKnowledgeGraphSchema = createInsertSchema(knowledgeGraphsTable).omit({ id: true, createdAt: true });
export type InsertKnowledgeGraph = z.infer<typeof insertKnowledgeGraphSchema>;
export type KnowledgeGraph = typeof knowledgeGraphsTable.$inferSelect;
