'use client';

import { FormEvent, useState } from 'react';

type UrlFormProps = {
  onAnalyze: (url: string) => Promise<void>;
  loading: boolean;
};

export function UrlForm({ onAnalyze, loading }: UrlFormProps) {
  const [url, setUrl] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const trimmed = url.trim();
    if (!trimmed) return setLocalError('Please paste a repository URL.');
    if (!/^https?:\/\//i.test(trimmed)) return setLocalError('URL must start with http:// or https://.');
    if (!/^https?:\/\/github\.com\//i.test(trimmed)) return setLocalError('Please use a github.com repository URL.');

    setLocalError(null);
    await onAnalyze(trimmed);
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-3xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="url"
          placeholder="https://github.com/owner/repository"
          className="h-12 flex-1 rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none ring-sky-200 transition focus:ring"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="h-12 rounded-xl bg-ink px-5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Analyzing…' : 'Analyze Repository'}
        </button>
      </form>
      {localError && <p className="mt-2 text-sm text-rose-700">{localError}</p>}
    </div>
  );
}
