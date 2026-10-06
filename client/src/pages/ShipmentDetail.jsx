import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, MapPin } from 'lucide-react';
import api from '../api/axios';
import { Loading, ErrorState } from '../components/States';
import StatusBadge from '../components/StatusBadge';

export default function ShipmentDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/shipments/${id}`).then((res) => setData(res.data.data)).catch(() => setError('Could not load this shipment.')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (error || !data) return <div className="max-w-screen-2xl mx-8 py-16"><ErrorState description={error} /></div>;

  const { shipment, trackingHistory } = data;

  return (
    <div className="section">
      <div className="max-w-screen-2xl mx-8">
        <Link to="/my-shipments" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue"><ArrowLeft size={15} /> Back to My Shipments</Link>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="card p-6 lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs text-text-muted">Tracking ID</p>
                <h1 className="text-xl font-extrabold text-text-primary">{shipment.trackingNumber}</h1>
              </div>
              <StatusBadge status={shipment.status} />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-5 text-sm sm:grid-cols-3">
              <div><p className="text-xs text-text-muted">Service</p><p className="font-semibold text-text-primary">{shipment.serviceId?.name}</p></div>
              <div><p className="text-xs text-text-muted">Package Type</p><p className="font-semibold text-text-primary">{shipment.packageType}</p></div>
              <div><p className="text-xs text-text-muted">Weight</p><p className="font-semibold text-text-primary">{shipment.weight} kg</p></div>
              <div><p className="text-xs text-text-muted">Pickup Date</p><p className="font-semibold text-text-primary">{new Date(shipment.pickupDate).toLocaleDateString()}</p></div>
              <div><p className="text-xs text-text-muted">Current Location</p><p className="font-semibold text-text-primary">{shipment.currentLocation || '—'}</p></div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-off-white p-4">
                <p className="text-xs font-bold uppercase text-text-muted">Sender</p>
                <p className="mt-1 text-sm font-semibold text-text-primary">{shipment.sender.name}</p>
                <p className="text-xs text-text-secondary">{shipment.sender.address}, {shipment.sender.city}, {shipment.sender.state}</p>
                <p className="text-xs text-text-secondary">{shipment.sender.phone}</p>
              </div>
              <div className="rounded-xl bg-off-white p-4">
                <p className="text-xs font-bold uppercase text-text-muted">Receiver</p>
                <p className="mt-1 text-sm font-semibold text-text-primary">{shipment.receiver.name}</p>
                <p className="text-xs text-text-secondary">{shipment.receiver.address}, {shipment.receiver.city}, {shipment.receiver.state}</p>
                <p className="text-xs text-text-secondary">{shipment.receiver.phone}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="mb-4 text-sm font-bold text-text-primary">Tracking History</h3>
            <div className="space-y-5">
              {trackingHistory.length === 0 && <p className="text-xs text-text-muted">No updates yet.</p>}
              {trackingHistory.map((h, i) => (
                <div key={h._id} className="relative flex gap-3">
                  {i < trackingHistory.length - 1 && <span className="absolute left-[11px] top-6 h-full w-px bg-border" />}
                  <div className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${i === 0 ? 'bg-success text-white' : 'bg-light-blue-bg text-blue'}`}>
                    <MapPin size={12} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-primary">{h.status.replace('_', ' ')}</p>
                    <p className="text-xs text-text-secondary">{h.description || h.location}</p>
                    <p className="text-[11px] text-text-muted">{new Date(h.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
