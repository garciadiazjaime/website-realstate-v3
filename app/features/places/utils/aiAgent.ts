"use server";

import { GoogleGenAI } from "@google/genai";
import { marked } from "marked"; // Import the marked library
import { loggerInfo } from "./misc";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const MAX_WORDS = 240; // Maximum number of words for the response

export const handleQuestion = async (
  question: string,
  base64Data: string // Pass the Base64 string directly
): Promise<string> => {
  const text = `answer using markdown and with no more than ${MAX_WORDS} words, trying to include properties when applicable always adding \`Place ID\`, question: ${question}`;
  const contents = [
    {
      text,
    },
    {
      inlineData: {
        mimeType: "text/plain",
        data: base64Data, // Use the Base64 string here
      },
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-001",
    contents,
  });

  // Convert the Markdown response to HTML
  const markdown = response.text as string;
  const html = marked(markdown); // Convert Markdown to HTML
  loggerInfo(`AI query`, { text, markdown, html }); // Log the AI response

  return html; // Return the HTML string
};
