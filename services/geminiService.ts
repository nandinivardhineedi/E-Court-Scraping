
import { GoogleGenAI, Type } from "@google/genai";
import { CauseList } from '../types';

// IMPORTANT: This service uses Gemini to SIMULATE scraping from eCourts.
// Direct scraping from a browser is blocked by CORS policy.
// This approach provides a functional and dynamic UI without needing a backend proxy.

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

const generateWithSchema = async <T,>(prompt: string, schema: any): Promise<T> => {
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });
    const jsonString = response.text.trim();
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to fetch data from AI. Please check your API key and network.");
  }
};

export const getStates = (): Promise<string[]> => {
  const prompt = "List all states and union territories of India as a JSON array of strings.";
  const schema = { type: Type.ARRAY, items: { type: Type.STRING } };
  return generateWithSchema<string[]>(prompt, schema);
};

export const getDistricts = (state: string): Promise<string[]> => {
  const prompt = `Generate a JSON array of 15 major district names for the Indian state of '${state}'.`;
  const schema = { type: Type.ARRAY, items: { type: Type.STRING } };
  return generateWithSchema<string[]>(prompt, schema);
};

export const getCourtComplexes = (district: string): Promise<string[]> => {
  const prompt = `Generate a JSON array of 5 realistic court complex names for '${district}' district, India. For example: 'District Court Complex, ${district}', 'Civil Court, ${district}', or 'Patiala House Courts'.`;
  const schema = { type: Type.ARRAY, items: { type: Type.STRING } };
  return generateWithSchema<string[]>(prompt, schema);
};

export const getCauseList = (complex: string, date: string): Promise<CauseList> => {
  const prompt = `
    You are a legal data simulator for the Indian eCourts system.
    For the court complex "${complex}" on date "${date}", generate a realistic cause list.
    The output must be a JSON array of court objects.
    - Generate data for 4 to 6 courts.
    - Each court object must have a "courtName" (e.g., "Hon'ble Mr. Justice R.K. Singh, Court No. 5") and a "cases" array.
    - Each case object in the "cases" array must have:
      - "serialNumber": A number, starting from 1 for each court.
      - "caseNumber": A string (e.g., "Crl.A. 123/2024" or "CS(OS) 45/2023").
      - "parties": A string (e.g., "State of Delhi vs. Anil Kumar").
      - "petitionerAdvocate": A realistic Indian advocate name.
      - "respondentAdvocate": Another realistic Indian advocate name.
      - "pdfAvailable": A boolean, randomly assigned.
    - Each court should have between 5 and 10 cases.
    - Ensure the data is varied, realistic, and strictly follows the provided schema.
  `;

  const schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        courtName: { type: Type.STRING },
        cases: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              serialNumber: { type: Type.INTEGER },
              caseNumber: { type: Type.STRING },
              parties: { type: Type.STRING },
              petitionerAdvocate: { type: Type.STRING },
              respondentAdvocate: { type: Type.STRING },
              pdfAvailable: { type: Type.BOOLEAN },
            },
            required: ["serialNumber", "caseNumber", "parties", "petitionerAdvocate", "respondentAdvocate", "pdfAvailable"],
          },
        },
      },
      required: ["courtName", "cases"],
    },
  };

  return generateWithSchema<CauseList>(prompt, schema);
};
