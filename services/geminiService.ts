
import { GoogleGenAI, Type } from "@google/genai";
import { WeightEntry, AiInsight } from "../types";

export const getWeightInsights = async (entries: WeightEntry[]): Promise<AiInsight> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  if (entries.length < 2) {
    return {
      summary: "Necesitas al menos dos registros para un análisis de tendencia.",
      trend: 'stable',
      advice: "Sigue registrando tu peso regularmente para obtener mejores consejos.",
      suggestedAction: "Realiza un nuevo pesaje mañana."
    };
  }

  const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const dataSummary = sortedEntries.map(e => `${e.date}: ${e.weight}kg`).join(', ');

  const prompt = `Analiza los siguientes registros de peso de un usuario: [${dataSummary}]. 
  Proporciona un resumen de la tendencia, un consejo motivador y una acción sugerida. 
  Responde en español y en formato JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            trend: { 
              type: Type.STRING,
              enum: ['up', 'down', 'stable']
            },
            advice: { type: Type.STRING },
            suggestedAction: { type: Type.STRING }
          },
          required: ["summary", "trend", "advice", "suggestedAction"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      summary: "Análisis no disponible en este momento.",
      trend: 'stable',
      advice: "Mantén la constancia en tus hábitos saludables.",
      suggestedAction: "Reintenta el análisis más tarde."
    };
  }
};
