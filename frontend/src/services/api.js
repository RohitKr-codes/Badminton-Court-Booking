import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 10000
});

export async function getCourts() {
  const r = await api.get('/courts');
  return r.data.data || [];
}

export async function getCoaches() {
  const r = await api.get('/admin/coaches');
  return r.data.data || [];
}

export async function getEquipment() {
  const r = await api.get('/admin/equipment');
  return r.data.data || [];
}

export async function getPricingRules() {
  const r = await api.get('/admin/pricing-rules');
  return r.data.data || [];
}

export async function getBookings() {
  const r = await api.get('/bookings');
  return r.data.data || [];
}

export async function createBooking(payload) {
  const r = await api.post('/bookings', payload);
  return r.data;
}

/* Admin delete functions */
export async function deleteCourt(id) {
  const r = await api.delete(`/admin/courts/${id}`);
  return r.data;
}

export async function deleteCoach(id) {
  const r = await api.delete(`/admin/coaches/${id}`);
  return r.data;
}

export async function deleteEquipment(id) {
  const r = await api.delete(`/admin/equipment/${id}`);
  return r.data;
}

export async function deletePricingRule(id) {
  const r = await api.delete(`/admin/pricing-rules/${id}`);
  return r.data;
}

export default api;
