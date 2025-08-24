import { type File, type InsertFile, type Playlist, type InsertPlaylist, type Flashcard } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // File operations
  getFile(id: string): Promise<File | undefined>;
  getAllFiles(): Promise<File[]>;
  createFile(file: InsertFile): Promise<File>;
  updateFile(id: string, updates: Partial<File>): Promise<File | undefined>;
  deleteFile(id: string): Promise<boolean>;
  
  // Playlist operations
  getPlaylist(id: string): Promise<Playlist | undefined>;
  getAllPlaylists(): Promise<Playlist[]>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  updatePlaylist(id: string, updates: Partial<Playlist>): Promise<Playlist | undefined>;
  deletePlaylist(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private files: Map<string, File>;
  private playlists: Map<string, Playlist>;

  constructor() {
    this.files = new Map();
    this.playlists = new Map();
  }

  async getFile(id: string): Promise<File | undefined> {
    return this.files.get(id);
  }

  async getAllFiles(): Promise<File[]> {
    return Array.from(this.files.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const id = randomUUID();
    const file: File = { 
      ...insertFile, 
      id, 
      createdAt: new Date(),
      flashcards: insertFile.flashcards || []
    };
    this.files.set(id, file);
    return file;
  }

  async updateFile(id: string, updates: Partial<File>): Promise<File | undefined> {
    const file = this.files.get(id);
    if (!file) return undefined;
    
    const updatedFile = { ...file, ...updates };
    this.files.set(id, updatedFile);
    return updatedFile;
  }

  async deleteFile(id: string): Promise<boolean> {
    return this.files.delete(id);
  }

  async getPlaylist(id: string): Promise<Playlist | undefined> {
    return this.playlists.get(id);
  }

  async getAllPlaylists(): Promise<Playlist[]> {
    return Array.from(this.playlists.values());
  }

  async createPlaylist(insertPlaylist: InsertPlaylist): Promise<Playlist> {
    const id = randomUUID();
    const playlist: Playlist = { 
      ...insertPlaylist, 
      id, 
      createdAt: new Date() 
    };
    this.playlists.set(id, playlist);
    return playlist;
  }

  async updatePlaylist(id: string, updates: Partial<Playlist>): Promise<Playlist | undefined> {
    const playlist = this.playlists.get(id);
    if (!playlist) return undefined;
    
    const updatedPlaylist = { ...playlist, ...updates };
    this.playlists.set(id, updatedPlaylist);
    return updatedPlaylist;
  }

  async deletePlaylist(id: string): Promise<boolean> {
    return this.playlists.delete(id);
  }
}

export const storage = new MemStorage();
