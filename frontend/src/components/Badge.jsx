// Colored pill for status and priority values.

const STATUS_STYLES = {
  open:        { bg: '#dbeafe', color: '#1d4ed8', label: 'Open' },
  in_progress: { bg: '#fef9c3', color: '#a16207', label: 'In Progress' },
  resolved:    { bg: '#dcfce7', color: '#15803d', label: 'Resolved' },
  closed:      { bg: '#f3f4f6', color: '#374151', label: 'Closed' },
};

const PRIORITY_STYLES = {
  low:      { bg: '#f0fdf4', color: '#16a34a', label: 'Low' },
  medium:   { bg: '#fff7ed', color: '#c2410c', label: 'Medium' },
  high:     { bg: '#fef2f2', color: '#b91c1c', label: 'High' },
  critical: { bg: '#4c0519', color: '#fecdd3', label: 'Critical' },
};

const TYPE_STYLES = {
  bug:         { bg: '#fef2f2', color: '#b91c1c', label: 'Bug' },
  feature:     { bg: '#eff6ff', color: '#1d4ed8', label: 'Feature' },
  improvement: { bg: '#f5f3ff', color: '#6d28d9', label: 'Improvement' },
  task:        { bg: '#f0fdf4', color: '#15803d', label: 'Task' },
};

export function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || { bg: '#f3f4f6', color: '#374151', label: status };
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: '2px 10px', borderRadius: 12,
      fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const s = PRIORITY_STYLES[priority] || { bg: '#f3f4f6', color: '#374151', label: priority };
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: '2px 10px', borderRadius: 12,
      fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  );
}

export function TypeBadge({ type }) {
  const s = TYPE_STYLES[type] || { bg: '#f3f4f6', color: '#374151', label: type };
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: '2px 10px', borderRadius: 12,
      fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  );
}
