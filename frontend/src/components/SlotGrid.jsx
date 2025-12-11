import React from 'react';

/**
 * Props:
 * - date (yyyy-mm-dd)
 * - courts []
 * - bookings []
 * - onSelectSlot({courtId, hour})
 *
 * This grid shows each court as a column and time slots as rows (hours).
 */
export default function SlotGrid({ date, courts = [], bookings = [], onSelectSlot = () => {} }) {
  const hours = Array.from({ length: 16 }, (_, i) => i + 7); // 7..22

  // helper: is booked?
  function isBooked(courtId, slotStartIso) {
    return bookings.some(b => {
      if (!b.courtId) return false;
      if (Number(b.courtId) !== Number(courtId)) return false;
      const start = new Date(b.startTime).toISOString().slice(0, 16);
      return start === slotStartIso.slice(0, 16);
    });
  }

  return (
    <div className="slotgrid">
      <div className="slotgrid-header">
        <div className="time-col">Time</div>
        {courts.map(c => <div key={c.id} className="court-col">{c.name} <span className="court-type">({c.type})</span></div>)}
      </div>

      <div className="slotgrid-body">
        {hours.map(hour => {
          const slotStart = new Date(`${date}T${String(hour).padStart(2,'0')}:00:00.000Z`);
          return (
            <div key={hour} className="slot-row">
              <div className="time-col">{formatHour(hour)}</div>
              {courts.map(c => {
                const occupied = isBooked(c.id, slotStart.toISOString());
                return (
                  <div key={c.id} className={`slot-cell ${occupied ? 'occupied' : 'free'}`}
                    onClick={() => !occupied && onSelectSlot({ courtId: c.id, courtName: c.name, hour, courtType:c.type }) }>
                    {occupied ? 'Booked' : 'Book'}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatHour(h) {
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:00 ${ampm}`;
}
