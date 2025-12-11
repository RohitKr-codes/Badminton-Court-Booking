import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export default function App() {
  const loc = useLocation();
  return (
    <div className="app-root">
      <nav className="topbar">
        <div className="brand">Badminton Court Booking</div>
        <div className="navlinks">
          <Link to="/" className={loc.pathname === '/' ? 'active' : ''}>Book Court</Link>
          <Link to="/admin" className={loc.pathname.startsWith('/admin') ? 'active' : ''}>Admin</Link>
        </div>
      </nav>

      <main className="container">
        <Outlet />
      </main>

      <footer className="footer">
        Built By Rohit — Interactive, responsive, and SQLite-ready backend with frontend.
      </footer>
    </div>
  );
}
