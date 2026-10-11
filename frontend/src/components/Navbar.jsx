// Sidebar — persistent left navigation on desktop, sticky top bar on mobile.
// New Issue action lives in the page header; the sidebar only handles navigation.

export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="DevDesk navigation">
      {/* Logo */}
      <div className="sidebar-logo" aria-label="DevDesk">
        <svg className="sidebar-logo-mark" viewBox="0 0 28 28" fill="none"
          aria-hidden="true" focusable="false">
          <rect width="28" height="28" rx="7" fill="#5b4ef8" />
          <path d="M14 8a4 4 0 0 1 4 4v3.5a4 4 0 0 1-8 0V12a4 4 0 0 1 4-4Z"
            fill="#fff" />
          <path
            d="M11 8.5 9 7M17 8.5l2-1.5
               M9.5 12.5H7.5M20.5 12.5H18.5
               M9.5 16l-2 1.5M18.5 16l2 1.5"
            stroke="#fff" strokeWidth="1.5" strokeLinecap="round"
          />
        </svg>
        <span className="sidebar-logo-name">DevDesk</span>
      </div>

      {/* Nav items */}
      <nav className="sidebar-nav" aria-label="Main navigation">
        <div className="sidebar-nav-item sidebar-nav-item--active" aria-current="page">
          <svg className="sidebar-nav-icon" viewBox="0 0 16 16" fill="none"
            aria-hidden="true" focusable="false">
            <rect x="1" y="1" width="14" height="14" rx="3"
              stroke="currentColor" strokeWidth="1.5" />
            <path d="M4 5h8M4 8h6M4 11h4"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Issues
        </div>
      </nav>

      {/* Footer — version label only */}
      <div className="sidebar-footer">
        <span className="sidebar-workspace-label">DevDesk · v1.0</span>
      </div>
    </aside>
  );
}
