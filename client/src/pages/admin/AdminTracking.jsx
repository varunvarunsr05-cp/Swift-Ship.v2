import { useEffect, useState } from 'react';
import { Search, Filter, Plus, Eye, MoreHorizontal, Boxes, Truck, Clock3, AlertCircle } from 'lucide-react';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { StatCard, Pagination } from '../../components/admin/AdminWidgets';
import { Loading, ErrorState, EmptyState, SuccessBanner, ErrorBanner } from '../../components/States';
import StatusBadge from '../../components/StatusBadge';
import Input, { Field, Select, Textarea } from '../../components/Input';

const statusOptions = ['booked', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'exception'];

export default function AdminTracking() {
  const [shipments, setShipments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [form, setForm] = useState({ shipmentId: '', status: '', location: '', remarks: '' });
  const [formMsg, setFormMsg] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const fetchData = () => {
    setLoading(true);
    api.get('/tracking', { params: { search, page, limit: 10 } })
      .then((res) => { setShipments(res.data.data); setPages(res.data.pagination.pages); })
      .catch(() => setError('Could not load tracking updates.'))
      .finally(() => setLoading(false));
  };
  const fetchStats = () => api.get('/dashboard').then((res) => setStats(res.data.data.stats)).catch(() => {});

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => { fetchData(); }, [page]); // eslint-disable-line
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchData(); }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleSave = async (e) => {
    e.preventDefault();
    setFormMsg({ type: '', text: '' });
    if (!form.shipmentId || !form.status || !form.location) {
      setFormMsg({ type: 'error', text: 'Tracking ID, status and location are required.' });
      return;
    }
    setSaving(true);
    try {
      const shipment = shipments.find((s) => s.trackingNumber.toLowerCase() === form.shipmentId.toLowerCase());
      const targetId = shipment ? shipment._id : form.shipmentId;
      await api.post(`/shipments/${targetId}/tracking`, { status: form.status, location: form.location, remarks: form.remarks });
      setFormMsg({ type: 'success', text: 'Tracking update saved successfully.' });
      setForm({ shipmentId: '', status: '', location: '', remarks: '' });
      fetchData();
      fetchStats();
    } catch (err) {
      setFormMsg({ type: 'error', text: err.response?.data?.message || 'Could not find that shipment.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Tracking Updates" subtitle="Manage and update shipment tracking status in real-time.">
      {stats && (
        <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={Boxes} value={stats.totalShipments} label="Total Shipments" color="blue" />
          <StatCard icon={Truck} value={stats.delivered} label="Delivered" color="green" />
          <StatCard icon={Clock3} value={stats.inTransit} label="In Transit" color="blue" />
          <StatCard icon={AlertCircle} value={stats.booked} label="Pending Updates" color="red" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by Tracking ID, Receiver, or Location..." className="input-field pl-10" />
            </div>
            <button className="btn-outline"><Filter size={15} /> Filter</button>
          </div>

          {loading && <Loading />}
          {!loading && error && <ErrorState description={error} />}
          {!loading && !error && shipments.length === 0 && <EmptyState title="No shipments found" />}
          {!loading && !error && shipments.length > 0 && (
            <div className="card overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-off-white text-left text-xs font-bold uppercase text-text-muted">
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Tracking ID</th>
                    <th className="px-4 py-3">Current Status</th>
                    <th className="px-4 py-3">Last Location</th>
                    <th className="px-4 py-3">Last Updated</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shipments.map((s, i) => (
                    <tr key={s._id} className="border-b border-border last:border-0 hover:bg-off-white/60">
                      <td className="px-4 py-3 text-text-muted">{(page - 1) * 10 + i + 1}</td>
                      <td className="px-4 py-3 font-semibold text-blue">{s.trackingNumber}</td>
                      <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                      <td className="px-4 py-3">{s.currentLocation || '—'}</td>
                      <td className="px-4 py-3 text-text-muted">{new Date(s.updatedAt).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button onClick={() => setForm((f) => ({ ...f, shipmentId: s.trackingNumber }))} className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-off-white"><Eye size={14} /></button>
                          <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-off-white"><MoreHorizontal size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-4 pb-4"><Pagination page={page} pages={pages} onChange={setPage} /></div>
            </div>
          )}
        </div>

        <div className="card h-fit p-5">
          <h3 className="flex items-center gap-2 text-sm font-bold text-text-primary"><Plus size={16} /> Update Tracking Status</h3>
          <p className="mb-4 text-xs text-text-muted">Add a new tracking update for a shipment.</p>
          <form onSubmit={handleSave} className="space-y-4">
            {formMsg.type === 'error' && <ErrorBanner message={formMsg.text} />}
            {formMsg.type === 'success' && <SuccessBanner message={formMsg.text} />}
            <Field label="Tracking ID" required>
              <Input icon={Search} placeholder="Enter tracking ID" value={form.shipmentId} onChange={(e) => setForm({ ...form, shipmentId: e.target.value })} />
            </Field>
            <Field label="New Status" required>
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="">Select status</option>
                {statusOptions.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </Select>
            </Field>
            <Field label="Location" required>
              <Input placeholder="Enter location (e.g. Mumbai, MH)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </Field>
            <Field label="Remarks" hint="Optional">
              <Textarea rows={2} value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} placeholder="Add additional notes..." />
            </Field>
            <div className="flex gap-3">
              <button type="button" onClick={() => setForm({ shipmentId: '', status: '', location: '', remarks: '' })} className="btn-outline flex-1 justify-center">Reset</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">{saving ? 'Saving...' : 'Save Update'}</button>
            </div>
          </form>
          <div className="mt-4 rounded-xl bg-light-blue-bg p-3 text-xs text-text-secondary">Accurate and timely tracking updates build trust.</div>
        </div>
      </div>
    </AdminLayout>
  );
}
