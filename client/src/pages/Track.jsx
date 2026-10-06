import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Package, ArrowRight, Clock, ShieldCheck, Globe2, Share2, Printer, Headphones,
  CheckCircle2, Truck, Building2, PlaneTakeoff, Mail, Smartphone, Bell, MapPin,
} from 'lucide-react';
import api from '../api/axios';
import { Loading, ErrorState, EmptyState } from '../components/States';
import StatusBadge from '../components/StatusBadge';
import { motion } from 'framer-motion';
import express from '../public/express.png'

const stepIcon = {
  booked: Package,
  picked_up: Package,
  in_transit: PlaneTakeoff,
  out_for_delivery: Truck,
  delivered: CheckCircle2,
  cancelled: Building2,
  exception: Building2,
};

const stepLabel = {
  booked: 'Shipment Booked',
  picked_up: 'Shipment Picked Up',
  in_transit: 'In Transit',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  exception: 'Exception',
};

export default function Track() {
  const [params, setParams] = useSearchParams();
  const [input, setInput] = useState(params.get('id') || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const doTrack = async (id) => {
    if (!id) return;
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const { data } = await api.get(`/tracking/${id.trim()}`);
      setResult(data.data);
    } catch (err) {
      setResult(null);
      setError(err.response?.data?.message || 'No shipment found with this tracking number.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.get('id')) doTrack(params.get('id'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setParams({ id: input });
    doTrack(input);
  };

  return (
    <div>
      <section className="bg-center  bg-cover lg:min-h-[650px]"
      style={{backgroundImage:`url(${express})`}}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

          <div className="max-w-screen-2xl mx-8 grid grid-cols-1 gap-8 py-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="section-label">Track Your Shipment</p>
              <h1 className="mt-2 text-3xl font-extrabold text-text-primary sm:text-4xl">
                Know Exactly Where <span className="text-orange">Your Package</span> Is
              </h1>
              <p className="mt-3 max-w-md text-sm text-text-secondary">Enter your tracking ID to get real-time updates on your shipment. Fast. Accurate. Always.</p>
              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-2 rounded-2xl border border-border bg-white p-2 shadow-panel sm:flex-row">
                <div className="relative flex-1">
                  <Package size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter your tracking ID (e.g. SSP123456789)" className="w-full rounded-xl border-0 bg-off-white py-3 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" />
                </div>
                <button type="submit" className="btn-primary justify-center">Track Shipment <ArrowRight size={16} /></button>
              </form>
            </div>
            <div className="hidden justify-center lg:flex">
              <div className="rounded-2xl bg-white p-5 shadow-card">
                <p className="mb-2 text-xs font-bold text-text-primary">Real-Time Tracking</p>
                <p className="mb-2 flex items-center gap-1.5 text-xs text-text-muted"><ShieldCheck size={13} /> Secure & Reliable</p>
                <p className="flex items-center gap-1.5 text-xs text-text-muted"><Globe2 size={13} /> Pan-India Coverage</p>
              </div>
            </div>
          </div>
          </motion.div>
      </section>
      <section className=" max-w-screen-2xl mx-8 py-10">
        {loading && <Loading label="Fetching tracking details..." />}
        {!loading && searched && error && <ErrorState title="Shipment not found" description={error} />}
        {!loading && !searched && (
          <EmptyState title="Track a shipment" description="Enter a tracking ID above to see real-time shipment status and history." icon={Package} />
        )}

        {!loading && result && (
          <div className=" grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="card p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-text-primary">Tracking Details</h3>
                <div className="flex gap-2">
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary"><Share2 size={15} /></button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary"><Printer size={15} /></button>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 border-b border-border pb-5 text-sm sm:grid-cols-4">
                <div><p className="text-xs text-text-muted">Tracking ID</p><p className="font-bold text-text-primary">{result.shipment.trackingNumber}</p></div>
                <div><p className="text-xs text-text-muted">Status</p><StatusBadge status={result.shipment.status} /></div>
                <div><p className="text-xs text-text-muted">Service Type</p><p className="font-semibold text-text-primary">{result.shipment.serviceId?.name}</p></div>
                <div><p className="text-xs text-text-muted">From → To</p><p className="font-semibold text-text-primary">{result.shipment.sender.city} → {result.shipment.receiver.city}</p></div>
              </div>

              <div className="mt-6 space-y-6">
                {result.history.length === 0 && <p className="text-sm text-text-muted">No tracking history yet.</p>}
                {result.history.map((h, i) => {
                  const Icon = stepIcon[h.status] || MapPin;
                  return (
                    <div key={h._id} className="relative flex gap-4 pb-1">
                      {i < result.history.length - 1 && <span className="absolute left-[15px] top-8 h-full w-px bg-border" />}
                      <div className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${i === 0 ? 'bg-success text-white' : 'bg-light-blue-bg text-blue'}`}>
                        <Icon size={15} />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <p className="text-sm font-bold text-text-primary">{stepLabel[h.status] || h.status}</p>
                          <p className="text-xs text-text-muted">{new Date(h.timestamp).toLocaleString()}</p>
                        </div>
                        <p className="text-xs text-text-secondary">{h.description || h.remarks || h.location}</p>
                        <p className="text-xs text-text-muted">{h.location}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-5">
              <div className="card p-5">
                <div className="mb-3 flex h-28 items-center justify-center rounded-xl bg-light-blue-bg text-navy"><Package size={40} /></div>
                <h4 className="text-sm font-bold text-text-primary">Shipment Information</h4>
                <div className="mt-3 space-y-2 text-xs">
                  {[
                    ['Tracking ID', result.shipment.trackingNumber],
                    ['Service Type', result.shipment.serviceId?.name],
                    ['Package Type', result.shipment.packageType],
                    ['Weight', `${result.shipment.weight} kg`],
                    ['Pickup Date', new Date(result.shipment.pickupDate).toLocaleDateString()],
                    ['Current Location', result.shipment.currentLocation || '—'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-border/70 py-1.5">
                      <span className="text-text-muted">{k}</span>
                      <span className="font-semibold text-text-primary">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-5">
                <p className="flex items-center gap-2 text-sm font-bold text-text-primary"><Headphones size={16} /> Need Help with Your Shipment?</p>
                <p className="mt-1.5 text-xs text-text-secondary">Our support team is here to assist you.</p>
                <button className="btn-outline btn-sm mt-3 w-full justify-center">Contact Support</button>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="bg-border mb-4 max-w-screen-2xl mx-8 rounded-lg p-7 pb-10">
        <h3 className="mb-5 text-lg font-bold text-text-primary">More Ways to Track</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Mail, title: 'Get Email Updates', desc: 'Receive tracking updates directly in your inbox.' },
            { icon: Smartphone, title: 'Track on Mobile', desc: 'Use our mobile app for faster updates.' },
            { icon: Bell, title: 'Enable Notifications', desc: 'Get real-time alerts about your shipment.' },
            { icon: MapPin, title: 'Track Multiple Shipments', desc: 'Monitor all your shipments in one place.' },
          ].map((c) => (
            <div key={c.title} className="card p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-light-blue-bg text-blue"><c.icon size={17} /></div>
              <p className="mt-3 text-sm font-bold text-text-primary">{c.title}</p>
              <p className="text-xs text-text-muted">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
