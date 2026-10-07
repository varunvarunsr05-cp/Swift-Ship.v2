import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Eye, Pencil, Trash2, MoreHorizontal, Boxes, Truck, Clock3, PackageCheck, XCircle } from 'lucide-react';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { StatCard, Pagination } from '../../components/admin/AdminWidgets';
import { Loading, ErrorState, EmptyState } from '../../components/States';
import StatusBadge, { STATUS_OPTIONS } from '../../components/StatusBadge';
import { Select } from '../../components/Input';
import ShipmentFormModal from '../../components/admin/ShipmentFormModal';

export default function AdminShipments() {
  const [shipments, setShipments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const fetchShipments = () => {
    setLoading(true);
    api.get('/shipments', { params: { search, status, page, limit: 10 } })
      .then((res) => { setShipments(res.data.data); setPages(res.data.pagination.pages); })
      .catch(() => setError('Could not load shipments.'))
      .finally(() => setLoading(false));
  };

  const fetchStats = () => api.get('/dashboard').then((res) => setStats(res.data.data.stats)).catch(() => { });

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => { fetchShipments(); }, [page, status]); // eslint-disable-line
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchShipments(); }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shipment? This cannot be undone.')) return;
    await api.delete(`/shipments/${id}`);
    fetchShipments();
    fetchStats();
  };

  return (
    <AdminLayout
      title="Shipments"
      subtitle="Manage all shipments, view details, edit or add new shipments."
      action={<button onClick={() => { setEditing(null); setModalOpen(true); }} className="btn-primary"><Plus size={16} /> Add New Shipment</button>}
    >
      {stats && (
        <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard icon={Boxes} value={stats.totalShipments} label="Total Shipments" color="blue" />
          <StatCard icon={Truck} value={stats.delivered} label="Delivered" color="green" />
          <StatCard icon={Clock3} value={stats.inTransit} label="In Transit" color="blue" />
          <StatCard icon={PackageCheck} value={stats.pickedUp} label="Picked Up" color="orange" />
          <StatCard icon={XCircle} value={stats.cancelled} label="Cancelled" color="red" />
        </div>
      )}
      <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="lg:col-span-2">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by Tracking ID, Receiver, or Destination..." className="input-field pl-10" />
          </div>
          <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="sm:w-52">
            <option value="all">All Status</option>
            {['booked', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'].map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </Select>
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
                  <th className="px-4 py-3">Receiver</th>
                  <th className="px-4 py-3">Destination</th>
                  <th className="px-4 py-3">Date Submitted</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s, i) => (
                  <tr key={s._id} className="border-b border-border last:border-0 hover:bg-off-white/60">
                    <td className="px-4 py-3 text-text-muted">{(page - 1) * 10 + i + 1}</td>
                    <td className="px-4 py-3 font-semibold text-blue">{s.trackingNumber}</td>
                    <td className="px-4 py-3">{s.receiver.name}</td>
                    <td className="px-4 py-3">{s.receiver.city}, {s.receiver.state}</td>
                    <td className="px-4 py-3">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <Link to={`/admin/shipments/${s._id}`} className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-off-white"><Eye size={14} /></Link>
                        <button onClick={() => { setEditing(s); setModalOpen(true); }} className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-off-white"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(s._id)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-error hover:bg-red-50"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-4 pb-4"><Pagination page={page} pages={pages} onChange={setPage} /></div>
          </div>
          
        )}

        {modalOpen && (
          <ShipmentFormModal
            shipment={editing}
            onClose={() => setModalOpen(false)}
            onSaved={() => { setModalOpen(false); fetchShipments(); fetchStats(); }}
          />
        )}
      </div>
      </div>
    </AdminLayout>
  );
}
