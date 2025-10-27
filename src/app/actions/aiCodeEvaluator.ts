// Replace: import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

// Initialization: The SDK automatically looks for the GEMINI_API_KEY
// in the process.env object when no API key is passed explicitly.
// NOTE: Ensure your GEMINI_API_KEY is set in .env.local
const ai = new GoogleGenAI({});

// --- SIMPLIFIED SCHEMA FOR ALGORITHMIC EVALUATION ---
// Renamed 'correctness_verdict' to 'verdict' and removed complexity fields.
const SIMPLIFIED_SCHEMA = {
  type: "OBJECT",
  properties: {
    verdict: {
      type: "STRING",
      enum: ["correct", "incorrect"],
      description:
        "Strictly 'correct' or 'incorrect' based on algorithmic logic, test passing, and efficiency.",
    },
    feedback: {
      type: "STRING",
      description:
        "A clear, concise analysis of the algorithm's correctness, efficiency (Time/Space Complexity MUST be included here), and overall quality.",
    },
    issues: {
      type: "ARRAY",
      items: { type: "STRING" },
      description:
        "List logical errors, efficiency problems, or failing test cases found.",
    },
  },
  required: ["verdict", "feedback", "issues"],
};

// --- UPDATED PROMPT TEMPLATE ---
const PROMPT_TEMPLATE = (problemDescription: string, userCode: string) => `
You are a specialized competitive programming judge focused only on algorithmic correctness and complexity.

You will be given the problem description for a standard DSA question:
---
${problemDescription}
---

The user has submitted code. Infer the programming language from the submission content.

User Code Submission:
---
${userCode}
---

Your responsibilities are STRICTLY:
1.  **Analyze Correctness:** Thoroughly test the code logic against the problem requirements, including edge cases (e.g., constraints on K, negative numbers, empty input).
2.  **Evaluate Complexity:** Determine and verify the Time Complexity and Space Complexity of the algorithm. This analysis **MUST be included in the 'feedback' field** to justify the verdict.
3.  **Verdict:** Provide a verdict of "correct" only if the algorithm is logically sound, handles all inputs correctly, and meets the implied efficiency goals.
4.  **Ignore:** Do NOT comment on styling, variable names, or visualization potential.

Output the result ONLY as the requested JSON format, which requires 'verdict', 'feedback', and 'issues'.
`;

// Define the structure for the return value (matching the simplified schema)
export interface AlgorithmicEvaluationResult {
  verdict: "correct" | "incorrect";
  feedback: string;
  issues: string[];
}

export async function aiEvaluateCode(
  problemDescription: string,
  codeText: string
): Promise<AlgorithmicEvaluationResult | { error: string }> {
  const prompt = PROMPT_TEMPLATE(problemDescription, codeText);

  // --- DEBUG LOG 1: Log the final prompt being sent ---
  console.log("--- DEBUG LOG: Final Prompt Sent to Gemini (Algorithmic) ---");
  console.log(prompt.substring(0, 500) + "...");
  console.log("-------------------------------------------");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0,
        responseMimeType: "application/json",
        responseSchema: SIMPLIFIED_SCHEMA, // Using the simplified schema
      },
    });

    // --- DEBUG LOG 2: Log the raw response object ---
    console.log("--- DEBUG LOG: Raw Gemini API Response (Candidates) ---");
    console.log(JSON.stringify(response.candidates, null, 2));
    console.log("-------------------------------------------------------");

    const content = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.error("--- DEBUG LOG: ERROR - No Content received ---");
      throw new Error("Empty response received from AI.");
    }

    // --- DEBUG LOG 3: Log the content string before parsing ---
    console.log("--- DEBUG LOG: JSON Content String Received ---");
    console.log(content);
    console.log("----------------------------------------------");

    // Parse the strict JSON response from AI
    return JSON.parse(content) as AlgorithmicEvaluationResult;
  } catch (error) {
    console.error("--- DEBUG LOG: AI Evaluation Failure ---");
    console.error("AI Evaluation Error:", error);
    console.error("---------------------------------------");

    // Return a structured error object on failure
    return {
      error:
        "AI service failed to evaluate the code. Check server logs for details.",
    };
  }
}
