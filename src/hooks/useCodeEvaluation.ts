import { useState, useCallback } from 'react';

interface EvaluationResult {
  status: 'idle' | 'checking' | 'success' | 'error';
  verdict?: 'CORRECT' | 'WRONG' | 'ERROR';
  message?: string;
  timestamp?: string;
}

export function useCodeEvaluation() {
  const [result, setResult] = useState<EvaluationResult>({
    status: 'idle'
  });
  const [isLoading, setIsLoading] = useState(false);

  const evaluateCode = useCallback(async (codeLink: string, problemId: string) => {
    setIsLoading(true);
    setResult({ status: 'checking' });

    try {
      // Call the evaluation API
      const response = await fetch('/api/submissions/code/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codeLink,
          problemId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Evaluation failed');
      }

      // Update result with API response
      setResult({
        status: 'success',
        verdict: data.verdict,
        message: data.message,
        timestamp: new Date().toISOString()
      });

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      setResult({
        status: 'error',
        verdict: 'ERROR',
        message: errorMessage,
        timestamp: new Date().toISOString()
      });

      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitCode = useCallback(async (codeLink: string, problemId: string) => {
    try {
      const response = await fetch('/api/submissions/code/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          codeLink,
          problemId
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      throw new Error(errorMessage);
    }
  }, []);

  const reset = useCallback(() => {
    setResult({ status: 'idle' });
    setIsLoading(false);
  }, []);

  return {
    result,
    isLoading,
    evaluateCode,
    submitCode,
    reset
  };
}