import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertFileSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { processTextFile, processImageFile, processPDFFile } from "./services/fileProcessor.js";
import { generateAudioFromText } from "./services/textToSpeech.js";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all files
  app.get("/api/files", async (req, res) => {
    try {
      const files = await storage.getAllFiles();
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  // Get a specific file
  app.get("/api/files/:id", async (req, res) => {
    try {
      const file = await storage.getFile(req.params.id);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      res.json(file);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch file" });
    }
  });

  // Upload and process file
  app.post("/api/files/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { summaryLength = "standard", language = "en", voiceSpeed = "1.0" } = req.body;

      // Create initial file record
      const fileData = {
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
        content: "",
        summary: "",
        audioUrl: "",
        language,
        summaryLength,
        voiceSpeed,
        processed: false,
        flashcards: []
      };

      const file = await storage.createFile(fileData);

      // Process file in background
      processFileAsync(file.id, req.file.buffer, req.file.mimetype, {
        summaryLength,
        language,
        voiceSpeed
      });

      res.json(file);
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Update file processing status
  app.patch("/api/files/:id", async (req, res) => {
    try {
      const updates = req.body;
      const file = await storage.updateFile(req.params.id, updates);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      res.json(file);
    } catch (error) {
      res.status(500).json({ message: "Failed to update file" });
    }
  });

  // Delete file
  app.delete("/api/files/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteFile(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "File not found" });
      }
      res.json({ message: "File deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete file" });
    }
  });

  // Get playlists
  app.get("/api/playlists", async (req, res) => {
    try {
      const playlists = await storage.getAllPlaylists();
      res.json(playlists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch playlists" });
    }
  });

  // Create playlist
  app.post("/api/playlists", async (req, res) => {
    try {
      const playlistData = req.body;
      const playlist = await storage.createPlaylist(playlistData);
      res.json(playlist);
    } catch (error) {
      res.status(500).json({ message: "Failed to create playlist" });
    }
  });

  // Process voice command
  app.post("/api/voice-command", async (req, res) => {
    try {
      const { command } = req.body;
      
      // Simple command processing - in a real app you'd use more sophisticated NLP
      let response = "Command not recognized";
      
      if (command.toLowerCase().includes("summarize")) {
        response = "I'll help you summarize your content. Please upload a file first.";
      } else if (command.toLowerCase().includes("flashcard")) {
        response = "I'll generate flashcards from your uploaded content.";
      } else if (command.toLowerCase().includes("translate")) {
        response = "I can translate your summaries to different languages.";
      }
      
      res.json({ response });
    } catch (error) {
      res.status(500).json({ message: "Failed to process voice command" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Background file processing
async function processFileAsync(
  fileId: string, 
  buffer: Buffer, 
  mimeType: string, 
  options: { summaryLength: string; language: string; voiceSpeed: string }
) {
  try {
    let result;
    
    if (mimeType.startsWith('text/')) {
      const content = buffer.toString('utf-8');
      result = await processTextFile(content, options);
      await storage.updateFile(fileId, {
        content,
        summary: result.summary,
        flashcards: result.flashcards.map((card, index) => ({
          id: `${fileId}-${index}`,
          question: card.question,
          answer: card.answer,
          difficulty: "easy" as const
        }))
      });
    } else if (mimeType.startsWith('image/')) {
      const base64 = buffer.toString('base64');
      result = await processImageFile(base64, options);
      await storage.updateFile(fileId, {
        content: result.content,
        summary: result.summary,
        flashcards: result.flashcards.map((card, index) => ({
          id: `${fileId}-${index}`,
          question: card.question,
          answer: card.answer,
          difficulty: "easy" as const
        }))
      });
    } else if (mimeType === 'application/pdf') {
      result = await processPDFFile(buffer, options);
      await storage.updateFile(fileId, {
        content: result.content,
        summary: result.summary,
        flashcards: result.flashcards.map((card, index) => ({
          id: `${fileId}-${index}`,
          question: card.question,
          answer: card.answer,
          difficulty: "easy" as const
        }))
      });
    }

    // Generate audio
    if (result?.summary) {
      const audioUrl = await generateAudioFromText(result.summary, {
        language: options.language,
        speed: options.voiceSpeed
      });
      
      await storage.updateFile(fileId, {
        audioUrl,
        processed: true
      });
    }
    
  } catch (error) {
    console.error(`Failed to process file ${fileId}:`, error);
    await storage.updateFile(fileId, {
      processed: true,
      summary: "Failed to process file"
    });
  }
}
