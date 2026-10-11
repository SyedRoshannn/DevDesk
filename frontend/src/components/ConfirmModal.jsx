export default function ConfirmModal({ message, onConfirm, onCancel, loading }) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Confirm action">
      <div className="modal-box" style={{ maxWidth: 400 }}>
        <h2 style={{ marginBottom: 12, fontSize: 18 }}>Are you sure?</h2>
        <p style={{ marginBottom: 24, color: 'var(--text-muted)' }}>{message}</p>
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
