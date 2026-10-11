export default function StatCard({ label, value, accent }) {
  return (
    <div className="stat-card" style={accent ? { borderTopColor: accent } : {}}>
      <span className="stat-value" style={accent ? { color: accent } : {}}>{value ?? '—'}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
