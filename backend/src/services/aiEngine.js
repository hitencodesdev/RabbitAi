import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Sends parsed JSON data to the Gemini API to generate a narrative summary.
 */
export const generateSummary = async (data) => {
  try {
    // If we're missing an API key, fallback or throw error safely
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set. Using mock generation for local development.");
      return "Mock Summary: The Q1 2026 data shows strong revenue growth in the North region, driven largely by the Electronics category. Several high-value transactions were successfully delivered, indicating steady performance. However, there was a minor cancellation noted in Home Appliances. Overall sales performance remains robust.";
    }

    // Create Gemini client inside function to avoid crash at module load
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Convert JSON data to string avoiding token limit explosions. We grab first 100 rows just in case.
    const limitedData = data.slice(0, 100); 
    const dataString = JSON.stringify(limitedData, null, 2);

    const prompt = `
      You are an expert sales analyst and executive communication professional. 
      Review the following sales data and provide a concise, structured executive brief.
      Please format your response primarily using bullet points, short clear metrics, and bold emphasis. Do NOT write long essay-like paragraphs.
      
      Structure the brief as follows:
      - **High-Level Summary** (1 short sentence)
      - **Key Metrics** (Bullet points for total revenue, top products, etc)
      - **Noteworthy Trends/Issues** (Bullet points for cancellations or spikes)
      
      Data: 
      \n\n${dataString}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error.message || error);
    console.error("Full error details:", JSON.stringify(error, null, 2));
    throw new Error('Failed to generate summary with AI: ' + (error.message || 'Unknown error'));
  }
};
