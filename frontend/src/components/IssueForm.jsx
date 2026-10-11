import { useState } from 'react';
import { createIssue, updateIssue } from '../services/issueService.js';

const EMPTY = {
  title: '',
  description: '',
  type: 'task',
  priority: 'medium',
  status: 'open',
};

function buildInitial(issue) {
  if (!issue) return { ...EMPTY };
  return {
    title:       issue.title       ?? '',
    description: issue.description ?? '',
    type:        issue.type        ?? 'task',
    priority:    issue.priority    ?? 'medium',
    status:      issue.status      ?? 'open',
  };
}

export default function IssueForm({ issue, onSuccess, onClose }) {
  const isEdit = Boolean(issue);
  // Keyed on issue._id in Dashboard so this remounts cleanly per-issue
  const [form, setForm] = useState(() => buildInitial(issue));
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  function validate() {
    const e = {};
    if (!form.title.trim())
      e.title = 'Title is required.';
    else if (form.title.trim().length < 3)
      e.title = 'Title must be at least 3 characters.';
    else if (form.title.trim().length > 100)
      e.title = 'Title cannot exceed 100 characters.';
    if (form.description && form.description.length > 1000)
      e.description = 'Description cannot exceed 1000 characters.';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');
    try {
      const payload = {
        title:       form.title.trim(),
        description: form.description,
        type:        form.type,
        priority:    form.priority,
        status:      form.status,
      };
      if (isEdit) {
        await updateIssue(issue._id, payload);
      } else {
        await createIssue(payload);
      }
      onSuccess();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? 'Edit issue' : 'Create new issue'}
    >
      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-header-title">
            {isEdit ? 'Edit Issue' : 'New Issue'}
          </h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close form"
          >
            ×
          </button>
        </div>

        {apiError && (
          <div className="alert alert-error" role="alert">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
              aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 4v3.5M7 9.5v.5"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="f-title">
              Title
              <span className="form-label-required" aria-hidden="true">*</span>
            </label>
            <input
              id="f-title"
              type="text"
              className={`form-control${errors.title ? ' is-invalid' : ''}`}
              value={form.title}
              onChange={handle('title')}
              maxLength={100}
              placeholder="Brief summary of the issue"
              aria-required="true"
              aria-describedby={errors.title ? 'f-title-err' : undefined}
            />
            {errors.title && (
              <span id="f-title-err" className="field-error" role="alert">
                {errors.title}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="f-desc">Description</label>
            <textarea
              id="f-desc"
              className={`form-control${errors.description ? ' is-invalid' : ''}`}
              value={form.description}
              onChange={handle('description')}
              rows={4}
              maxLength={1000}
              placeholder="Optional — add more context about this issue"
              aria-describedby={errors.description ? 'f-desc-err' : 'f-desc-count'}
            />
            <span id="f-desc-count" className="char-count">
              {form.description.length} / 1000
            </span>
            {errors.description && (
              <span id="f-desc-err" className="field-error" role="alert">
                {errors.description}
              </span>
            )}
          </div>

          {/* Type / Priority / Status (edit only) */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="f-type">Type</label>
              <select
                id="f-type"
                className="form-control"
                value={form.type}
                onChange={handle('type')}
              >
                <option value="task">Task</option>
                <option value="bug">Bug</option>
                <option value="feature">Feature</option>
                <option value="improvement">Improvement</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="f-priority">Priority</label>
              <select
                id="f-priority"
                className="form-control"
                value={form.priority}
                onChange={handle('priority')}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {isEdit && (
              <div className="form-group">
                <label className="form-label" htmlFor="f-status">Status</label>
                <select
                  id="f-status"
                  className="form-control"
                  value={form.status}
                  onChange={handle('status')}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading
                ? (isEdit ? 'Saving…' : 'Creating…')
                : (isEdit ? 'Save Changes' : 'Create Issue')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
