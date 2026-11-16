
import { GoogleGenAI } from "@google/genai";

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing from backend .env");
  }

  return new GoogleGenAI({ apiKey });
};

const wait = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const generateResumeText = async ({
  task,
  content,
  tone = "professional",
  instruction = "",
}) => {
  if (!content || !content.trim()) {
    throw new Error("Resume content is required.");
  }

  const ai = getGeminiClient();

  const maxAttempts = 3;

  // Special prompt for Education data extraction
  const prompt =
    task === "education"
      ? `
        You are an expert resume education data extraction assistant.

        Extract education information from the user's text.

        User instruction:
        ${instruction || "Extract and organize the education details."}

        Return ONLY valid JSON.
        Do not include Markdown, code fences, or explanations.

        Use exactly this JSON structure:
        {
          "institution": "",
          "degree": "",
          "field": "",
          "startDate": "",
          "endDate": "",
          "gradeType": "",
          "grade": ""
        }

        Rules:
        - institution: School, college, or university name.
        - degree: Degree or qualification, such as B.Tech, B.Sc, Class XII.
        - field: Subject or specialization, if provided.
        - startDate: Starting year, if provided.
        - endDate: Ending or graduation year, if provided.
        - gradeType: Only CGPA, SGPA, or Percentage.
        - grade: Academic score exactly as provided.
        - Do not invent missing information.
        - Use empty strings for information not provided.
        - Preserve the original facts.
        - Do not convert CGPA or SGPA into percentage.
        - Do not add a default score.

        User's education details:
        ${content}
      `
      : `
        You are an expert resume writing assistant.

        Task: ${task}
        Writing tone: ${tone}

        User instruction:
        ${instruction || "Improve the content professionally."}

        Rules:
        - Follow the user's instruction.
        - Correct grammar and spelling.
        - Use professional and attractive language.
        - Keep content ATS-friendly.
        - Never invent skills, qualifications or achievements.
        - Preserve factual information.
        - Return only the improved content.

        Original resume content:
        ${content}
      `;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
        contents: prompt,
      });

      const result = response.text?.trim();

      if (!result) {
        throw new Error("Gemini returned an empty response.");
      }

      return result;

    } catch (error) {
      const errorMessage = error.message || "";

      const isTemporaryError =
        errorMessage.includes("503") ||
        errorMessage.includes("UNAVAILABLE") ||
        errorMessage.includes("high demand");

      if (!isTemporaryError || attempt === maxAttempts) {
        throw error;
      }

      console.log(
        `Gemini temporarily unavailable. Retrying (${attempt}/${maxAttempts})...`
      );

      await wait(1000 * 2 ** attempt);
    }
  }

  throw new Error("Unable to generate resume content.");
};
