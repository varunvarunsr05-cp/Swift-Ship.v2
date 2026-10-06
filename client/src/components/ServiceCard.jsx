import { Link } from 'react-router-dom';
import { ArrowRight, Package, Zap, Plane, Truck, FileText, Shield, Undo2, MapPin } from 'lucide-react';

const iconMap = {
  package: Package,
  zap: Zap,
  plane: Plane,
  truck: Truck,
  file: FileText,
  shield: Shield,
  undo: Undo2,
  pin: MapPin,
};

export default function ServiceCard({ service }) {
  const Icon = iconMap[service.icon] || Package;
  return (
    <div className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-panel">
      <div className="flex h-36 items-center justify-center bg-light-blue-bg">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-navy shadow-card">
          <Icon size={26} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-text-primary">{service.name}</h3>
        <p className="mt-1.5 flex-1 text-sm text-text-secondary">{service.description}</p>
        <p className="mt-3 text-xs font-semibold text-text-muted">{service.deliveryTime}</p>
        <Link to={`/services/${service._id}`} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-blue group-hover:gap-2.5 transition-all">
          Learn More <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  );
}
