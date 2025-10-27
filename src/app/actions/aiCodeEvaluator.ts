import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const PROMPT_TEMPLATE = (problemDescription: string, userCode: string) => `
You are an expert code reviewer.

Given this problem:
${problemDescription}

And this code submission:
${userCode}

Evaluate ONLY the correctness and style.

Respond ONLY as JSON:
{
  "verdict": "correct" | "incorrect",
  "feedback": "String, brief and constructive",
  "issues": ["String - list of issue descriptions, if any"]
}
`;

export async function aiEvaluateCode(problemDescription: string, codeText: string) {
  const prompt = PROMPT_TEMPLATE(problemDescription, codeText);

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 300,
    temperature: 0,
  });

  const content = completion.choices[0]?.message?.content || "";
  try {
    return JSON.parse(content);
  } catch {
    return {
      verdict: "incorrect",
      feedback: "Could not parse AI response.",
      issues: ["AI output could not be parsed as JSON."],
    };
  }
}
