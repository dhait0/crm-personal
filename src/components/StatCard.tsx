type StatCardProps = {
  label: string;
  value: number;
  hint: string;
};

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <section className="stat-card">
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      <span className="stat-hint">{hint}</span>
    </section>
  );
}
