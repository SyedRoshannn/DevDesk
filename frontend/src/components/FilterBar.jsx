export default function FilterBar({ filters, onChange, onReset }) {
  const handle = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  const hasActive = filters.search || filters.status || filters.priority || filters.type;

  return (
    <div className="filter-bar">
      <input
        type="search"
        className="filter-input filter-search"
        placeholder="Search by title…"
        value={filters.search}
        onChange={handle('search')}
        aria-label="Search issues by title"
      />

      <select className="filter-input" value={filters.status} onChange={handle('status')}
        aria-label="Filter by status">
        <option value="">All statuses</option>
        <option value="open">Open</option>
        <option value="in_progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>

      <select className="filter-input" value={filters.priority} onChange={handle('priority')}
        aria-label="Filter by priority">
        <option value="">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>

      <select className="filter-input" value={filters.type} onChange={handle('type')}
        aria-label="Filter by type">
        <option value="">All types</option>
        <option value="bug">Bug</option>
        <option value="feature">Feature</option>
        <option value="improvement">Improvement</option>
        <option value="task">Task</option>
      </select>

      {hasActive && (
        <button className="btn btn-ghost" onClick={onReset} aria-label="Clear all filters">
          Clear
        </button>
      )}
    </div>
  );
}
