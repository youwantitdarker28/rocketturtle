export interface AnalysisRequest {
  repoUrl: string;
}

export interface ReportSection {
  title: string;
  items: string[];
}

export interface RepoReport {
  repository: {
    owner: string;
    name: string;
    description: string;
    defaultBranch: string;
    stars: number;
  };
  techStack: string[];
  importantFiles: string[];
  safeToEdit: string[];
  riskyFiles: string[];
  learningOrder: string[];
  architectureExplanation: string;
}
