import React, { useEffect, useState } from 'react';
import api, { getBookings } from '../services/api';
import BookingsTable from '../components/BookingsTable';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const all = await getBookings();
      setBookings(all);
      setLoading(false);
    })();
  }, []);

  async function refresh() {
    setLoading(true);
    const all = await getBookings();
    setBookings(all);
    setLoading(false);
  }

  return (
    <div className="admin-page">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <h2>Bookings Overview</h2>
        <div>
          <button className="btn" onClick={refresh} disabled={loading}>{loading ? 'Loading...' : 'Refresh'}</button>
        </div>
      </div>

      <BookingsTable items={bookings} />
    </div>
  );
}
