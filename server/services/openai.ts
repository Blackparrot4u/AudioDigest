import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function summarizeContent(content: string, length: string = "standard", language: string = "en"): Promise<string> {
  const lengthInstructions = {
    "time-crunch": "Create an ultra-concise summary under 2 minutes of reading time (about 200-300 words). Focus only on the most critical points.",
    "standard": "Create a comprehensive summary of 3-5 minutes reading time (about 500-800 words). Include key concepts and important details.",
    "detailed": "Create a detailed summary of 5-10 minutes reading time (about 1000-1500 words). Include comprehensive explanations and context."
  };

  const languageInstruction = language !== "en" ? ` Respond in ${language}.` : "";

  const prompt = `${lengthInstructions[length as keyof typeof lengthInstructions]} ${languageInstruction}

Content to summarize:
${content}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an expert educator who creates clear, engaging summaries for students. Focus on key concepts, simplify complex jargon, and structure information for easy understanding."
      },
      { role: "user", content: prompt }
    ],
  });

  return response.choices[0].message.content || "";
}

export async function generateFlashcards(content: string, count: number = 10): Promise<Array<{question: string, answer: string}>> {
  const prompt = `Create ${count} educational flashcards from the following content. Each flashcard should test understanding of key concepts. Format as JSON array with "question" and "answer" fields. Make questions clear and answers concise but complete.

Content:
${content}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an expert educator creating study flashcards. Focus on key concepts, definitions, and important facts. Respond with JSON only."
      },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content || '{"flashcards": []}');
  return result.flashcards || [];
}

export async function extractImageText(base64Image: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract all text from this image. Preserve formatting and structure as much as possible. If there are diagrams or visual elements, describe them briefly."
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          }
        ],
      },
    ],
    max_tokens: 1000,
  });

  return response.choices[0].message.content || "";
}

export async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  // Note: This would require implementing temporary file handling for OpenAI Whisper
  // For now, return a placeholder since we need to save the buffer to a file first
  throw new Error("Audio transcription requires file handling implementation");
}
