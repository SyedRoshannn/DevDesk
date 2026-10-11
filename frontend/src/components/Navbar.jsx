export default function Navbar({ onCreateClick }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          {/* Simple SVG bug icon inline — no external dependency */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            aria-hidden="true" style={{ flexShrink: 0 }}>
            <rect width="24" height="24" rx="6" fill="#6d28d9" />
            <path d="M12 7a4 4 0 0 1 4 4v3a4 4 0 0 1-8 0v-3a4 4 0 0 1 4-4Z"
              fill="#fff" />
            <path d="M9 7.5 7 6M15 7.5l2-1.5M8 11H6M18 11h-2M8 15l-2 1.5M16 15l2 1.5"
              stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="navbar-title">DevDesk</span>
        </div>
        <button className="btn btn-primary" onClick={onCreateClick}>
          + New Issue
        </button>
      </div>
    </header>
  );
}
