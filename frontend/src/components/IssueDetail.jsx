import { StatusBadge, PriorityBadge, TypeBadge } from './Badge.jsx';

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function IssueDetail({ issue, onEdit, onDelete, onClose }) {
  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Issue detail"
    >
      <div className="modal-box modal-box--wide">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-header-title">{issue.title}</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close detail"
          >
            ×
          </button>
        </div>

        {/* Badges */}
        <div className="detail-badges">
          <StatusBadge   status={issue.status} />
          <PriorityBadge priority={issue.priority} />
          <TypeBadge     type={issue.type} />
        </div>

        {/* Description */}
        <div
          className={`detail-body${!issue.description ? ' detail-body--empty' : ''}`}
          aria-label="Issue description"
        >
          {issue.description || 'No description provided.'}
        </div>

        {/* Meta */}
        <div className="detail-meta">
          <span>Created {fmt(issue.createdAt)}</span>
          {issue.updatedAt !== issue.createdAt && (
            <span>Updated {fmt(issue.updatedAt)}</span>
          )}
        </div>

        {/* Actions — Edit (primary) on right, Delete (destructive) on left */}
        <div className="detail-actions">
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onDelete(issue)}
          >
            Delete
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onEdit(issue)}
          >
            Edit Issue
          </button>
        </div>
      </div>
    </div>
  );
}
