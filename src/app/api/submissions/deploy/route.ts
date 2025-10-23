import { NextRequest, NextResponse } from 'next/server';

// Mock validation function
async function validateDeployment(url: string): Promise<{
  accessible: boolean;
  error?: string;
  details?: any;
}> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'AlgoVibe-Contest-Validator/1.0'
      }
    });

    if (!response.ok) {
      return {
        accessible: false,
        error: `Server responded with status ${response.status}`,
        details: {
          status: response.status,
          statusText: response.statusText
        }
      };
    }

    return {
      accessible: true,
      details: {
        status: 200,
        contentType: 'text/html',
        server: 'Mock Server',
        timestamp: new Date().toISOString(),
        responseTime: '100ms'
      }
    };

  } catch (error) {
    return {
      accessible: false,
      error: 'Failed to reach deployment',
      details: { 
        errorType: 'ConnectionError',
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}

// Mock leaderboard update
async function mockUpdateLeaderboard(
  teamId: string, 
  points: number,
  submissionType: string
): Promise<void> {
  console.log(`Mock leaderboard update: Team ${teamId} earned ${points} points for ${submissionType}`);
  // In a real app, this would update the database
  return Promise.resolve();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deploymentUrl, problemId } = body;

    // Validate input
    if (!deploymentUrl || !problemId) {
      return NextResponse.json(
        { error: 'Deployment URL and problem ID are required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(deploymentUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid deployment URL format' },
        { status: 400 }
      );
    }

    // Mock user authentication
    const mockTeamId = 'mock-team-123';

    // Mock contest status - always active
    const mockContest = {
      status: 'active',
      startTime: new Date(Date.now() - 3600000),
      endTime: new Date(Date.now() + 3600000)
    };

    // Validate deployment
    const validation = await validateDeployment(deploymentUrl);
    
    if (!validation.accessible) {
      return NextResponse.json(
        { 
          error: 'Deployment URL is not accessible',
          message: validation.error,
          details: validation.details
        },
        { status: 400 }
      );
    }

    // Mock submission ID
    const submissionId = Math.random().toString(36).substring(7);
    const timestamp = new Date().toISOString();

    // Mock points award
    const DEPLOYMENT_POINTS = 75;
    await mockUpdateLeaderboard(mockTeamId, DEPLOYMENT_POINTS, 'deployment');

    return NextResponse.json({
      success: true,
      submissionId,
      message: 'Deployment submitted successfully',
      validation: validation.details,
      timestamp,
      points: DEPLOYMENT_POINTS
    }, { status: 201 });

  } catch (error) {
    console.error('Deployment submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}