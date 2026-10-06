import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Clock, Weight, IndianRupee, CheckCircle2, Package, Zap, Plane, Truck, FileText, Shield, Undo2, MapPin } from 'lucide-react';
import api from '../api/axios';
import { Loading, ErrorState } from '../components/States';

const iconMap = { package: Package, zap: Zap, plane: Plane, truck: Truck, file: FileText, shield: Shield, undo: Undo2, pin: MapPin };

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get(`/services/${id}`)
      .then((res) => setService(res.data.data))
      .catch(() => setError('This service could not be found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (error || !service) return <div className="max-w-screen-2xl ml-16 py-16"><ErrorState description={error} /></div>;

  const Icon = iconMap[service.icon] || Package;

  return (
    <div className="section">
      <div className="max-w-screen-2xl mx-8">
        <Link to="/services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue"><ArrowLeft size={15} /> Back to Services</Link>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-light-blue-bg text-navy">
                <Icon size={30} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-text-primary sm:text-3xl">{service.name}</h1>
                <p className="text-sm text-text-muted">{service.deliveryTime}</p>
              </div>
            </div>
            <p className="mt-6 text-base leading-relaxed text-text-secondary">{service.description}</p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="card p-4">
                <Clock size={18} className="text-blue" />
                <p className="mt-2 text-sm font-bold text-text-primary">{service.deliveryTime}</p>
                <p className="text-xs text-text-muted">Delivery Time</p>
              </div>
              <div className="card p-4">
                <Weight size={18} className="text-blue" />
                <p className="mt-2 text-sm font-bold text-text-primary">Up to {service.weightLimit} kg</p>
                <p className="text-xs text-text-muted">Weight Limit</p>
              </div>
              <div className="card p-4">
                <IndianRupee size={18} className="text-blue" />
                <p className="mt-2 text-sm font-bold text-text-primary">From ₹{service.basePrice}</p>
                <p className="text-xs text-text-muted">Starting Price</p>
              </div>
            </div>

            <ul className="mt-8 space-y-2.5">
              {['Real-time tracking included', 'Doorstep pickup & delivery', 'Secure handling & packaging care', 'Dedicated customer support'].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-text-secondary">
                  <CheckCircle2 size={16} className="text-success shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="card h-fit p-6">
            <h3 className="text-base font-bold text-text-primary">Ready to ship?</h3>
            <p className="mt-1.5 text-sm text-text-secondary">Book this service now and we'll take care of the rest.</p>
            <Link to="/shipment-request" className="btn-primary mt-5 w-full justify-center">
              Ship with {service.name} <ArrowRight size={16} />
            </Link>
            <Link to="/track" className="btn-outline mt-3 w-full justify-center">Track a Shipment</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
