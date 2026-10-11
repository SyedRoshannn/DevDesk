// Badge — dot + label style using CSS classes defined in index.css
// No inline styles; all color variants live in the design system.

export function StatusBadge({ status }) {
  const labels = {
    open:        'Open',
    in_progress: 'In Progress',
    resolved:    'Resolved',
    closed:      'Closed',
  };
  const label = labels[status] || status;
  return (
    <span className={`badge badge-status-${status}`}>
      <span className="badge-dot" aria-hidden="true" />
      {label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const labels = {
    low:      'Low',
    medium:   'Medium',
    high:     'High',
    critical: 'Critical',
  };
  const label = labels[priority] || priority;
  return (
    <span className={`badge badge-priority-${priority}`}>
      {label}
    </span>
  );
}

export function TypeBadge({ type }) {
  const labels = {
    bug:         'Bug',
    feature:     'Feature',
    improvement: 'Improvement',
    task:        'Task',
  };
  const label = labels[type] || type;
  return (
    <span className={`badge badge-type-${type}`}>
      {label}
    </span>
  );
}
