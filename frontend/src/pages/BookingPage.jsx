import React, { useEffect, useState } from 'react';
import { getCourts, getCoaches, getEquipment, getPricingRules, getBookings } from '../services/api';
import SlotGrid from '../components/SlotGrid';
import BookingModal from '../components/BookingModal';

export default function BookingPage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [courts, setCourts] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [rules, setRules] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [filterCourtId, setFilterCourtId] = useState('all');

  useEffect(() => {
    refreshAllData();
    const listener = () => refreshAllData();  // listen for AdminDashboard changes
    window.addEventListener('dataUpdated', listener);
    return () => window.removeEventListener('dataUpdated', listener);
  }, []);

  useEffect(() => { refreshBookings(); }, [date]);

  async function refreshAllData() {
    setLoading(true);
    try {
      const [c, ch, eq, r, b] = await Promise.all([
        getCourts(), getCoaches(), getEquipment(), getPricingRules(), getBookings()
      ]);
      setCourts(c); setCoaches(ch); setEquipment(eq); setRules(r); setBookings(b);
    } catch (err) {
      console.error('Failed to refresh data', err);
    } finally {
      setLoading(false);
    }
  }

  async function refreshBookings() {
    setLoading(true);
    try {
      const all = await getBookings();
      setBookings(all);
    } catch (err) {
      console.error('Failed to refresh bookings', err);
    } finally {
      setLoading(false);
    }
  }

  function openModalFor(slot) {
    setSelectedSlot(slot);
    setModalOpen(true);
  }

  const bookingsForDate = bookings.filter(b => {
    try { return new Date(b.startTime).toISOString().slice(0, 10) === date; }
    catch { return false; }
  });

  const filteredCourts = filterCourtId === 'all'
    ? courts
    : courts.filter(c => String(c.id) === String(filterCourtId));

  return (
    <div className="page">
      <section className="hero compact-hero">
        <div>
          <h1>Book a Court</h1>
          <p className="muted">Multi-resource booking (court + equipment + coach). Live pricing & atomic reservations.</p>
        </div>

        <div className="hero-actions">
          <div className="stat-card"><div className="stat-num">{courts.length}</div><div className="stat-label">Courts</div></div>
          <div className="stat-card"><div className="stat-num">{coaches.length}</div><div className="stat-label">Coaches</div></div>
          <div className="stat-card"><div className="stat-num">{equipment.reduce((s, e) => s + (e.totalStock || 0), 0)}</div><div className="stat-label">Equipment</div></div>

          <button className="btn btn-ghost" onClick={refreshAllData} title="Refresh all data">
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </section>

      <section className="controls compact-controls">
        <label className="control-item">
          <span className="label small muted">Choose date</span>
          <input className="input-sm" type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>

        <label className="control-item">
          <span className="label small muted">Filter court</span>
          <select className="input-sm" value={filterCourtId} onChange={e => setFilterCourtId(e.target.value)}>
            <option value="all">All courts</option>
            {courts.map(c => <option key={c.id} value={c.id}>{c.name} — {c.type}</option>)}
          </select>
        </label>

        <div className="legend"><span className="legend-dot free"></span> Free <span className="legend-dot booked"></span> Booked</div>
      </section>

      <section className="grid-wrap">
        <SlotGrid date={date} courts={filteredCourts} bookings={bookingsForDate} onSelectSlot={openModalFor} />
      </section>

      {modalOpen && selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          date={date}
          courts={courts}
          coaches={coaches}
          equipment={equipment}
          rules={rules}
          onClose={() => { setModalOpen(false); setSelectedSlot(null); }}
          onSuccess={async () => { await refreshBookings(); setModalOpen(false); setSelectedSlot(null); }}
        />
      )}
    </div>
  );
}
