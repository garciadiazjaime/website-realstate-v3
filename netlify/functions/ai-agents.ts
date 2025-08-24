import { GoogleGenAI } from "@google/genai";
import { marked } from "marked";
import type { HandlerEvent } from "@netlify/functions";

const GEMINI_API_KEY = "TEST";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const MAX_WORDS = 240; // Maximum number of words for the response

export const handler = async (event: HandlerEvent) => {
  // Apply the type here
  const body = JSON.parse(event.body || "{}");
  const { question, base64Data } = body;

  if (!question || !base64Data) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Missing required parameters",
      }),
    };
  }

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
  const markdown = response.text;
  const html = marked(markdown!); // Convert Markdown to HTML
  console.log(`AI query`, { text, markdown, html }); // Log the AI response

  return {
    statusCode: 200,
    body: html,
  };
};
