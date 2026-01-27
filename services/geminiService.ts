import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not defined in process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateEcoAnalysis = async (userPrompt: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) {
    return "Planetary Brief Analysis Engine is currently offline (Missing API Key).";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: userPrompt,
      config: {
        systemInstruction: `You are the Planetary Brief AI, an intelligent environmental assistant powered by Google's Gemini 3 Pro model.
        
        Your Goal: To answer *any* user question regarding the environment, climate change, sustainability, nature, or green technology with high accuracy and nuance.

        Guidelines:
        1.  **Scope**: You can discuss anything from the physics of the greenhouse effect to practical recycling tips, global policy (Paris Agreement), or specific species conservation.
        2.  **Tone**: Helpful, authoritative, scientific, yet accessible. Avoid alarmism but be realistic about threats.
        3.  **Format**: Keep responses concise (under 200 words) unless asked for a deep dive. Use markdown (bullet points, bold text) for readability.
        4.  **Verification**: Rely on consensus science (IPCC, NOAA, etc.). If a topic is debated, present the prevailing scientific view.
        
        If the user asks who you are, identify as the Planetary Brief AI Assistant.`,
      }
    });

    return response.text || "Analysis incomplete. Data stream interrupted.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to process environmental data at this moment. Please retry.";
  }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
  const ai = getAiClient();
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: { parts: [{ text }] },
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error("Gemini TTS Error:", error);
    return null;
  }
};