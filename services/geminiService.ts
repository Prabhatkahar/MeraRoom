
import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.API_KEY directly in the initialization as per coding guidelines.
export const generateRoomDescription = async (title: string, location: string, amenities: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create an attractive, professional real estate description for a rental property:
      Title: ${title}
      Location: ${location}
      Amenities: ${amenities.join(', ')}
      Keep it under 100 words and highlight the benefits.`,
    });
    // Access response.text directly (property, not a method).
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI description.";
  }
};

export const searchAI = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User is searching for: "${query}". 
      Analyze their intent and return a JSON object with filters: 
      - minPrice (number)
      - maxPrice (number)
      - propertyType (string: Room, Apartment, Hostel, House)
      - locationKeywords (string array)
      
      Respond ONLY with the JSON.`,
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
    
    // Access response.text directly and handle potential undefined value.
    const text = response.text;
    if (!text) return null;
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("AI Search Error:", error);
    return null;
  }
};
