// Dashboard — main page view.
// All data-fetching logic, filtering, and action handlers are preserved exactly.
// Only the JSX structure and class names changed for the redesign.

import { useReducer, useState, useEffect } from 'react';
import { getIssues, getStats, deleteIssue } from '../services/issueService.js';
import IssueCard   from '../components/IssueCard.jsx';
import FilterBar   from '../components/FilterBar.jsx';
import IssueForm   from '../components/IssueForm.jsx';
import IssueDetail from '../components/IssueDetail.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';

const EMPTY_FILTERS = { search: '', status: '', priority: '', type: '' };

// ── Fetch reducer ────────────────────────────────────────────────
// Keeps all setState inside dispatch — satisfies react-hooks/set-state-in-effect.
function fetchReducer(state, action) {
  switch (action.type) {
    case 'loading': return { data: state.data, loading: true,  error: '' };
    case 'success': return { data: action.payload, loading: false, error: '' };
    case 'error':   return { data: state.data,   loading: false, error: action.payload };
    default:        return state;
  }
}
const FETCH_INIT = { data: null, loading: true, error: '' };

// ── Stats strip configuration ─────────────────────────────────────
// stat-accent maps to a CSS custom property used for the left accent bar.
const STAT_ITEMS = [
  { key: 'total',       label: 'Total',       accent: '#5b4ef8' },
  { key: 'open',        label: 'Open',        accent: '#3b82f6' },
  { key: 'in_progress', label: 'In Progress', accent: '#f59e0b' },
  { key: 'resolved',    label: 'Resolved',    accent: '#22c55e' },
  { key: 'closed',      label: 'Closed',      accent: '#94a3b8' },
];

