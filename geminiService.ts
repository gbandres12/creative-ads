
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { GenerationInput, Brand } from "./types";

const API_KEY = process.env.API_KEY || "";

export const generateContent = async (input: GenerationInput, brand: Brand) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // 1. Generate Text (Caption and Overlay Text)
  const textModel = 'gemini-3-flash-preview';
  const textPrompt = `
    Gere conteúdo para redes sociais para a plataforma ${input.platform.toUpperCase()}.
    Tópico: ${input.topic}
    Nome da Marca: ${brand.name}
    Tom de voz: ${input.tone}
    Chamada para Ação (CTA): ${input.cta}
    
    IMPORTANTE: O conteúdo deve estar inteiramente em PORTUGUÊS (PT-BR).
    Responda em formato JSON com:
    - "caption": Uma legenda cativante para o post com emojis.
    - "overlayText": Uma frase curta e impactante de 3 a 5 palavras para colocar SOBRE a imagem.
  `;

  const textResponse = await ai.models.generateContent({
    model: textModel,
    contents: textPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          caption: { type: Type.STRING },
          overlayText: { type: Type.STRING }
        },
        required: ["caption", "overlayText"]
      }
    }
  });

  const textData = JSON.parse(textResponse.text || "{}");

  // 2. Generate Base Image (Optimized Prompt)
  const imageModel = 'gemini-2.5-flash-image';
  const imagePrompt = `
    Professional high-end commercial photography for a ${input.platform} marketing campaign.
    Topic: ${input.topic}.
    
    Visual Composition: Balanced shot following the rule of thirds. Ensure significant "copy space" (empty area) in the lower third for text overlay. Use a central subject with a clean, uncluttered background.
    
    Lighting & Atmosphere: Cinematic lighting with dramatic highlights and soft, deep shadows. Use volumetric lighting to create depth and a premium atmosphere. The scene should feel sophisticated, vibrant, and highly engaging.
    
    Color Palette: Integrate the brand colors ${brand.primary