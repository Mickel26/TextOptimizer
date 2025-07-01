import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY });

export const fix = async (text: string, data: Array<any>, OGtext: string) => {
    const prompt = `
    You are a text revision expert.

    Your task is to improve the following text by:
    - Removing duplicate or very similar sentences
    - Rewriting awkward, unclear, or repetitive sentences for better clarity
    - Preserving the original meaning of the content

    ✅ You may:
    - Modify sentences to make them clearer or smoother
    - Delete sentences only if they are clearly redundant or duplicates

    🚫 Do NOT:
    - Add any new ideas or sentences
    - Change the order, layout, or formatting of the text
    - Add headings, labels, or explanations
    - Add extra spacing or blank lines

    ✏️ Output format:
    1. First, return only the improved version of the text (no label)
    2. Then, clearly list what was changed: what was removed and what was rewritten
    3. Separate the two parts using this exact delimiter:  
    '---'

    Use this similarity data to guide your decisions:  
    ${JSON.stringify(data)}

    Original version for reference when listing changes:  
    ${OGtext}

    Input text to revise:  
    ${text}
    `.trim();

    try {
        const response = await ai.models.generateContent({
            model: "gemma-3n-e4b-it",
            contents: prompt,
        });
        console.log(response.text)
        return response.text;
    }
    catch (error) {
        console.error(error);
        throw new Error("Failed to generate content")
    }
}