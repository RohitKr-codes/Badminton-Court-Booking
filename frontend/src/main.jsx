import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/main.css';
import App from './App';
import BookingPage from './pages/BookingPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminBookings from './pages/AdminBookings';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<BookingPage />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/bookings" element={<AdminBookings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
