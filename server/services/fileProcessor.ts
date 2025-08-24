import { extractImageText, summarizeContent, generateFlashcards } from './openai.js';

export async function processTextFile(content: string, options: {
  summaryLength: string;
  language: string;
}): Promise<{ summary: string; flashcards: Array<{question: string, answer: string}> }> {
  const summary = await summarizeContent(content, options.summaryLength, options.language);
  const flashcards = await generateFlashcards(content, 10);
  
  return { summary, flashcards };
}

export async function processImageFile(base64Image: string, options: {
  summaryLength: string;
  language: string;
}): Promise<{ content: string; summary: string; flashcards: Array<{question: string, answer: string}> }> {
  const content = await extractImageText(base64Image);
  const summary = await summarizeContent(content, options.summaryLength, options.language);
  const flashcards = await generateFlashcards(content, 10);
  
  return { content, summary, flashcards };
}

export async function processPDFFile(buffer: Buffer, options: {
  summaryLength: string;
  language: string;
}): Promise<{ content: string; summary: string; flashcards: Array<{question: string, answer: string}> }> {
  // For now, return placeholder since PDF parsing requires additional libraries
  // In a real implementation, you would use pdf-parse or similar
  const content = "PDF content extraction not yet implemented";
  const summary = await summarizeContent(content, options.summaryLength, options.language);
  const flashcards = await generateFlashcards(content, 5);
  
  return { content, summary, flashcards };
}
