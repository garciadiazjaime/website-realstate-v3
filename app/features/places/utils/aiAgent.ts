"use server";

export const handleQuestion = async (
  question: string,
  base64Data: string // Pass the Base64 string directly
): Promise<string> => {
  const url = `${process.env.NEXT_PUBLIC_API}/.netlify/functions/ai-agents/`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ question, base64Data }),
    credentials: "same-origin",
  });

  if (response.status >= 400) {
    return "An error occurred while processing your request.";
  }

  const html = await response.text();

  return html;
};
