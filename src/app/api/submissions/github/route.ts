import { NextRequest, NextResponse } from 'next/server';

// Mock GitHub repository validation
async function mockValidateGitHubRepo(repoUrl: string): Promise<{
  valid: boolean;
  error?: string;
  details?: any;
}> {
  try {
    // Extract owner and repo name
    const match = repoUrl.match(/github\.com\/([\w-]+)\/([\w.-]+)/);
    if (!match) {
      return {
        valid: false,
        error: 'Invalid GitHub URL format'
      };
    }

    const [, owner, repo] = match;

    // Mock successful validation (80% success rate)
    if (Math.random() > 0.2) {
      return {
        valid: true,
        details: {
          name: repo,
          description: 'Mock repository description',
          hasReadme: true,
          stars: Math.floor(Math.random() * 10),
          language: 'TypeScript',
          updatedAt: new Date().toISOString(),
          isPublic: true
        }
      };
    }

    // Mock validation failure
    return {
      valid: false,
      error: 'Repository not found or is private'
    };
  } catch (error) {
    return {
      valid: false,
      error: 'Failed to validate repository'
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repoUrl, problemId } = body;

    // Validate input
    if (!repoUrl || !problemId) {
      return NextResponse.json(
        { error: 'Repository URL and problem ID are required' },
        { status: 400 }
      );
    }

    // Validate GitHub URL format
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
    if (!githubRegex.test(repoUrl)) {
      return NextResponse.json(
        { error: 'Invalid GitHub repository URL format' },
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

    // Validate repository
    const validation = await mockValidateGitHubRepo(repoUrl);
    
    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: validation.error,
          message: 'Repository validation failed'
        },
        { status: 400 }
      );
    }

    // Mock submission ID and timestamp
    const submissionId = Math.random().toString(36).substring(7);
    const timestamp = new Date().toISOString();

    // Mock points award
    const GITHUB_POINTS = 50;
    console.log(`Mock points awarded: ${GITHUB_POINTS} to team ${mockTeamId}`);

    return NextResponse.json({
      success: true,
      submissionId,
      message: 'GitHub repository submitted successfully',
      validation: validation.details,
      timestamp,
      points: GITHUB_POINTS
    }, { status: 201 });

  } catch (error) {
    console.error('GitHub submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}