import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY });

// export async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemma-3n-e4b-it",
//     contents: "Explain how AI works in a few words",
//   });
//   console.log(response.text);
// }

// await main();
export const fix = async (text: string) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemma-3n-e4b-it",
            contents: "Explain how AI works in a few words",
        });
        console.log(response.text);
    }
    catch (error){
        console.error(error);
        throw new Error("Failed to generate content")
    }
}