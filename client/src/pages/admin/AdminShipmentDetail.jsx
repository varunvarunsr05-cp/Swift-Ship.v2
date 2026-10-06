import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { Loading, ErrorState } from '../../components/States';
import StatusBadge from '../../components/StatusBadge';

export default function AdminShipmentDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/shipments/${id}`).then((res) => setData(res.data.data)).catch(() => setError('Could not load shipment.')).finally(() => setLoading(false));
  }, [id]);

  return (
    <AdminLayout title="Shipment Details" subtitle="Full shipment record and tracking history">
      {loading && <Loading />}
      {!loading && error && <ErrorState description={error} />}
      {!loading && data && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="card p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-text-primary">{data.shipment.trackingNumber}</h3>
              <StatusBadge status={data.shipment.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm sm:grid-cols-3">
              <div><p className="text-xs text-text-muted">Service</p><p className="font-semibold">{data.shipment.serviceId?.name}</p></div>
              <div><p className="text-xs text-text-muted">Weight</p><p className="font-semibold">{data.shipment.weight} kg</p></div>
              <div><p className="text-xs text-text-muted">Current Location</p><p className="font-semibold">{data.shipment.currentLocation || '—'}</p></div>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-off-white p-4">
                <p className="text-xs font-bold uppercase text-text-muted">Sender</p>
                <p className="text-sm font-semibold">{data.shipment.sender.name}</p>
                <p className="text-xs text-text-secondary">{data.shipment.sender.address}, {data.shipment.sender.city}</p>
              </div>
              <div className="rounded-xl bg-off-white p-4">
                <p className="text-xs font-bold uppercase text-text-muted">Receiver</p>
                <p className="text-sm font-semibold">{data.shipment.receiver.name}</p>
                <p className="text-xs text-text-secondary">{data.shipment.receiver.address}, {data.shipment.receiver.city}</p>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <h4 className="mb-3 text-sm font-bold text-text-primary">Tracking History</h4>
            <div className="space-y-4">
              {data.trackingHistory.map((h) => (
                <div key={h._id}>
                  <p className="text-xs font-bold text-text-primary">{h.status.replace('_', ' ')}</p>
                  <p className="text-xs text-text-secondary">{h.location} · {new Date(h.timestamp).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <Link to="/admin/shipments" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue"><ArrowLeft size={15} /> Back to Shipments</Link>
    </AdminLayout>
  );
}
