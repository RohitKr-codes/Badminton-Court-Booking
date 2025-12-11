import React, { useEffect, useMemo, useState } from 'react';
import { createBooking } from '../services/api';
import PriceBreakdown from './PriceBreakdown';

/**
 * Compact, professional BookingModal
 *
 * Props:
 * - slot {courtId, hour, courtName, courtType}
 * - date (yyyy-mm-dd)
 * - courts, coaches, equipment, rules
 * - onClose()
 * - onSuccess()
 */
export default function BookingModal({ slot, date, courts = [], coaches = [], equipment = [], rules = [], onClose, onSuccess }) {
  const [userName, setUserName] = useState('Guest');
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [rackets, setRackets] = useState(0);
  const [shoes, setShoes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [estimate, setEstimate] = useState(null);

  const court = useMemo(
    () => courts.find(c => Number(c.id) === Number(slot.courtId)) || { basePrice: 10, type: slot.courtType },
    [courts, slot]
  );

  const startTime = useMemo(() => new Date(`${date}T${String(slot.hour).padStart(2,'0')}:00:00.000Z`).toISOString(), [date, slot]);
  const endTime = useMemo(() => new Date(`${date}T${String(slot.hour + 1).padStart(2,'0')}:00:00.000Z`).toISOString(), [date, slot]);

  useEffect(() => { computeEstimate(); /* eslint-disable-next-line */ }, [rackets, shoes, selectedCoach, court, rules, startTime]);

  function computeEstimate() {
    const bookingHour = new Date(startTime).getHours();
    const day = new Date(startTime).getDay();
    let current = Number(court.basePrice || 0);
    const details = [];

    (rules || []).forEach(r => {
      if (!r.enabled) return;
      if (r.type === 'peak' && r.startHour != null && r.endHour != null) {
        if (bookingHour >= r.startHour && bookingHour < r.endHour) {
          if (r.multiplier) { const before = current; current = current * r.multiplier; details.push({ name: r.name, type: 'multiplier', multiplier: r.multiplier, before, after: current }); }
          if (r.surcharge) { current += r.surcharge; details.push({ name: r.name, type: 'surcharge', surcharge: r.surcharge }); }
        }
      } else if (r.type === 'weekend') {
        if (day === 0 || day === 6) {
          if (r.surcharge) { current += r.surcharge; details.push({ name:r.name, type:'surcharge', surcharge:r.surcharge }); }
          if (r.multiplier) { const before = current; current = current * r.multiplier; details.push({ name:r.name, type:'multiplier', before, after: current }); }
        }
      } else if (r.type === 'courtType' && r.courtType && court.type === r.courtType) {
        if (r.surcharge) { current += r.surcharge; details.push({ name:r.name, type:'surcharge', surcharge:r.surcharge }); }
        if (r.multiplier) { const before = current; current = current * r.multiplier; details.push({ name:r.name, type:'multiplier', before, after: current }); }
      } else if (r.type === 'fixed') {
        if (r.surcharge) { current += r.surcharge; details.push({ name:r.name, type:'surcharge', surcharge:r.surcharge }); }
      }
    });

    const racketItem = (equipment || []).find(e => e.name.toLowerCase().includes('racket'));
    const shoeItem = (equipment || []).find(e => e.name.toLowerCase().includes('shoe'));
    const RACKET_PRICE = racketItem ? racketItem.unitPrice : 5;
    const SHOE_PRICE = shoeItem ? shoeItem.unitPrice : 10;

    const equipmentFee = (rackets * RACKET_PRICE) + (shoes * SHOE_PRICE);
    if (rackets || shoes) details.push({ name: 'Equipment', type: 'fixed', equipmentFee, rackets, shoes });
    current += equipmentFee;

    let coachFee = 0;
    if (selectedCoach) coachFee = selectedCoach.fee || 0;
    if (selectedCoach) details.push({ name: 'Coach', type: 'fixed', coachFee, coachName: selectedCoach.name });
    current += coachFee;

    setEstimate({ base: court.basePrice, details, equipmentFee, coachFee, total: Number(current.toFixed(2)) });
  }

  async function handleConfirm() {
    setLoading(true);
    setMessage(null);
    try {
      const payload = { userName, courtId: slot.courtId, coachId: selectedCoach ? selectedCoach.id : null, rackets, shoes, startTime, endTime };
      const res = await createBooking(payload);
      if (res && res.success) {
        setMessage({ type: 'success', text: 'Booking confirmed — check Bookings in Admin.' });
        onSuccess && onSuccess();
      } else {
        setMessage({ type: 'error', text: (res && res.message) || 'Booking failed' });
      }
    } catch (err) {
      const errMsg = err?.response?.data?.message || err.message || 'Server error';
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setLoading(false);
    }
  }

  function coachesFind(id) {
    if (!id) return null;
    return (coaches || []).find(x => String(x.id) === String(id)) || null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal modal-compact">
        <header className="modal-header">
          <div>
            <div className="muted small">Booking</div>
            <h3 className="modal-title"> {slot.courtName} • {formatHour(slot.hour)} • <span className="muted small">{date}</span></h3>
          </div>
          <button className="btn-ghost" title="Close" onClick={onClose}>✕</button>
        </header>

        <div className="modal-body compact-body">
          <form className="booking-form" onSubmit={(e)=>{ e.preventDefault(); handleConfirm(); }}>
            <div className="left">
              <label className="field">
                <span className="label">Your name</span>
                <input className="input-sm" value={userName} onChange={e => setUserName(e.target.value)} placeholder="Enter your name" />
              </label>

              <label className="field">
                <span className="label">Coach (optional)</span>
                <select className="input-sm" onChange={(e)=> setSelectedCoach(coachesFind(e.target.value))}>
                  <option value="">No coach</option>
                  { (coaches || []).map(c => <option key={c.id} value={c.id}>{c.name} — ₹{c.fee}</option>) }
                </select>
              </label>

              <div className="row">
                <label className="field half">
                  <span className="label">Rackets</span>
                  <input className="input-sm" type="number" min="0" value={rackets} onChange={e => setRackets(Number(e.target.value))} />
                </label>

                <label className="field half">
                  <span className="label">Shoes</span>
                  <input className="input-sm" type="number" min="0" value={shoes} onChange={e => setShoes(Number(e.target.value))} />
                </label>
              </div>

              {message && <div className={`message ${message.type === 'error' ? 'error' : 'success'}`}>{message.text}</div>}

              <div className="controls compact-controls">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Processing...' : `Confirm — ₹${estimate ? estimate.total : '...'}`}
                </button>
                <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              </div>
            </div>

            <aside className="right">
              <div className="meta">
                <div className="meta-item"><div className="meta-title">Court</div><div className="meta-value">{slot.courtName} ({court.type})</div></div>
                <div className="meta-item"><div className="meta-title">Time</div><div className="meta-value">{formatHour(slot.hour)}</div></div>
                <div className="meta-item"><div className="meta-title">Duration</div><div className="meta-value">1 hour</div></div>
              </div>

              <div className="breakdown-wrap">
                <h4 className="muted small">Live price</h4>
                <PriceBreakdown breakdown={estimate} />
              </div>
            </aside>
          </form>
        </div>
      </div>
    </div>
  );
}

function formatHour(h) {
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:00 ${ampm}`;
}