export default function Dashboard({ openCreate, onCreateClose, onCreateOpen }) {
  // ── Data fetching ──────────────────────────────────────────────
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = () => setRefreshKey((k) => k + 1);

  const [issuesState, issuesDispatch] = useReducer(fetchReducer, { ...FETCH_INIT });
  const [statsState,  statsDispatch]  = useReducer(fetchReducer, { ...FETCH_INIT });

  useEffect(() => {
    issuesDispatch({ type: 'loading' });
    getIssues()
      .then((res) => issuesDispatch({ type: 'success', payload: res.data }))
      .catch((e)  => issuesDispatch({ type: 'error',   payload: e.message }));

    statsDispatch({ type: 'loading' });
    getStats()
      .then((res) => statsDispatch({ type: 'success', payload: res.data }))
      .catch((e)  => statsDispatch({ type: 'error',   payload: e.message }));
  }, [refreshKey]);

  const issueList = issuesState.data ?? [];
  const stats     = statsState.data;

  // ── Local UI state ─────────────────────────────────────────────
  const [filters,      setFilters]      = useState({ ...EMPTY_FILTERS });
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [editIssue,    setEditIssue]    = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);
  const [toast,        setToast]        = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // ── Client-side filtering ──────────────────────────────────────
  const filtered = issueList.filter((issue) => {
    if (filters.search &&
        !issue.title.toLowerCase().includes(filters.search.toLowerCase()))
      return false;
    if (filters.status   && issue.status   !== filters.status)   return false;
    if (filters.priority && issue.priority !== filters.priority) return false;
    if (filters.type     && issue.type     !== filters.type)     return false;
    return true;
  });

  // ── Handlers ───────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteIssue(deleteTarget._id);
      setDeleteTarget(null);
      setSelectedIssue(null);
      showToast('Issue deleted.');
      refresh();
    } catch (e) {
      showToast(`Delete failed: ${e.message}`);
    } finally {
      setDeleting(false);
    }
  }

  function handleFormSuccess(verb) {
    onCreateClose();
    setEditIssue(null);
    showToast(`Issue ${verb} successfully.`);
    refresh();
  }

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="page">

      {/* ── Page header ─────────────────────────────────────── */}
      <header className="page-header">
        <div className="page-header-left">
          <span className="page-eyebrow">Workspace</span>
          <h1 className="page-title">Issues</h1>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onCreateOpen}
          aria-label="Create new issue"
        >
          {/* Plus icon */}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
            aria-hidden="true" focusable="false">
            <path d="M6 1v10M1 6h10"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          New Issue
        </button>
      </header>

      {/* ── Stats strip ─────────────────────────────────────── */}
      {statsState.error && (
        <div className="alert alert-error" role="alert">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
            aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 4v3.5M7 9.5v.5"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Could not load stats: {statsState.error}
        </div>
      )}

      <section aria-label="Issue statistics">
        <div className="stats-strip">
          {STAT_ITEMS.map(({ key, label, accent }) => (
            <div
              key={key}
              className="stats-strip-item"
              style={{ '--stat-accent': accent }}
            >
              <span
                className="stats-strip-value"
                aria-label={`${label}: ${statsState.loading ? 'loading' : (stats?.[key] ?? 0)}`}
              >
                {statsState.loading ? '—' : (stats?.[key] ?? 0)}
              </span>
              <span className="stats-strip-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Issue list ──────────────────────────────────────── */}
      <section aria-label="Issue list">

        {/* Toolbar: left = label + count, right = filter controls */}
        <div className="issues-toolbar">
          <div className="issues-toolbar-left">
            <span className="issues-toolbar-title">All Issues</span>
            {!issuesState.loading && (
              <span
                className="issues-count-badge"
                aria-label={`${filtered.length} issues shown`}
              >
                {filtered.length}
              </span>
            )}
          </div>
          <FilterBar
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters({ ...EMPTY_FILTERS })}
          />
        </div>

        {/* Loading */}
        {issuesState.loading && (
          <div className="state-message" aria-live="polite">Loading issues…</div>
        )}

        {/* Error */}
        {issuesState.error && (
          <div className="alert alert-error" role="alert">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
              aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 4v3.5M7 9.5v.5"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Could not load issues: {issuesState.error}
          </div>
        )}

        {/* Empty state */}
        {!issuesState.loading && !issuesState.error && filtered.length === 0 && (
          <div className="empty-state">
            <svg
              className="empty-state-icon"
              width="40" height="40" viewBox="0 0 24 24"
              fill="none" aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="4"
                stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 8h8M8 12h6M8 16h4"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {issueList.length === 0 ? (
              <>
                <p className="empty-state-title">No issues yet</p>
                <p className="empty-state-sub">
                  Use &ldquo;New Issue&rdquo; above to create your first one.
                </p>
              </>
            ) : (
              <>
                <p className="empty-state-title">No matching issues</p>
                <p className="empty-state-sub">Try adjusting your search or filters.</p>
                <button
                  type="button"
                  className="btn btn-ghost"
                  style={{ marginTop: 4 }}
                  onClick={() => setFilters({ ...EMPTY_FILTERS })}
                >
                  Clear filters
                </button>
              </>
            )}
          </div>
        )}

        {/* Issue rows */}
        {!issuesState.loading && !issuesState.error && filtered.length > 0 && (
          <div className="issue-list" role="list" aria-label="Issues">
            {filtered.map((issue) => (
              <IssueCard
                key={issue._id}
                issue={issue}
                onClick={setSelectedIssue}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Modals ──────────────────────────────────────────── */}
      {(openCreate || editIssue) && (
        <IssueForm
          key={editIssue?._id ?? 'new'}
          issue={editIssue}
          onSuccess={() => handleFormSuccess(editIssue ? 'updated' : 'created')}
          onClose={() => { onCreateClose(); setEditIssue(null); }}
        />
      )}

      {selectedIssue && !editIssue && (
        <IssueDetail
          issue={selectedIssue}
          onEdit={(iss) => { setSelectedIssue(null); setEditIssue(iss); }}
          onDelete={setDeleteTarget}
          onClose={() => setSelectedIssue(null)}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          message={`"${deleteTarget.title}" will be permanently deleted.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}

      {/* ── Toast ───────────────────────────────────────────── */}
      {toast && (
        <div className="toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </div>
  );
}
