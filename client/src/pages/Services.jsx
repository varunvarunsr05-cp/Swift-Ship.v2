import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, Users, MapPinned, Globe2, ArrowRight, FileEdit, Package, Truck, CheckCircle2,
} from 'lucide-react';
import api from '../api/axios';
import ServiceCard from '../components/ServiceCard';
import { Loading, ErrorState, EmptyState } from '../components/States';
import business from '../public/business.png'
import { motion } from 'framer-motion';

const trust = [
  { icon: ShieldCheck, title: 'Secure Handling', desc: 'Your packages are in safe hands' },
  { icon: Users, title: 'Customer Support', desc: "We're here to help you always" },
  { icon: MapPinned, title: 'Real-Time Tracking', desc: 'Stay updated at every step' },
  { icon: Globe2, title: 'Pan-India Coverage', desc: 'From cities to the farthest places' },
];

const steps = [
  { icon: FileEdit, title: 'Create a Shipment', desc: 'Fill in your shipment details online.' },
  { icon: Package, title: 'We Pick It Up', desc: 'Our team collects your package.' },
  { icon: Truck, title: 'We Deliver', desc: 'Your package reaches its destination safely.' },
  { icon: CheckCircle2, title: 'Track in Real-Time', desc: 'Stay updated every step of the way.' },
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/services').then((res) => setServices(res.data.data)).catch(() => setError('Could not load services right now.')).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="bg-off-white">
          <div className="max-w-screen-2xl mx-8 grid grid-cols-1 gap-8 py-12 lg:grid-cols-2 lg:items-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div>
              <p className="text-xs text-text-muted">Home &gt; Services</p>
              <p className="section-label mt-3">Our Services</p>
              <h1 className="mt-2 text-3xl font-extrabold text-text-primary sm:text-4xl">
                Shipping Solutions for <span className="text-orange">Every Need</span>
              </h1>
              <p className="mt-3 max-w-lg text-sm text-text-secondary">
                From documents to large shipments, we deliver with speed, safety, and reliability. Choose the service that fits your needs.
              </p>
            </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="relative rounded-3xl bg-gradient-to-br
         p-10 min-h-[330px] bg-center bg-cover"
        style={{backgroundImage:`url(${business})`}}>
          {/* <Truck size={120} className="mx-auto text-white/90" strokeWidth={1.2} /> */}
          {/* <img width='460px' src={business} alt="" className='rounded-md' /> */}

          <div className="absolute sm:right-4 top-4 space-y-2 rounded-xl bg-white/95 p-3 text-xs font-semibold text-navy shadow-card">
            <p className="flex items-center gap-1.5"><ShieldCheck size={14} /> Safe & Secure</p>
            <p className="flex items-center gap-1.5"><Truck size={14} /> On-Time Delivery</p>
            <p className="flex items-center gap-1.5"><Globe2 size={14} /> Pan-India Coverage</p>
          </div>
        </div>
        </motion.div>
    </div>
        {/* <div className='bg-border h-2'  ></div> */ }
      </section >

      <section className="section bg-border">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="max-w-screen-2xl mx-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label">Our Services</p>
              <h2 className="mt-2 text-2xl font-extrabold text-text-primary sm:text-3xl">What We Offer</h2>
            </div>
            <p className="max-w-sm text-sm text-text-secondary">Reliable, flexible, and customer-focused services to move what matters, anywhere in India.</p>
          </div>

          <div className="mt-8">
            {loading && <Loading />}
            {!loading && error && <ErrorState description={error} />}
            {!loading && !error && services.length === 0 && <EmptyState title="No services available yet" />}
            {!loading && !error && services.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {services.map((s) => <ServiceCard key={s._id} service={s} />)}
              </div>
            )}
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 rounded-2xl bg-light-blue-bg p-6 sm:grid-cols-4">
            {trust.map((t) => (
              <div key={t.title} className="flex items-center gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-blue shadow-card">
                  <t.icon size={15} />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">{t.title}</p>
                  <p className="text-xs text-text-muted">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
         </motion.div>   
      </section>

      <section className="section bg-off-white">
        <div className="max-w-screen-2xl mx-8">
          <p className="section-label">Simple Steps</p>
          <h2 className="mt-2 text-2xl font-extrabold text-text-primary sm:text-3xl">How It Works</h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">{i + 1}</div>
                <div className="mt-4 flex h-14 w-14 items-center justify-center rounded-xl bg-light-blue-bg text-blue">
                  <s.icon size={22} />
                </div>
                <h3 className="mt-3 text-sm font-bold text-text-primary">{s.title}</h3>
                <p className="mt-1 text-xs text-text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-screen-2xl mx-8 py-4">
        <div className="rounded-2xl text-center bg-navy px-6 py-10 sm:px-12">
          <p className="text-xs font-bold uppercase tracking-wider text-orange">Ready to Ship?</p>
          <h3 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">Send Smarter Today</h3>
          <p className="mt-2 text-sm text-white/70">Choose the right service and experience hassle-free delivery.</p>
          <Link to="/shipment-request" className="btn-accent mt-6 inline-flex">Create Shipment <ArrowRight size={16} /></Link>
        </div>
      </section>
    </div >
  );
}
