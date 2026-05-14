import { NextRequest, NextResponse } from 'next/server';
import { analyzeRepository } from '@/lib/github';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { url?: string };
    const url = body?.url ?? '';
    const report = await analyzeRepository(url);
    return NextResponse.json({ report });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
