import React, { useEffect, useState } from 'react';
import api, { getCourts, getCoaches, getEquipment, getPricingRules, deleteCourt, deleteCoach, deleteEquipment, deletePricingRule } from '../services/api';
import { Link } from 'react-router-dom';

function SmallForm({ title, onSubmit, children }) {
  return (
    <div className="card">
      <h4 style={{ marginTop: 0 }}>{title}</h4>
      <form onSubmit={onSubmit} className="inline-form" style={{ gap: 10 }}>
        {children}
      </form>
    </div>
  );
}

export default function AdminDashboard() {
  const [courts, setCourts] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [rules, setRules] = useState([]);
  const [statusMsg, setStatusMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { init(); }, []);

  async function init() {
    try {
      setLoading(true);
      const [c, ch, eq, r] = await Promise.all([
        getCourts(), getCoaches(), getEquipment(), getPricingRules()
      ]);
      setCourts(c); setCoaches(ch); setEquipment(eq); setRules(r);
    } catch (err) {
      console.error('load failed', err);
    } finally {
      setLoading(false);
    }
  }

  // Add functions
  async function addCourt(e) {
    e.preventDefault();
    const form = e.target;
    const payload = { name: form.name.value, type: form.type.value, basePrice: Number(form.basePrice.value) };
    const res = await api.post('/admin/courts', payload); // backend returns the created object with id
    setCourts(prev => [...prev, res.data]);  // instant UI update
    setStatusMsg('Court added ✔');
    form.reset();
  }

  async function addCoach(e) {
    e.preventDefault();
    const form = e.target;
    const payload = { name: form.name.value, fee: Number(form.fee.value) };
    await api.post('/admin/coaches', payload);
    setCoaches(prev => [...prev, payload]);
    setStatusMsg('Coach added ✔');
    form.reset();
  }

  async function addEquipment(e) {
    e.preventDefault();
    const form = e.target;
    const payload = { name: form.name.value, totalStock: Number(form.totalStock.value), unitPrice: Number(form.unitPrice.value) };
    await api.post('/admin/equipment', payload);
    setEquipment(prev => [...prev, payload]);
    setStatusMsg('Equipment added ✔');
    form.reset();
  }

  async function addRule(e) {
    e.preventDefault();
    const form = e.target;
    const payload = {
      name: form.name.value,
      type: form.type.value,
      startHour: form.startHour.value ? Number(form.startHour.value) : null,
      endHour: form.endHour.value ? Number(form.endHour.value) : null,
      multiplier: form.multiplier.value ? Number(form.multiplier.value) : null,
      surcharge: form.surcharge.value ? Number(form.surcharge.value) : null,
      courtType: form.courtType.value || null,
      enabled: form.enabled.checked
    };
    await api.post('/admin/pricing-rules', payload);
    setRules(prev => [...prev, payload]);
    setStatusMsg('Pricing rule added ✔');
    form.reset();
  }

  // Delete handlers with instant UI update
  async function handleDeleteCourt(id) {
    if (!confirm('Delete this court?')) return;
    await deleteCourt(id);
    setCourts(prev => prev.filter(c => c.id !== id));
    setStatusMsg('Court deleted ✔');
  }

  async function handleDeleteCoach(id) {
    if (!confirm('Delete this coach?')) return;
    await deleteCoach(id);
    setCoaches(prev => prev.filter(c => c.id !== id));
    setStatusMsg('Coach deleted ✔');
  }

  async function handleDeleteEquipment(id) {
    if (!confirm('Delete this equipment item?')) return;
    await deleteEquipment(id);
    setEquipment(prev => prev.filter(e => e.id !== id));
    setStatusMsg('Equipment deleted ✔');
  }

  async function handleDeleteRule(id) {
    if (!confirm('Delete this pricing rule?')) return;
    await deletePricingRule(id);
    setRules(prev => prev.filter(r => r.id !== id));
    setStatusMsg('Pricing rule deleted ✔');
  }

  async function handleClear() {
    setStatusMsg(null);
    await init();
  }

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2>Admin Dashboard</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/admin/bookings" className="btn">View Bookings</Link>
          <button className="btn-ghost" onClick={handleClear} disabled={loading}>{loading ? 'Refreshing...' : 'Clear'}</button>
        </div>
      </div>

      {statusMsg && <div className="card" style={{ background: 'rgba(16,185,129,0.06)', color: '#9ff3c9' }}>{statusMsg}</div>}

      <div className="admin-grid">
        <div>
          <SmallForm title="Add Court" onSubmit={addCourt}>
            <input name="name" placeholder="Court name" required />
            <select name="type"><option value="indoor">indoor</option><option value="outdoor">outdoor</option></select>
            <input name="basePrice" placeholder="basePrice (₹)" type="number" required />
            <button className="btn">Add</button>
          </SmallForm>

          <SmallForm title="Add Coach" onSubmit={addCoach}>
            <input name="name" placeholder="Coach name" required />
            <input name="fee" placeholder="Fee (₹)" type="number" required />
            <button className="btn">Add</button>
          </SmallForm>

          <SmallForm title="Add Equipment" onSubmit={addEquipment}>
            <input name="name" placeholder="Equipment name" required />
            <input name="totalStock" placeholder="Stock" type="number" required />
            <input name="unitPrice" placeholder="Unit price (₹)" type="number" required />
            <button className="btn">Add</button>
          </SmallForm>
        </div>

        <div>
          <div className="card">
            <h4 style={{ marginTop: 0 }}>Pricing Rules</h4>
            <form onSubmit={addRule} className="rule-form" style={{ alignItems: 'center' }}>
              <input name="name" placeholder="Rule name" required />
              <select name="type">
                <option value="peak">peak</option>
                <option value="weekend">weekend</option>
                <option value="courtType">courtType</option>
                <option value="fixed">fixed</option>
              </select>

              <input name="startHour" placeholder="startHour (opt)" type="number" />
              <input name="endHour" placeholder="endHour (opt)" type="number" />

              <input name="multiplier" placeholder="multiplier (opt)" type="number" step="0.1" />
              <input name="surcharge" placeholder="surcharge (opt)" type="number" />

              <input name="courtType" placeholder="courtType (indoor/outdoor)" />
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input name="enabled" type="checkbox" defaultChecked /> enabled
              </label>

              <div className="actions">
                <button className="btn">Add Rule</button>
              </div>
            </form>
          </div>

          <div className="card" style={{ marginTop: 12 }}>
            <h4 style={{ marginTop: 0 }}>Current Data</h4>

            <strong>Courts</strong>
            <ul>
              {courts.map(c => (
                <li key={c.id}>
                  <div>{c.name} — {c.type} — ₹{c.basePrice}</div>
                  <button className="delete-btn" onClick={() => handleDeleteCourt(c.id)}>Delete</button>
                </li>
              ))}
            </ul>

            <strong>Coaches</strong>
            <ul>
              {coaches.map(c => (
                <li key={c.id}>
                  <div>{c.name} — ₹{c.fee}</div>
                  <button className="delete-btn" onClick={() => handleDeleteCoach(c.id)}>Delete</button>
                </li>
              ))}
            </ul>

            <strong>Equipment</strong>
            <ul>
              {equipment.map(e => (
                <li key={e.id}>
                  <div>{e.name} — stock:{e.totalStock} — ₹{e.unitPrice}</div>
                  <button className="delete-btn" onClick={() => handleDeleteEquipment(e.id)}>Delete</button>
                </li>
              ))}
            </ul>

            <strong>Rules</strong>
            <ul>
              {rules.map(r => (
                <li key={r.id}>
                  <div>{r.name} — {r.type} — {r.enabled ? 'enabled' : 'disabled'}</div>
                  <button className="delete-btn" onClick={() => handleDeleteRule(r.id)}>Delete</button>
                </li>
              ))}
            </ul>

          </div>
        </div>
      </div>
    </div>
  );
}
