// OpenRouter API integration for code evaluation
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || 'AIzaSyCAjCf6e0aaaoPMv4iJlBG7HayWA99ZQd8';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface EvaluationRequest {
  code: string;
  problemStatement: string;
  testCases?: string;
  language?: string;
}

interface EvaluationResponse {
  verdict: 'CORRECT' | 'WRONG' | 'ERROR';
  message: string;
  details?: string;
}

/**
 * Evaluates code using OpenRouter API
 */
export async function evaluateCodeWithAI(request: EvaluationRequest): Promise<EvaluationResponse> {
  try {
    const prompt = `
You are a code evaluation system. Analyze the following code submission and determine if it correctly solves the problem.

PROBLEM STATEMENT:
${request.problemStatement}

${request.testCases ? `TEST CASES:\n${request.testCases}` : ''}

CODE SUBMISSION (${request.language || 'Unknown language'}):
${request.code}

INSTRUCTIONS:
1. Check if the code logic is correct for the problem
2. Verify it handles edge cases
3. Check for syntax errors or logical flaws
4. Provide a clear verdict: CORRECT, WRONG, or ERROR

Respond in JSON format:
{
  "verdict": "CORRECT" | "WRONG" | "ERROR",
  "message": "Brief explanation of your verdict",
  "details": "Optional detailed analysis"
}
`;

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'AlgoVibe Contest Platform'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a code evaluation assistant. Analyze code submissions and provide verdicts in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No response content from AI');
    }

    // Parse the JSON response
    const result = parseAIResponse(content);
    return result;

  } catch (error) {
    console.error('OpenRouter API Error:', error);
    
    return {
      verdict: 'ERROR',
      message: error instanceof Error ? error.message : 'Failed to evaluate code',
      details: 'The evaluation system encountered an error. Please try again.'
    };
  }
}

/**
 * Parse AI response and extract JSON
 */
function parseAIResponse(content: string): EvaluationResponse {
  try {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
    const jsonString = jsonMatch ? jsonMatch[1] : content;
    
    const parsed = JSON.parse(jsonString.trim());
    
    // Validate the response structure
    if (!parsed.verdict || !['CORRECT', 'WRONG', 'ERROR'].includes(parsed.verdict)) {
      throw new Error('Invalid verdict in response');
    }
    
    return {
      verdict: parsed.verdict,
      message: parsed.message || 'No message provided',
      details: parsed.details
    };
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    
    // Fallback: Try to determine verdict from text content
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('correct') || lowerContent.includes('accepted')) {
      return {
        verdict: 'CORRECT',
        message: 'Code appears to be correct based on analysis',
        details: content
      };
    } else if (lowerContent.includes('wrong') || lowerContent.includes('incorrect') || lowerContent.includes('fail')) {
      return {
        verdict: 'WRONG',
        message: 'Code has issues that need to be fixed',
        details: content
      };
    }
    
    return {
      verdict: 'ERROR',
      message: 'Unable to parse evaluation result',
      details: content
    };
  }
}

/**
 * Fallback evaluation (simple heuristics)
 */
export async function fallbackEvaluation(request: EvaluationRequest): Promise<EvaluationResponse> {
  // Basic heuristics for fallback
  const code = request.code.toLowerCase();
  
  // Check for common errors
  if (code.includes('syntaxerror') || code.includes('error')) {
    return {
      verdict: 'ERROR',
      message: 'Code contains syntax errors',
      details: 'Please fix the syntax errors in your code'
    };
  }
  
  // Check if code is too short (likely incomplete)
  if (code.length < 50) {
    return {
      verdict: 'WRONG',
      message: 'Code submission appears incomplete',
      details: 'Your code is too short. Please provide a complete solution.'
    };
  }
  
  // Default: Unable to determine
  return {
    verdict: 'ERROR',
    message: 'Unable to evaluate code automatically',
    details: 'Please ensure your code link is valid and accessible.'
  };
}