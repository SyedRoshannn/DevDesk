import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <Navbar onCreateClick={() => setCreateOpen(true)} />
      <Dashboard
        openCreate={createOpen}
        onCreateClose={() => setCreateOpen(false)}
      />
    </>
  );
}
