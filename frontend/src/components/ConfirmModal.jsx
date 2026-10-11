export default function ConfirmModal({ message, onConfirm, onCancel, loading }) {
  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Confirm deletion"
    >
      <div className="modal-box" style={{ maxWidth: 400 }}>
        {/* Warning icon */}
        <div className="confirm-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2L2 17h16L10 2Z"
              stroke="currentColor" strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M10 8v4M10 14.5v.5"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
            />
          </svg>
        </div>

        <p className="confirm-title">Delete issue?</p>
        <p className="confirm-message">{message} This action cannot be undone.</p>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
