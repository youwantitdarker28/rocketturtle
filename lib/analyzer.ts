import { RepoReport } from './types';

const TECH_HINTS: Array<{ match: RegExp; tech: string }> = [
  { match: /next\.config\.(js|mjs|ts)$/i, tech: 'Next.js' },
  { match: /nuxt\.config\./i, tech: 'Nuxt' },
  { match: /package\.json$/i, tech: 'Node.js' },
  { match: /tsconfig\.json$/i, tech: 'TypeScript' },
  { match: /tailwind\.config\./i, tech: 'Tailwind CSS' },
  { match: /requirements\.txt$/i, tech: 'Python' },
  { match: /go\.mod$/i, tech: 'Go' },
  { match: /Cargo\.toml$/i, tech: 'Rust' }
];

function dedupe(items: string[]) {
  return [...new Set(items)];
}

export function buildReport(repoData: any, treeData: any): RepoReport {
  const files = (treeData.tree ?? []).filter((item: any) => item.type === 'blob').map((item: any) => item.path as string);

  const importantPatterns = [
    'README.md',
    'package.json',
    'tsconfig.json',
    'app/',
    'src/',
    'routes',
    'components',
    '.env.example',
    'next.config',
    'tailwind.config'
  ];

  const importantFiles = files.filter((file) =>
    importantPatterns.some((pattern) =>
      pattern.endsWith('/') ? file.startsWith(pattern) : file.toLowerCase().includes(pattern.toLowerCase())
    )
  );

  const techStack = dedupe(
    TECH_HINTS.filter((hint) => files.some((file) => hint.match.test(file))).map((hint) => hint.tech)
  );

  const riskyFiles = files.filter((file) =>
    /(^|\/)(package-lock\.json|yarn\.lock|pnpm-lock\.yaml|dockerfile|next\.config|webpack|vite\.config|tsconfig)/i.test(
      file
    )
  );

  const safeToEdit = files
    .filter((file) => /(readme|docs|components|pages|app\/.*\.(tsx|mdx?)$|src\/.*\.(tsx|mdx?))/i.test(file))
    .slice(0, 12);

  const learningOrder = [
    'Start with README to understand the project goals and setup.',
    'Open package.json to see scripts and dependencies.',
    'Explore app/ or src/ to understand how features are organized.',
    'Review routing files to learn how users move through the app.',
    'Inspect configuration files (tsconfig, next.config, lint configs) last.'
  ];

  return {
    repository: {
      owner: repoData.owner?.login ?? 'unknown',
      name: repoData.name ?? 'unknown',
      description: repoData.description ?? 'No description provided.',
      defaultBranch: repoData.default_branch ?? 'main',
      stars: repoData.stargazers_count ?? 0
    },
    techStack: techStack.length ? techStack : ['Could not confidently detect tech stack yet'],
    importantFiles: importantFiles.slice(0, 20),
    safeToEdit: safeToEdit.length ? safeToEdit : ['README.md', 'docs/', 'UI components'],
    riskyFiles: riskyFiles.length ? riskyFiles.slice(0, 12) : ['Build and configuration files'],
    learningOrder,
    architectureExplanation:
      'This project appears to follow a layered structure: configuration and dependencies at the root, application logic inside app/src folders, and reusable pieces in components. A beginner can safely understand it by moving from README to routes and UI components before touching core configuration.'
  };
}
