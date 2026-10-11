import { useState } from 'react';
import Navbar from './components/Navbar.jsx';   // Navbar.jsx is the Sidebar
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="app-shell">
      <Navbar />
      <div className="main-content">
        <Dashboard
          openCreate={createOpen}
          onCreateOpen={() => setCreateOpen(true)}
          onCreateClose={() => setCreateOpen(false)}
        />
      </div>
    </div>
  );
}
