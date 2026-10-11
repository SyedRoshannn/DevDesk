// IssueCard — <button> for native keyboard accessibility (Enter + Space).
// No nested interactive elements. Type icon distinguishes issue type visually.

import { StatusBadge, PriorityBadge } from './Badge.jsx';

// Per-type icon color and SVG path — makes type scannable at a glance
const TYPE_CONFIG = {
  bug: {
    color: 'var(--type-bug)',
    icon: (
      // Bug — simplified insect silhouette
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
        aria-hidden="true" focusable="false">
        <path d="M7 4a3 3 0 0 1 3 3v2a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3Z"
          stroke="currentColor" strokeWidth="1.4" />
        <path d="M5.5 4.5 4 3M8.5 4.5 10 3
                 M3.5 7H2M12 7h-1.5
                 M3.5 9.5 2 11M10.5 9.5 12 11"
          stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  feature: {
    color: 'var(--type-feature)',
    icon: (
      // Feature — lightning bolt (spark of new capability)
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
        aria-hidden="true" focusable="false">
        <path d="M8 1.5 4.5 7.5H7L6 12.5l7-7.5H10L8 1.5Z"
          stroke="currentColor" strokeWidth="1.4"
          strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    ),
  },
  improvement: {
    color: 'var(--type-improvement)',
    icon: (
      // Improvement — upward trend arrow
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
        aria-hidden="true" focusable="false">
        <path d="M2 10.5l3.5-3.5 2.5 2 4-5"
          stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.5 4h2.5v2.5"
          stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  task: {
    color: 'var(--type-task)',
    icon: (
      // Task — checkbox with tick
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
        aria-hidden="true" focusable="false">
        <rect x="1.5" y="1.5" width="11" height="11" rx="2.5"
          stroke="currentColor" strokeWidth="1.4" />
        <path d="M4.5 7l2 2 3-3"
          stroke="currentColor" strokeWidth="1.4"
          strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
};

const DEFAULT_TYPE = {
  color: 'var(--text-muted)',
  icon: (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
      aria-hidden="true" focusable="false">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
};

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function IssueCard({ issue, onClick }) {
  const typeConf = TYPE_CONFIG[issue.type] || DEFAULT_TYPE;

  const desc = issue.description
    ? issue.description.length > 90
      ? issue.description.slice(0, 90) + '…'
      : issue.description
    : null;

  return (
    <button
      type="button"
      className="issue-row"
      onClick={() => onClick(issue)}
      aria-label={`View issue: ${issue.title}`}
    >
      {/* Type icon — color-coded, aria-hidden */}
      <span
        className="issue-row-type-icon"
        aria-hidden="true"
        style={{ '--icon-color': typeConf.color }}
      >
        {typeConf.icon}
      </span>

      {/* Title + optional description */}
      <span className="issue-row-body">
        <span className="issue-row-title">{issue.title}</span>
        {desc && <span className="issue-row-desc">{desc}</span>}
      </span>

      {/* Status · Priority · Date */}
      <span className="issue-row-meta">
        <StatusBadge   status={issue.status} />
        <PriorityBadge priority={issue.priority} />
        <span className="issue-row-date">{fmt(issue.createdAt)}</span>
      </span>
    </button>
  );
}
