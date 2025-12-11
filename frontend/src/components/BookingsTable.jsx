import React from 'react';

/**
 * Props:
 *  - items: array of booking objects (from backend)
 */
export default function BookingsTable({ items = [] }) {
  if (!items.length) return <div className="card"><em>No bookings yet.</em></div>;

  return (
    <div className="card">
      <h3>Bookings</h3>
      <div className="table-wrap">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Court</th>
              <th>Coach</th>
              <th>Rackets</th>
              <th>Shoes</th>
              <th>Start</th>
              <th>End</th>
              <th>Total (₹)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b, i) => (
              <tr key={b.id}>
                <td>{i + 1}</td>
                <td>{b.userName}</td>
                <td>{b.Court ? b.Court.name : b.courtId}</td>
                <td>{b.Coach ? b.Coach.name : (b.coachId ? b.coachId : '—')}</td>
                <td>{b.rackets}</td>
                <td>{b.shoes}</td>
                <td>{new Date(b.startTime).toLocaleString()}</td>
                <td>{new Date(b.endTime).toLocaleString()}</td>
                <td>{b.pricingBreakdown ? (b.pricingBreakdown.total ?? '—') : '—'}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
