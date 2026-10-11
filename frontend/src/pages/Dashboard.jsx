import { useReducer, useState, useEffect } from 'react';
import { getIssues, getStats, deleteIssue } from '../services/issueService.js';
import StatCard from '../components/StatCard.jsx';
import IssueCard from '../components/IssueCard.jsx';
import FilterBar from '../components/FilterBar.jsx';
import IssueForm from '../components/IssueForm.jsx';
import IssueDetail from '../components/IssueDetail.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';

const EMPTY_FILTERS = { search: '', status: '', priority: '', type: '' };

// ── Tiny fetch reducer ──────────────────────────────────────────
// All setState happens inside dispatch calls, which React Compiler
// rules treat as external-system updates rather than synchronous
// state derivation.
function fetchReducer(state, action) {
  switch (action.type) {
    case 'loading': return { data: state.data, loading: true, error: '' };
    case 'success': return { data: action.payload, loading: false, error: '' };
    case 'error':   return { data: state.data,   loading: false, error: action.payload };
    default:        return state;
  }
}
const FETCH_INIT = { data: null, loading: true, error: '' };

export default function Dashboard({ openCreate, onCreateClose }) {
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

  const [filters, setFilters] = useState({ ...EMPTY_FILTERS });
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [editIssue, setEditIssue] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Client-side filtering — operates on real fetched data
  const filtered = issueList.filter((issue) => {
    if (filters.search && !issue.title.toLowerCase().includes(filters.search.toLowerCase()))
      return false;
    if (filters.status && issue.status !== filters.status) return false;
    if (filters.priority && issue.priority !== filters.priority) return false;
    if (filters.type && issue.type !== filters.type) return false;
    return true;
  });

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

  return (
    <main className="dashboard">
      {/* ── Stats ─────────────────────────────────────────── */}
      <section className="stats-section" aria-label="Issue statistics">
        <h2 className="section-title">Overview</h2>
        {statsState.error && (
          <p className="inline-error">Could not load stats: {statsState.error}</p>
        )}
        <div className="stats-grid">
          <StatCard label="Total Issues" value={statsState.loading ? '…' : stats?.total} accent="#6d28d9" />
          <StatCard label="Open"         value={statsState.loading ? '…' : stats?.open}  accent="#1d4ed8" />
          <StatCard label="In Progress"  value={statsState.loading ? '…' : stats?.in_progress} accent="#a16207" />
          <StatCard label="Resolved"     value={statsState.loading ? '…' : stats?.resolved}    accent="#15803d" />
          <StatCard label="Closed"       value={statsState.loading ? '…' : stats?.closed}      accent="#374151" />
        </div>
      </section>

      {/* ── Issue list ─────────────────────────────────────── */}
      <section className="issues-section" aria-label="Issue list">
        <div className="section-header">
          <h2 className="section-title">Issues</h2>
          {!issuesState.loading && (
            <span className="issue-count">{filtered.length} shown</span>
          )}
        </div>

        <FilterBar filters={filters} onChange={setFilters}
          onReset={() => setFilters({ ...EMPTY_FILTERS })} />

        {issuesState.loading && (
          <div className="state-message">Loading issues…</div>
        )}

        {issuesState.error && (
          <div className="alert alert-error">Could not load issues: {issuesState.error}</div>
        )}

        {!issuesState.loading && !issuesState.error && filtered.length === 0 && (
          <div className="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="#d1d5db" strokeWidth="1.5" />
              <path d="M9 9h.01M15 9h.01M9 15s1 1.5 3 1.5 3-1.5 3-1.5" stroke="#d1d5db"
                strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p>
              {issueList.length === 0
                ? 'No issues yet. Create your first one!'
                : 'No issues match your filters.'}
            </p>
            {issueList.length > 0 && (
              <button className="btn btn-ghost"
                onClick={() => setFilters({ ...EMPTY_FILTERS })}>
                Clear filters
              </button>
            )}
          </div>
        )}

        {!issuesState.loading && !issuesState.error && filtered.length > 0 && (
          <div className="issue-list">
            {filtered.map((issue) => (
              <IssueCard key={issue._id} issue={issue} onClick={setSelectedIssue} />
            ))}
          </div>
        )}
      </section>

      {/* ── Modals ─────────────────────────────────────────── */}
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

      {/* ── Toast ──────────────────────────────────────────── */}
      {toast && (
        <div className="toast" role="status" aria-live="polite">{toast}</div>
      )}
    </main>
  );
}
