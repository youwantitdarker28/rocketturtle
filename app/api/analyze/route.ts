import { NextResponse } from 'next/server';
import { buildReport } from '@/lib/analyzer';
import { fetchRepoData, parseGitHubRepoUrl } from '@/lib/github';
import { AnalysisRequest } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalysisRequest;
    const parsed = parseGitHubRepoUrl(body.repoUrl ?? '');

    if (!parsed) {
      return NextResponse.json(
        { error: 'Please enter a valid public GitHub repository URL (https://github.com/owner/repo).' },
        { status: 400 }
      );
    }

    const { repoData, treeData } = await fetchRepoData(parsed.owner, parsed.repo);
    const report = buildReport(repoData, treeData);

    return NextResponse.json({ report });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong during analysis.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
