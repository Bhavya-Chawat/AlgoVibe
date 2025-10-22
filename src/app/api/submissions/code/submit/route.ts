import { NextRequest, NextResponse } from 'next/server';

// Mock function to simulate submission processing
function mockProcessSubmission(codeLink: string, problemId: string) {
  // Simulate some processing delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const submissionId = Math.random().toString(36).substring(7);
      resolve({
        success: true,
        submissionId,
        message: 'Code submission received successfully',
        timestamp: new Date().toISOString(),
        status: 'pending',
        score: Math.floor(Math.random() * 100)
      });
    }, 1000); // 1 second delay to simulate processing
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { codeLink, problemId } = body;

    // Validate input
    if (!codeLink || !problemId) {
      return NextResponse.json(
        { error: 'Code link and problem ID are required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(codeLink);
    } catch {
      return NextResponse.json(
        { error: 'Invalid code link URL' },
        { status: 400 }
      );
    }

    // Mock authentication - always succeed in test environment
    const mockUser = {
      id: 'mock-user-123',
      teamId: 'mock-team-456'
    };

    // Mock contest status - always active in test environment
    const mockContest = {
      status: 'active',
      startTime: new Date(Date.now() - 3600000), // 1 hour ago
      endTime: new Date(Date.now() + 3600000)    // 1 hour from now
    };

    // Process submission
    const result = await mockProcessSubmission(codeLink, problemId);

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Code submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}