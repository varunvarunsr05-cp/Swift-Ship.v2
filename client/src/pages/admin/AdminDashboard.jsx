import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import {
  Boxes, Truck, Clock3, PackageCheck, XCircle, Plus, MapPin, Layers, Image as ImageIcon, ArrowRight, Globe2,
} from 'lucide-react';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { StatCard } from '../../components/admin/AdminWidgets';
import { Loading } from '../../components/States';
import StatusBadge from '../../components/StatusBadge';

const COLORS = ['#16A34A', '#2563D9', '#FF6B00', '#DC2626'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then((res) => setData(res.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading || !data) return <AdminLayout><Loading /></AdminLayout>;

  const { stats, overview, recentShipments } = data;
  const pieData = [
    { name: 'Delivered', value: stats.delivered },
    { name: 'In Transit', value: stats.inTransit },
    { name: 'Picked Up', value: stats.pickedUp },
    { name: 'Cancelled', value: stats.cancelled },
  ];
  const total = stats.totalShipments || 1;

  return (
    <AdminLayout>
      <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <p className="text-2xl font-extrabold text-text-primary">Welcome back, Admin 👋</p>
          <p className="text-sm text-text-secondary">Here's what's happening with your shipments today.</p>
        </div>
        <p className="text-sm text-text-muted">{new Date().toLocaleDateString(undefined, { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard icon={Boxes} value={stats.totalShipments} label="Total Shipments" color="blue" />
        <StatCard icon={Truck} value={stats.delivered} label="Delivered" color="green" />
        <StatCard icon={Clock3} value={stats.inTransit} label="In Transit" color="blue" />
        <StatCard icon={PackageCheck} value={stats.pickedUp} label="Picked Up" color="orange" />
        <StatCard icon={XCircle} value={stats.cancelled} label="Cancelled" color="red" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-text-primary">Shipment Overview</h3>
              <p className="text-xs text-text-muted">Total shipments over the last 7 days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={overview}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DCE5F2" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} stroke="#7B8BA3" />
              <YAxis tick={{ fontSize: 11 }} stroke="#7B8BA3" />
              <Tooltip />
              <Line type="monotone" dataKey="delivered" stroke="#2563D9" strokeWidth={2} dot={false} name="Delivered" />
              <Line type="monotone" dataKey="inTransit" stroke="#FF6B00" strokeWidth={2} dot={false} name="In Transit" />
              <Line type="monotone" dataKey="pickedUp" stroke="#7C3AED" strokeWidth={2} dot={false} name="Picked Up" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-bold text-text-primary">Shipment Status Distribution</h3>
          <p className="mb-2 text-xs text-text-muted">Overall status of all shipments</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={2}>
                {pieData.map((entry, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5">
            {pieData.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} /> {p.name}</span>
                <span className="font-semibold text-text-primary">{p.value} ({Math.round((p.value / total) * 100)}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-primary">Recent Shipments</h3>
            <Link to="/admin/shipments" className="flex items-center gap-1 text-xs font-semibold text-blue">View All <ArrowRight size={13} /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-bold uppercase text-text-muted">
                  <th className="py-2">#</th><th className="py-2">Tracking ID</th><th className="py-2">Receiver</th><th className="py-2">Status</th><th className="py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentShipments.map((s, i) => (
                  <tr key={s._id} className="border-b border-border last:border-0">
                    <td className="py-2.5 text-text-muted">{i + 1}</td>
                    <td className="py-2.5 font-semibold text-blue">{s.trackingNumber}</td>
                    <td className="py-2.5">{s.receiver.name}</td>
                    <td className="py-2.5"><StatusBadge status={s.status} /></td>
                    <td className="py-2.5 text-text-muted">{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="mb-3 text-sm font-bold text-text-primary">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              [Plus, 'Add New Shipment', '/admin/shipments'],
              [MapPin, 'Update Tracking', '/admin/tracking'],
              [Layers, 'Manage Services', '/admin/services'],
              [ImageIcon, 'Manage Content', '/admin/content'],
            ].map(([Icon, label, to]) => (
              <Link key={label} to={to} className="flex flex-col gap-2 rounded-xl border border-border p-3 hover:bg-off-white">
                <Icon size={18} className="text-blue" />
                <span className="text-xs font-semibold text-text-primary leading-tight">{label}</span>
              </Link>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-light-blue-bg p-3.5">
            <Globe2 size={22} className="text-blue" />
            <div>
              <p className="text-xs font-bold text-text-primary">Keep the world moving</p>
              <p className="text-[11px] text-text-muted">Reliable. Fast. Global.</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
