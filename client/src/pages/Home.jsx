import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, ArrowRight, ShieldCheck, Zap, MapPinned, Globe2, Star,
  FileText, Package, Truck, Plane, Boxes,
} from 'lucide-react';
import api from '../api/axios';
import ServiceCard from '../components/ServiceCard';
import { Loading } from '../components/States';
import hero from '../public/hero-bg.png';
import domestic from '../public/domestic.png';

const features = [
  { icon: ShieldCheck, title: 'Secure & Reliable', desc: 'Your packages are in safe hands' },
  { icon: Zap, title: 'Fast Delivery', desc: 'On-time, every time' },
  { icon: MapPinned, title: 'Real-Time Tracking', desc: 'Stay updated always' },
  { icon: Globe2, title: 'Pan-India Coverage', desc: 'From cities to the farthest places' },
];

const stats = [
  { value: '1M+', label: 'Packages Delivered' },
  { value: '99.8%', label: 'On-Time Delivery' },
  { value: '25+', label: 'Cities Covered' },
  { value: '10K+', label: 'Happy Customers' },
];

export default function Home() {
  const [trackingId, setTrackingId] = useState('');
  const [services, setServices] = useState([])
    ;
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/services').then((res) => setServices(res.data.data.slice(0, 4))).finally(() => setLoading(false));
  }, []);

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackingId.trim()) navigate(`/track?id=${trackingId.trim()}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden  bg-gradient-to-b from-light-blue-bg to-white">
        <div className="max-w-screen-2xl mx-8 grid grid-cols-1 gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="badge bg-white text-text-secondary shadow-card">
              <Truck size={13} className="text-orange" /> Fast. Safe. Everywhere.
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] text-text-primary sm:text-5xl lg:text-[3.2rem]">
              Your World <br />
              Delivered <span className="text-orange">Smarter</span>
            </h1>
            <p className="mt-5 max-w-lg text-base text-text-secondary">
              Reliable courier and logistics solutions for individuals and businesses. Because every delivery moves a brighter tomorrow.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/shipment-request" className="btn-primary">Ship Now <ArrowRight size={16} /></Link>
              <Link to="/services" className="btn-outline">Our Services</Link>
            </div>

            <form onSubmit={handleTrack} className="mt-8 max-w-md rounded-2xl border border-border bg-white p-2 shadow-panel">
              <div className=" flex flex-col gap-1 sm:flex-row">
                <div className="relative flex">
                  <Package size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter your tracking ID (e.g. SSP123456789)"
                    className="w-[330px] rounded-xl border-0 bg-off-white py-3 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue/20"
                  />
                </div>
                <button type="submit" className="btn-primary justify-center">
                  Track <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="relative">
            <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br text-blue p-8 sm:p-6 bg-center bg-cover min-h-[400px]`}
            style={{backgroundImage:`url(${hero})`}}>
              {/* <img src={hero} alt="" className='rounded-md mb-4' /> */}
              <p className="font-serif text-lg italic leading-snug /90">
                Connecting<br />People<br />Places<br />Possibilities
              </p>
              <div className="mt-10 flex justify-center">
                {/* <Truck size={140} className="text-white/90" strokeWidth={1.2} /> */}
              </div>
              <div className="absolute bottom-5 left-5 rounded-xl bg-white/95 px-4 py-2.5 text-xs font-bold text-navy shadow-card">
                1M+ Packages Delivered
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features strip */}
      <section className="border-y border-border bg-border">
        <div className="max-w-screen-2xl mx-5 grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-light-blue-bg text-blue">
                <f.icon size={15} />
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">{f.title}</p>
                <p className="text-xs text-text-muted">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="section bg-off-white">
        <div className="max-w-screen-2xl mx-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label">Our Services</p>
              <h2 className="mt-2 text-3xl font-extrabold text-text-primary">Shipping Solutions for Every Need</h2>
              <p className="mt-2 max-w-xl text-sm text-text-secondary">From documents to bulk shipments, we deliver with speed, safety, and reliability.</p>
            </div>
            <Link to="/services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue">
              View All Services <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-8">
            {loading ? <Loading /> : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {services.map((s) => <ServiceCard key={s._id} service={s} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Global banner */}
      <section className="max-w-screen-2xl mx-8 py-4">
        <div className="lg:min-h-[400px] relative overflow-hidden rounded-2xl bg-navy px-6 py-10 sm:px-12 sm:py-14 md:text-center lg:text-left"
        >
          <p className="lg:max-w-md text-xs font-bold uppercase tracking-wider text-orange">Trusted Worldwide</p>
          <h3 className="mt-3 lg:max-w-md text-2xl font-extrabold text-white sm:text-3xl">Delivering Across India and Beyond</h3>
          <p className="mt-3 lg:max-w-md text-sm text-white/70">From local neighborhoods to global destinations — we keep the world moving.</p>
          <Link to="/shipment-request" className="btn-accent mt-6 inline-flex">Start Shipping <ArrowRight className='lg:max-w-md' size={16} /></Link>
          <div className="  absolute -right-[-25px] -top-[-25px] bg-center bg-cover text-white/10 h-[340px]  lg:w-[350px] xl:min-w-[600px] rounded-lg" 
          style={{backgroundImage:`url(${domestic})`}}>
          {/* <img width='450px' src={domestic} alt="domestic-del-img" className='rounded-md mb-4' /> */}
          </div>
          {/* <Globe2 size={220} className="absolute -right-8 -top-8 text-white/10" strokeWidth={0.8} /> */}
        </div>
      </section>

      {/* Stats + testimonial */}
      <section className="section">
        <div className="max-w-screen-2xl mx-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="grid grid-cols-2 gap-6 lg:col-span-2 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold text-navy">{s.value}</p>
                <p className="mt-1 text-xs font-medium text-text-muted">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="card p-5">
            <div className="mb-3 flex gap-0.5 text-orange">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <p className="text-sm italic text-text-secondary">"SwiftShip made my business logistics so easy. Reliable, fast and professional!"</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-light-blue-bg text-xs font-bold text-navy">RM</span>
              <div>
                <p className="text-sm font-bold text-text-primary">Rahul Mehta</p>
                <p className="text-xs text-text-muted">Small Business Owner</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
