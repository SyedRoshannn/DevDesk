import { StatusBadge, PriorityBadge, TypeBadge } from './Badge.jsx';

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function IssueDetail({ issue, onEdit, onDelete, onClose }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Issue detail">
      <div className="modal-box modal-box--wide">
        <div className="modal-header">
          <h2 style={{ fontSize: 18, lineHeight: 1.4 }}>{issue.title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close detail">×</button>
        </div>

        <div className="detail-badges">
          <StatusBadge status={issue.status} />
          <PriorityBadge priority={issue.priority} />
          <TypeBadge type={issue.type} />
        </div>

        {issue.description ? (
          <p className="detail-description">{issue.description}</p>
        ) : (
          <p className="detail-description" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No description provided.
          </p>
        )}

        <div className="detail-meta">
          <span>Created: {fmt(issue.createdAt)}</span>
          {issue.updatedAt !== issue.createdAt && (
            <span>Updated: {fmt(issue.updatedAt)}</span>
          )}
        </div>

        <div className="form-actions" style={{ marginTop: 24 }}>
          <button className="btn btn-danger" onClick={() => onDelete(issue)}>
            Delete
          </button>
          <button className="btn btn-secondary" onClick={() => onEdit(issue)}>
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
