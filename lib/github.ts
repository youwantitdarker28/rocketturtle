import { RepoReport } from '@/types/repo';

const OWNER_REPO = /^https?:\/\/github\.com\/([^/\s]+)\/([^/#?\s]+)\/?(?:#.*)?(?:\?.*)?$/i;

export function validateGitHubRepoUrl(rawUrl: string): string | null {
  const url = rawUrl.trim();
  if (!url) return 'Please paste a GitHub repository URL.';
  if (!/^https?:\/\//i.test(url)) return 'URL must start with http:// or https://.';
  if (!/github\.com/i.test(url)) return 'Please enter a URL from github.com.';
  const match = url.match(OWNER_REPO);
  if (!match) return 'Use the format: https://github.com/owner/repository';
  if (match[2].toLowerCase() === 'issues' || match[2].toLowerCase() === 'pulls') {
    return 'Please paste the main repository URL, not a subpage.';
  }
  return null;
}

export function parseGitHubRepoUrl(url: string): { owner: string; repo: string } | null {
  const match = url.trim().match(OWNER_REPO);
  if (!match) return null;
  return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
}

type GitHubTree = { path: string; type: 'tree' | 'blob' }[];

function detectFromDependencies(packageJson: Record<string, unknown>): string[] {
  const deps = {
    ...(typeof packageJson.dependencies === 'object' && packageJson.dependencies ? packageJson.dependencies : {}),
    ...(typeof packageJson.devDependencies === 'object' && packageJson.devDependencies ? packageJson.devDependencies : {}),
  } as Record<string, string>;

  const found = new Set<string>();
  const has = (name: string) => Boolean(deps[name]);

  if (has('next')) found.add('Next.js');
  if (has('react')) found.add('React');
  if (has('typescript')) found.add('TypeScript');
  if (has('tailwindcss')) found.add('Tailwind CSS');
  if (has('vite')) found.add('Vite');
  if (has('express')) found.add('Express');
  if (has('nestjs')) found.add('NestJS');

  return [...found];
}

function detectTechStack(paths: string[], packageJson: Record<string, unknown> | null): string[] {
  const stack = new Set<string>();
  if (packageJson) detectFromDependencies(packageJson).forEach((item) => stack.add(item));

  if (paths.some((p) => p === 'tsconfig.json')) stack.add('TypeScript');
  if (paths.some((p) => p.startsWith('app/'))) stack.add('Next.js App Router');
  if (paths.some((p) => p.includes('tailwind.config'))) stack.add('Tailwind CSS');
  if (paths.some((p) => p.includes('eslint.config') || p.includes('.eslintrc'))) stack.add('ESLint');
  if (paths.some((p) => p.includes('jest.config') || p.includes('vitest.config'))) stack.add('Testing Setup');
  if (paths.some((p) => p === 'Dockerfile' || p.includes('docker-compose'))) stack.add('Docker');

  return [...stack];
}

async function fetchPackageJson(owner: string, repo: string): Promise<Record<string, unknown> | null> {
  const packageRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/package.json`, {
    headers: { Accept: 'application/vnd.github+json' },
    cache: 'no-store',
  });

  if (!packageRes.ok) return null;
  const data = await packageRes.json();
  if (!data?.content) return null;

  try {
    const decoded = Buffer.from(data.content, 'base64').toString('utf-8');
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function analyzeRepository(url: string): Promise<RepoReport> {
  const validationError = validateGitHubRepoUrl(url);
  if (validationError) throw new Error(validationError);

  const parsed = parseGitHubRepoUrl(url);
  if (!parsed) throw new Error('Invalid GitHub repository URL.');

  const repoRes = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`, {
    headers: { Accept: 'application/vnd.github+json' },
    cache: 'no-store',
  });

  if (!repoRes.ok) {
    if (repoRes.status === 404) throw new Error('This repository was not found. Make sure it is public and spelled correctly.');
    if (repoRes.status === 403) throw new Error('GitHub rate limit reached. Please wait a bit and try again.');
    throw new Error('Unable to access GitHub right now. Please try again shortly.');
  }

  const repo = await repoRes.json();
  const packageJson = await fetchPackageJson(parsed.owner, parsed.repo);

  const treeRes = await fetch(
    `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/git/trees/${repo.default_branch}?recursive=1`,
    { headers: { Accept: 'application/vnd.github+json' }, cache: 'no-store' }
  );

  if (!treeRes.ok) throw new Error('Could not fetch the repository file tree.');

  const treeJson = await treeRes.json();
  const tree: GitHubTree = treeJson.tree ?? [];
  const files = tree.filter((item) => item.type === 'blob').map((item) => item.path);

  const importantPatterns = [/^README(\.md)?$/i, /^package\.json$/i, /^tsconfig\.json$/i, /^app\//i, /^src\//i, /routes?/i, /components?/i, /(config|\.config\.)/i];

  const importantFiles = files.filter((f) => importantPatterns.some((p) => p.test(f))).slice(0, 18);
  const safeToEdit = files.filter((f) => /README|docs\/|\.md$|components\//i.test(f)).slice(0, 8);
  const beCarefulFiles = files.filter((f) => /package-lock|yarn\.lock|pnpm-lock|next\.config|tsconfig|env|docker|middleware|api\//i.test(f)).slice(0, 8);

  return {
    overview: {
      owner: repo.owner?.login,
      name: repo.name,
      description: repo.description ?? 'No description provided.',
      defaultBranch: repo.default_branch,
      stars: repo.stargazers_count,
      language: repo.language,
      topics: repo.topics ?? [],
    },
    detectedTechStack: detectTechStack(files, packageJson),
    importantFiles,
    whatToLookAtFirst: [
      'README.md: learn the project purpose and setup steps.',
      'package.json: see scripts and dependencies.',
      files.some((f) => f.startsWith('app/')) ? 'app/: follow pages and routing flow.' : 'src/: follow main app entry and structure.',
      'components/: understand reusable UI building blocks.',
    ],
    safeToEdit,
    beCarefulFiles,
    learningOrder: [
      'Start with project docs (README and docs folder).',
      'Run and understand scripts in package.json.',
      'Read top-level routes/pages first, then components.',
      'Only then move into config/core infrastructure files.',
    ],
    beginnerArchitecture:
      'Think in layers: project setup files, route/page files, reusable components, and shared utilities. Start broad, then go deeper one folder at a time.',
  };
}
