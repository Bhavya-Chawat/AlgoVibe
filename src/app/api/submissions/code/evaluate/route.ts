import { NextRequest, NextResponse } from 'next/server';

// Mock evaluation function
function mockEvaluateCode(code: string): {
  verdict: 'CORRECT' | 'WRONG' | 'ERROR';
  message: string;
  details?: any;
} {
  // Simple mock evaluation logic
  if (code.length < 10) {
    return {
      verdict: 'WRONG',
      message: 'Code submission is too short.',
    };
  }

  // Simulate some basic success/failure scenarios
  const random = Math.random();
  if (random > 0.3) {
    return {
      verdict: 'CORRECT',
      message: 'All test cases passed successfully!',
      details: {
        testsPassed: 5,
        totalTests: 5,
        executionTime: '0.5s'
      }
    };
  }

  return {
    verdict: 'WRONG',
    message: 'Some test cases failed.',
    details: {
      testsPassed: 3,
      totalTests: 5,
      failedTest: 'Test case #4'
    }
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { codeLink } = body;

    // Basic validation
    if (!codeLink) {
      return NextResponse.json(
        { error: 'Code link is required' },
        { status: 400 }
      );
    }

    // Mock fetch code content
    let codeContent: string;
    try {
      const response = await fetch(codeLink);
      if (!response.ok) throw new Error('Failed to fetch code');
      codeContent = await response.text();
    } catch (error) {
      return NextResponse.json({
        verdict: 'ERROR',
        message: 'Unable to access code link. Please ensure the link is publicly accessible.'
      }, { status: 400 });
    }

    // Use mock evaluation
    const result = mockEvaluateCode(codeContent);

    return NextResponse.json({
      ...result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Code evaluation error:', error);
    return NextResponse.json({
      verdict: 'ERROR',
      message: 'An error occurred during evaluation. Please try again.'
    }, { status: 500 });
  }
}