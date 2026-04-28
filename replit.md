# SummaryStream - AI-Powered Document Processing Application

## Overview

SummaryStream is a full-stack web application that processes documents and media files into audio summaries with AI-generated flashcards. Users can upload various file types (PDFs, images, text files), which are then processed using OpenAI's GPT-4l to generate summaries, flashcards, and text-to-speech audio output. The applicatifeatures an audio player for listening to sumaries, an interactiveflashcard system for studying, and voice command functionality.

## User Preferences

Preferred communication tyle: Simple, everyday language.

## System chitecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation resolvers
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with file upload endpoints using multer middleware
- **File Processing**: Multi-format support (PDF, images, text files) with AI-powered content extraction
- **Error Handling**: Centralized error middleware with structured error responses

### Database & Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Database**: PostgreSQL with Neon serverless hosting
- **Schema**: Structured tables for files, playlists, and flashcards with JSONB fields for complex data
- **Storage Strategy**: In-memory storage implementation with interface for easy database migration

### AI & Processing Services
- **AI Provider**: OpenAI GPT-4o model for content summarization and flashcard generation
- **Text Processing**: Content extraction from multiple file formats
- **Summary Generation**: Configurable summary lengths (time-crunch, standard, detailed) with multilingual support
- **Flashcard Creation**: Automated question-answer pair generation from document content
- **Text-to-Speech**: Placeholder implementation for audio generation with speed and language controls

### Authentication & Security
- **Session Management**: Express sessions with PostgreSQL session store
- **File Security**: Multer with file size limits (50MB) and memory storage
- **CORS**: Configured for development and production environments

### Development & Build
- **Build System**: Vite for frontend bundling with React plugin and runtime error overlay
- **TypeScript**: Strict type checking with path mapping for clean imports
- **Hot Reload**: Development server with HMR support
- **Code Organization**: Monorepo structure with shared types and schemas

## External Dependencies

### Core AI Services
- **OpenAI API**: GPT-4o model for content analysis, summarization, and flashcard generation
- **Text-to-Speech**: Placeholder for Azure Speech Services or similar TTS provider

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle Kit**: Database migrations and schema management

### Frontend Libraries
- **Radix UI**: Accessible component primitives for complex UI elements
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form handling with validation and error management
- **Wouter**: Lightweight routing solution
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing

### Development Tools
- **Vite**: Frontend build tool with plugin ecosystem
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast bundling for production builds
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer

### File Processing
- **Multer**: Multipart form data handling for file uploads
- **Date-fns**: Date manipulation and formatting utilities
- **Class Variance Authority**: Type-safe CSS class composition

### Media & Audio
- **Web Audio API**: Browser-based audio playback and control
- **Speech Recognition API**: Voice command processing (browser-native)
- **Embla Carousel**: Touch-friendly carousel component for UI elements