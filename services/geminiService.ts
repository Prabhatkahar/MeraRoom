import { GoogleGenAI, Type } from "@google/genai";

export const generateRoomDescription = async (title: string, location: string, amenities: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create an attractive, professional real estate description for a rental property:
      Title: ${title}
      Location: ${location}
      Amenities: ${amenities.join(', ')}
      Keep it under 100 words.`,
    });
    return response.text || "No description generated.";
  } catch (error: any) {
    console.error("MeraRoom: Gemini Error:", error.message);
    return "AI is currently resting.";
  }
};

export const getMeraBotResponse = async (history: { role: 'user' | 'model', text: string }[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `You are MeraBot. Help users with Pakistan rentals. Concise, professional.`,
        thinkingConfig: { thinkingBudget: 1000 }
      }
    });
    const lastMessage = history[history.length - 1].text;
    const response = await chat.sendMessage({ message: lastMessage });
    return response.text || "Thinking...";
  } catch (error) {
    return "MeraBot is offline.";
  }
};

export const fixAndArrangeCode = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `User needs help fixing or arranging their project. 
      Request: "${query}"
      Act as the "MeraArchitect". Provide technical fixes and structure advice. 
      Help them organize into a "lib/" structure if requested.`,
      config: {
        thinkingConfig: { thinkingBudget: 8000 }
      }
    });
    return response.text || "Analyzing code node tree...";
  } catch (error) {
    return "Architect system error.";
  }
};

export const searchAI = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `User is searching for: "${query}". Return JSON filter object.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            minPrice: { type: Type.NUMBER },
            maxPrice: { type: Type.NUMBER },
            propertyType: { type: Type.STRING },
            locationKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return response.text ? JSON.parse(response.text) : null;
  } catch (error) {
    return null;
  }
};