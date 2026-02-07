
import { GoogleGenAI, Type } from "@google/genai";
import { GenerationInput, Brand } from "./types";

export const generateContent = async (input: GenerationInput, brand: Brand) => {
  // Always use process.env.API_KEY directly when initializing the client.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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

  // Access the .text property directly (do not call as a method).
  const textData = JSON.parse(textResponse.text || "{}");

  // 2. Generate Base Image (Optimized Prompt)
  const imageModel = 'gemini-2.5-flash-image';
  const imagePrompt = `
    Professional high-end commercial photography for a ${input.platform} marketing campaign.
    Topic: ${input.topic}.
    
    Visual Composition: Balanced shot following the rule of thirds. Ensure significant "copy space" (empty area) in the lower third for text overlay. Use a central subject with a clean, uncluttered background.
    
    Lighting & Atmosphere: Cinematic lighting with dramatic highlights and soft, deep shadows. Use volumetric lighting to create depth and a premium atmosphere. The scene should feel sophisticated, vibrant, and highly engaging.
    
    Color Palette: Integrate the brand colors ${brand.primaryColor} and ${brand.secondaryColor} subtly through lighting, environment, or props to ensure brand consistency.
    
    Style: Photorealistic, 8k resolution, ultra-detailed textures, sharp focus on the main subject with a beautiful shallow depth of field (creamy bokeh background).
    
    MANDATORY: Do NOT include any text, typography, logos, or characters in the image. I will add the brand kit elements manually later. Focus purely on the visual metaphor and high-quality artistic scene.
  `;

  const imageResponse = await ai.models.generateContent({
    model: imageModel,
    contents: { parts: [{ text: imagePrompt }] },
    config: {
      imageConfig: {
        aspectRatio: input.platform === 'instagram' ? "1:1" : input.platform === 'youtube' ? "16:9" : "4:3",
      }
    }
  });

  let imageUrl = "";
  // Iterate through parts to find the image part, as it might not be the first part.
  for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  return {
    caption: textData.caption,
    overlayText: textData.overlayText,
    imageUrl: imageUrl
  };
};
