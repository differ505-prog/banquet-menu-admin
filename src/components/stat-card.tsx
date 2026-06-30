type StatCardProps = {
  label: string;
  value: string;
  hint: string;
};

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <article className="rounded-[28px] border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-[0_24px_80px_rgba(4,12,20,0.24)] backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-[color:var(--accent)]/45">
      <p className="text-[11px] uppercase tracking-[0.3em] text-[color:var(--accent-soft)]">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--foreground)]">{value}</p>
      <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{hint}</p>
    </article>
  );
}
