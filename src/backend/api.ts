import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY });

export const fix = async (text: string )  => {
    try {
        const response = await ai.models.generateContent({
            model: "gemma-3n-e4b-it",
            contents: "You are an expert in text optimization. Your task is to fix the following text by removing duplicate sentences and improving clarity. Do not change the meaning of the text and do not change sentences that does not need fixing.Type your best fixed vision of the text: " + text,
        });

        return response.text;
    }
    catch (error){
        console.error(error);
        throw new Error("Failed to generate content")
    }
}