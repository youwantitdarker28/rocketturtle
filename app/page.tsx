'use client';

import { useState } from 'react';
import { ReportCard } from '@/components/report-card';
import { UrlForm } from '@/components/url-form';
import { RepoReport } from '@/types/repo';

export default function HomePage() {
  const [report, setReport] = useState<RepoReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze(url: string) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Could not analyze this repository.');
      }

      setReport(data.report);
    } catch (err) {
      setReport(null);
      setError(err instanceof Error ? err.message : 'Something unexpected happened.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-14 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs text-sky-700">RocketTurtle</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-5xl">Understand any public GitHub repository without the overwhelm.</h1>
        <p className="mt-4 max-w-2xl text-sm text-slate-600 sm:text-base">
          AI is the rocket. Humans are the turtle. RocketTurtle turns repository complexity into a calm, beginner-friendly learning report.
        </p>

        <UrlForm onAnalyze={handleAnalyze} loading={loading} />

        {error && <p className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

        {!report && !loading && !error && (
          <div className="card mt-10 p-8 text-sm text-slate-600 animate-fadeIn">
            <p className="font-medium text-slate-800">No report yet.</p>
            <p className="mt-1">Paste a public GitHub repository URL above to generate your first Repo Understanding Report.</p>
          </div>
        )}

        {loading && (
          <div className="card mt-10 p-8 animate-pulse text-sm text-slate-500">
            Building your report… checking repository details, scanning important files, and preparing a beginner learning guide.
          </div>
        )}

        {report && <ReportCard report={report} />}
      </div>
    </main>
  );
}
