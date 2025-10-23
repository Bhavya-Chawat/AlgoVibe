export interface ValidationCheck {
  passed: boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  message?: string;
  checks?: ValidationCheck[];
  lastUpdated?: string;
}

export interface GitHubSubmissionBoxProps {
  onSubmit: (submission: {
    type: string;
    link: string;
    status: string;
    timestamp: Date;
  }) => void;
}