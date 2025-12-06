import { GoogleGenAI } from "@google/genai";
import { ArticleCategory } from "../types";

// In a real app, this would be a backend endpoint to protect the key.
// For this demo, we assume the environment variable is present in the build.
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const generateArticleContent = async (topic: string, category: ArticleCategory): Promise<{ title: string; content: string; excerpt: string }> => {
  if (!apiKey) {
    throw new Error("Chave de API ausente. Não é possível gerar conteúdo.");
  }

  const prompt = `
    Escreva um post de blog técnico profissional e de alta qualidade sobre "${topic}" na categoria de "${category}".
    
    A saída deve ser um objeto JSON com os seguintes campos:
    - title: Um título atraente e profissional em Português do Brasil.
    - excerpt: Um resumo de 2 frases do artigo em Português.
    - content: O corpo completo do artigo em formato Markdown, escrito em Português do Brasil. Use h2 para seções, blocos de código para exemplos (se aplicável) e mantenha um tom profissional e conhecedor. O artigo deve ter pelo menos 400 palavras.
    
    Não inclua formatação markdown como \`\`\`json na resposta, apenas a string JSON bruta.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    
    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Falha ao gerar conteúdo do artigo.");
  }
};