export type RepoOverview = {
  owner: string;
  name: string;
  description: string;
  defaultBranch: string;
  stars: number;
  language: string | null;
  topics: string[];
};

export type RepoReport = {
  overview: RepoOverview;
  detectedTechStack: string[];
  importantFiles: string[];
  whatToLookAtFirst: string[];
  safeToEdit: string[];
  beCarefulFiles: string[];
  learningOrder: string[];
  beginnerArchitecture: string;
};
