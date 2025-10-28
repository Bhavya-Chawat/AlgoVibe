import { GoogleGenAI } from "@google/genai";

// --- CLIENT POOL CONFIGURATION ---

// Collect up to 5 API keys (GEMINI_API_KEY_1 ... GEMINI_API_KEY_5)
const apiKeys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5,
].filter((key) => key) as string[];

if (apiKeys.length === 0) {
  console.warn(
    "--- WARNING: No Gemini API keys found. Proceeding only if environment sets a key dynamically. ---"
  );
}

// Create client pool (Round-Robin ready)
const aiClientPool: GoogleGenAI[] =
  apiKeys.length > 0
    ? apiKeys.map((key) => new GoogleGenAI({ apiKey: key }))
    : [new GoogleGenAI({})]; // fallback single client

// Round-Robin index
let currentClientIndex = 0;

/**
 * Get the next GoogleGenAI client from the pool.
 */
function getNextClient(): GoogleGenAI {
  const client = aiClientPool[currentClientIndex];
  currentClientIndex = (currentClientIndex + 1) % aiClientPool.length;
  return client;
}

// --- SIMPLIFIED SCHEMA ---
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

// --- PROMPT TEMPLATE ---
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
1. **Analyze Correctness:** Thoroughly test the code logic against the problem requirements, including edge cases.
2. **Evaluate Complexity:** Determine and verify the Time Complexity and Space Complexity. Include this in 'feedback'.
3. **Verdict:** Provide "correct" only if the code is fully correct and efficient.
4. **Ignore:** Do NOT comment on styling or names.

Output only valid JSON with fields: 'verdict', 'feedback', and 'issues'.
`;

// --- TYPE DEFINITION ---
export interface AlgorithmicEvaluationResult {
  verdict: "correct" | "incorrect";
  feedback: string;
  issues: string[];
}

// --- MAIN FUNCTION ---
export async function aiEvaluateCode(
  problemDescription: string,
  codeText: string
): Promise<AlgorithmicEvaluationResult | { error: string }> {
  const prompt = PROMPT_TEMPLATE(problemDescription, codeText);

  const ai = getNextClient();

  console.log("--- DEBUG LOG: Final Prompt Sent to Gemini (Algorithmic) ---");
  console.log(prompt.substring(0, 500) + "...");
  console.log(
    `--- Using Client Index: ${
      currentClientIndex === 0 ? aiClientPool.length : currentClientIndex
    } of ${aiClientPool.length} ---`
  );
  console.log("-------------------------------------------");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0,
        responseMimeType: "application/json",
        responseSchema: SIMPLIFIED_SCHEMA,
      },
    });

    console.log("--- DEBUG LOG: Raw Gemini API Response (Candidates) ---");
    console.log(JSON.stringify(response.candidates, null, 2));
    console.log("-------------------------------------------------------");

    const content = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      console.error("--- DEBUG LOG: ERROR - No Content received ---");
      throw new Error("Empty response received from AI.");
    }

    console.log("--- DEBUG LOG: JSON Content String Received ---");
    console.log(content);
    console.log("----------------------------------------------");

    return JSON.parse(content) as AlgorithmicEvaluationResult;
  } catch (error) {
    console.error("--- DEBUG LOG: AI Evaluation Failure ---");
    console.error("AI Evaluation Error:", error);
    console.error("---------------------------------------");

    return {
      error:
        "AI service failed to evaluate the code. Check server logs for details.",
    };
  }
}
