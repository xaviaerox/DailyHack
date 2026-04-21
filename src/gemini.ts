import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export async function analyzeEntry(content: string) {
  if (!genAI) {
    // Return mock data if no API key
    return {
      quote: "El conocimiento es la única riqueza que no se agota al compartirla.",
      category: "Filosofía",
      title: "Reflexión Silenciosa",
      tags: ["sabiduría", "intercambio", "mente"]
    };
  }

  try {
    const prompt = `Analiza el siguiente texto de un diario de aprendizaje y genera:
    1. Una cita poética que resuma la esencia (máximo 20 palabras).
    2. Una categoría de una sola palabra (estilo Alquimia, Botánica, Sistemas, etc.).
    3. Un título evocativo.
    4. 3 tags cortos.
    
    Texto: "${content}"
    
    Responde ÚNICAMENTE en formato JSON: {"quote": "...", "category": "...", "title": "...", "tags": ["tag1", "tag2", "tag3"]}`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    
    // In this SDK, the response might be slightly different.
    // Based on typings, it's GenerateContentResponse
    const text = result.structuredResponse ? JSON.stringify(result.structuredResponse) : result.response.text();
    
    // If it's already a text block with JSON, parse it
    try {
        // Clean markdown code blocks if any
        const cleanedText = text.replace(/```json|```/g, "").trim();
        return JSON.parse(cleanedText);
    } catch (e) {
        console.error("Parse error:", e);
        return {
            quote: text.substring(0, 50) + "...",
            category: "General",
            title: "Crónica Analizada",
            tags: ["ia"]
        };
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      quote: "La tinta se ha secado antes de tiempo.",
      category: "Error",
      title: "Crónica Fallida",
      tags: ["error", "sistema", "vacio"]
    };
  }
}
