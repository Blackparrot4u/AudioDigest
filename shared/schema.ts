import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const files = pgTable("files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // PDF, TXT, DOCX, JPG, PNG, MP3, WAV
  size: integer("size").notNull(),
  content: text("content"), // extracted text content
  summary: text("summary"), // AI-generated summary
  audioUrl: text("audio_url"), // generated audio file URL
  language: text("language").default("en"),
  summaryLength: text("summary_length").default("standard"), // time-crunch, standard, detailed
  voiceSpeed: text("voice_speed").default("1.0"),
  processed: boolean("processed").default(false),
  flashcards: jsonb("flashcards").$type<Flashcard[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const playlists = pgTable("playlists", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  fileIds: jsonb("file_ids").$type<string[]>().default([]),
  currentIndex: integer("current_index").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  difficulty: "easy" | "hard" | "again";
}

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  createdAt: true,
});

export const insertPlaylistSchema = createInsertSchema(playlists).omit({
  id: true,
  createdAt: true,
});

export type InsertFile = z.infer<typeof insertFileSchema>;
export type File = typeof files.$inferSelect;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type Playlist = typeof playlists.$inferSelect;
