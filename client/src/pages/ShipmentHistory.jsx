import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Plus, Eye, MoreHorizontal, Truck, Clock3, Boxes, Package } from 'lucide-react';
import api from '../api/axios';
import { Loading, ErrorState, EmptyState } from '../components/States';
import StatusBadge, { STATUS_OPTIONS } from '../components/StatusBadge';
import { Pagination } from '../components/admin/AdminWidgets';
import { Select } from '../components/Input';

export default function ShipmentHistory() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchData = () => {
    setLoading(true);
    api.get('/shipments', { params: { search, status, page, limit: 8 } })
      .then((res) => {
        setShipments(res.data.data);
        setPages(res.data.pagination.pages);
      })
      .catch(() => setError('Could not load your shipments right now.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [page, status]); // eslint-disable-line
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchData(); }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <div>
      <section className="bg-gradient-to-b from-light-blue-bg to-white">
        <div className="max-w-screen-2xl mx-8 grid grid-cols-1 gap-8 py-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs text-text-muted">Home &gt; My Shipments</p>
            <p className="section-label mt-2">My Shipments</p>
            <h1 className="mt-2 text-3xl font-extrabold text-text-primary sm:text-4xl">
              Your Shipment <span className="text-orange">History</span>
            </h1>
            <p className="mt-3 max-w-md text-sm text-text-secondary">View and manage all your submitted shipments. Track their status, check details, and keep everything in one place.</p>
          </div>
          <div className="hidden justify-center gap-4 lg:flex">
            {[
              [Truck, 'Track Past Shipments', 'View real-time status'],
              [Clock3, 'Stay Organized', 'Access all your requests'],
              [Boxes, 'Ship Smarter', 'Reorder or create new'],
            ].map(([Icon, t, d]) => (
              <div key={t} className="card w-40 p-3.5">
                <Icon size={18} className="text-blue" />
                <p className="mt-2 text-xs font-bold text-text-primary">{t}</p>
                <p className="text-[11px] text-text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-screen-2xl mx-8 py-10">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-text-primary">Submitted Shipments</h2>
            <p className="text-xs text-text-muted">Here's a list of all the shipments you've created.</p>
          </div>
          <Link to="/shipment-request" className="btn-primary btn-sm"><Plus size={15} /> Create New Shipment</Link>
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by Tracking ID, Receiver name, or Location..." className="input-field pl-10" />
          </div>
          <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="sm:w-52">
            <option value="all">All Status</option>
            {STATUS_OPTIONS.filter((s) => ['booked', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled'].includes(s)).map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </Select>
          <button className="btn-outline sm:w-auto"><Filter size={15} /> Filter</button>
        </div>

        {loading && <Loading />}
        {!loading && error && <ErrorState description={error} />}
        {!loading && !error && shipments.length === 0 && (
          <EmptyState icon={Package} title="No shipments yet" description="You haven't created any shipments yet." action={<Link to="/shipment-request" className="btn-primary btn-sm mt-2">Create Shipment</Link>} />
        )}

        {!loading && !error && shipments.length > 0 && (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
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
                    <td className="px-4 py-3 text-text-muted">{(page - 1) * 8 + i + 1}</td>
                    <td className="px-4 py-3 font-semibold text-blue">{s.trackingNumber}</td>
                    <td className="px-4 py-3">{s.receiver.name}</td>
                    <td className="px-4 py-3">{s.receiver.city}, {s.receiver.state}</td>
                    <td className="px-4 py-3">{new Date(s.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Link to={`/my-shipments/${s._id}`} className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-off-white"><Eye size={14} /></Link>
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

        <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl bg-light-blue-bg p-5 sm:flex-row">
          <div>
            <p className="text-sm font-bold text-text-primary">Need to ship something new?</p>
            <p className="text-xs text-text-secondary">Create a new shipment in just a few clicks and experience our fast, secure, and reliable delivery service.</p>
          </div>
          <Link to="/shipment-request" className="btn-outline whitespace-nowrap">Create Shipment</Link>
        </div>
      </section>
    </div>
  );
}
