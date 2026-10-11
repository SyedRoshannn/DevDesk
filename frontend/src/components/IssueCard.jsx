import { StatusBadge, PriorityBadge, TypeBadge } from './Badge.jsx';

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function IssueCard({ issue, onClick }) {
  return (
    <article
      className="issue-card"
      onClick={() => onClick(issue)}
      onKeyDown={(e) => e.key === 'Enter' && onClick(issue)}
      tabIndex={0}
      role="button"
      aria-label={`View issue: ${issue.title}`}
    >
      <div className="issue-card-header">
        <h3 className="issue-card-title">{issue.title}</h3>
        <StatusBadge status={issue.status} />
      </div>

      {issue.description && (
        <p className="issue-card-desc">
          {issue.description.length > 120
            ? issue.description.slice(0, 120) + '…'
            : issue.description}
        </p>
      )}

      <div className="issue-card-footer">
        <div className="issue-card-badges">
          <TypeBadge type={issue.type} />
          <PriorityBadge priority={issue.priority} />
        </div>
        <span className="issue-card-date">{fmt(issue.createdAt)}</span>
      </div>
    </article>
  );
}
