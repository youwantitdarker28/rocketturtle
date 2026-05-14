interface ReportCardProps {
  title: string;
  items: string[];
}

export function ReportCard({ title, items }: ReportCardProps) {
  return (
    <section className="card animate-fadeIn">
      <h3 className="text-lg font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-calm-muted">
        {items.map((item) => (
          <li key={item} className="rounded-lg bg-slate-50 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
