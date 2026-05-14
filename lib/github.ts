const REPO_URL_REGEX = /^https:\/\/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/i;

export function parseGitHubRepoUrl(url: string): { owner: string; repo: string } | null {
  const match = url.trim().match(REPO_URL_REGEX);
  if (!match) {
    return null;
  }

  return { owner: match[1], repo: match[2] };
}

export async function fetchRepoData(owner: string, repo: string) {
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'RocketTurtle-MVP'
  };

  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers, cache: 'no-store' });
  if (repoRes.status === 404) {
    throw new Error('Repository not found or not public.');
  }
  if (!repoRes.ok) {
    throw new Error('Unable to fetch repository details. Please try again in a moment.');
  }

  const repoData = await repoRes.json();
  const treeRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${repoData.default_branch}?recursive=1`,
    { headers, cache: 'no-store' }
  );

  if (!treeRes.ok) {
    throw new Error('Unable to fetch repository file tree.');
  }

  const treeData = await treeRes.json();
  return { repoData, treeData };
}
