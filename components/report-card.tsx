import { RepoReport } from '@/types/repo';

function Section({ title, description, items }: { title: string; description?: string; items: string[] }) {
  return (
    <section className="card p-5 animate-fadeIn">
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
      <ul className="mt-3 space-y-2 text-sm text-slate-800">
        {items.length > 0 ? items.map((item) => <li key={item}>• {item}</li>) : <li>Nothing detected yet.</li>}
      </ul>
    </section>
  );
}

export function ReportCard({ report }: { report: RepoReport }) {
  return (
    <div className="mt-10 grid gap-4 md:grid-cols-2">
      <section className="card p-5 md:col-span-2 animate-fadeIn">
        <h2 className="text-lg font-semibold">Repository Summary</h2>
        <p className="mt-1 text-sm text-slate-600">
          {report.overview.owner}/{report.overview.name} • ⭐ {report.overview.stars} • Default branch: {report.overview.defaultBranch}
        </p>
        <p className="mt-3 text-sm text-slate-700">{report.overview.description}</p>
      </section>

      <Section title="What to look at first" description="Start here if you are new to this repository." items={report.whatToLookAtFirst} />
      <Section title="Detected Tech Stack" description="Best guess from package.json and config files." items={report.detectedTechStack} />
      <Section title="Important Files" description="High-signal files for understanding project structure." items={report.importantFiles} />
      <Section title="Suggested Learning Order" description="A simple path to reduce overwhelm." items={report.learningOrder} />

      <section className="card p-5 animate-fadeIn">
        <h3 className="text-sm font-semibold text-emerald-700">Safe to edit</h3>
        <p className="mt-1 text-xs text-slate-500">Usually low risk for beginner contributions.</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-800">
          {report.safeToEdit.length > 0 ? report.safeToEdit.map((item) => <li key={item}>• {item}</li>) : <li>No obvious safe files detected.</li>}
        </ul>
      </section>

      <section className="card p-5 animate-fadeIn">
        <h3 className="text-sm font-semibold text-amber-700">Be careful</h3>
        <p className="mt-1 text-xs text-slate-500">These files can affect builds, routing, deploys, or app behavior broadly.</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-800">
          {report.beCarefulFiles.length > 0 ? report.beCarefulFiles.map((item) => <li key={item}>• {item}</li>) : <li>No high-risk files detected.</li>}
        </ul>
      </section>

      <section className="card p-5 md:col-span-2 animate-fadeIn">
        <h3 className="text-sm font-semibold text-slate-700">Beginner Architecture Explanation</h3>
        <p className="mt-3 text-sm text-slate-800">{report.beginnerArchitecture}</p>
      </section>
    </div>
  );
}
