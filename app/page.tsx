'use client';

import { FormEvent, useState } from 'react';
import { ReportCard } from '@/components/report-card';
import { RepoReport } from '@/lib/types';

export default function HomePage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [report, setReport] = useState<RepoReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to analyze repository.');
      }

      setReport(data.report);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-12 md:px-8">
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-calm-accent">RocketTurtle</p>
        <h1 className="mt-4 text-4xl font-semibold md:text-5xl">AI is the rocket. Humans are the turtle.</h1>
        <p className="mt-4 text-base text-calm-muted md:text-lg">
          Paste a public GitHub URL and get a calm, beginner-friendly repository understanding report.
        </p>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-3 rounded-2xl border border-calm-border bg-white p-4 shadow-soft md:flex-row">
          <input
            type="url"
            required
            value={repoUrl}
            onChange={(event) => setRepoUrl(event.target.value)}
            placeholder="https://github.com/owner/repository"
            className="h-12 flex-1 rounded-xl border border-calm-border px-4 outline-none ring-calm-accent transition focus:ring"
          />
          <button
            type="submit"
            disabled={loading}
            className="h-12 rounded-xl bg-calm-accent px-6 font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Analyzing...' : 'Analyze Repository'}
          </button>
        </form>
      </section>

      {loading && <p className="mt-10 text-center text-calm-muted">Reading repository structure and preparing your report…</p>}
      {error && <p className="mt-10 text-center text-red-600">{error}</p>}

      {!loading && !report && !error && (
        <section className="mt-12 card text-center">
          <h2 className="text-xl font-semibold">Ready when you are</h2>
          <p className="mt-2 text-sm text-calm-muted">
            Start with any public GitHub project to see important files, risky areas, and a simple learning path.
          </p>
        </section>
      )}

      {report && (
        <section className="mt-12 space-y-6">
          <article className="card animate-fadeIn">
            <h2 className="text-2xl font-semibold">{report.repository.owner}/{report.repository.name}</h2>
            <p className="mt-2 text-calm-muted">{report.repository.description}</p>
            <p className="mt-2 text-sm text-calm-muted">
              Default branch: {report.repository.defaultBranch} · ⭐ {report.repository.stars}
            </p>
          </article>

          <div className="grid gap-6 md:grid-cols-2">
            <ReportCard title="Detected tech stack" items={report.techStack} />
            <ReportCard title="Important files and folders" items={report.importantFiles} />
            <ReportCard title="Safe files to edit" items={report.safeToEdit} />
            <ReportCard title="Risky/core files" items={report.riskyFiles} />
            <ReportCard title="Suggested learning order" items={report.learningOrder} />
            <section className="card animate-fadeIn">
              <h3 className="text-lg font-semibold">Beginner architecture explanation</h3>
              <p className="mt-3 text-sm text-calm-muted">{report.architectureExplanation}</p>
            </section>
          </div>
        </section>
      )}
    </main>
  );
}
