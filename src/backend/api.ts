import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY });

export const fix = async (text: string, data: Array<any> , OGtext: string)  => {
    try {
        const response = await ai.models.generateContent({
            model: "gemma-3n-e4b-it",
            contents: "You are an expert in text optimization. Your task is to fix the following text by removing duplicate sentences and improving clarity. Do not change the meaning of the text and do not change sentences that does not need fixing.  do not change the structure or layout of the text. Keep all line breaks, whitespace, and formatting exactly as in the input. If the text is a single block, it must remain that way. If it has line breaks, preserve them.Type your best fixed vision of the text: " + text + "Revise it also with this data that shows which sentences where marked similar by the system:" + data + "The only output you're going to write is the fixed text and what have been changed, shortly write the changes, keep in mind that the system may already deleted some duplicates so write them in changes, dont use the word changes at the start, just list them, just, original text: " + OGtext + ", the changes segment must be seperated from the text by '---'",
        });

        return response.text;
    }
    catch (error){
        console.error(error);
        throw new Error("Failed to generate content")
    }
}