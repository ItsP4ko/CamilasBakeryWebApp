import React from 'react';
import { Outlet, Link } from 'react-router-dom';


const App: React.FC = () => {
  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', padding: 20, border: '1px solid #ccc', borderRadius: 8, fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#b45f06' }}>Pastelería</h1>
      <nav style={{ textAlign: 'center', marginBottom: 20 }}>
        <Link to="/" style={{ margin: '0 1rem' }}>Dashboard</Link>
      </nav>
      <Outlet />
    </div>
  );
};

export default App;
