import { Link } from 'react-router-dom';
import { Globe2, Package, Users, ShieldCheck, ArrowRight, Rocket, Eye, Heart, Truck } from 'lucide-react';
import express from '../public/express.png'
import { motion } from 'framer-motion';


const stats = [
  { icon: Globe2, value: '200+', label: 'Countries' },
  { icon: Package, value: '1M+', label: 'Deliveries' },
  { icon: Users, value: '50K+', label: 'Happy Customers' },
  { icon: ShieldCheck, value: '99.9%', label: 'On-time Delivery' },
];

const values = [
  { icon: Rocket, title: 'Our Mission', desc: 'To deliver happiness by connecting people and businesses across the world with reliable and innovative logistics solutions.' },
  { icon: Eye, title: 'Our Vision', desc: 'A more connected world where distance is not a barrier, but a bridge to new opportunities.' },
  { icon: Heart, title: 'Our Values', desc: 'Trust, customer focus, innovation, sustainability, and a commitment to making a positive impact.' },
];

export default function About() {
  return (
    <div>
      <section className="bg-navy">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="max-w-screen-2xl mx-8 grid grid-cols-1 gap-8 py-14 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-white/60">About SwiftShip</p>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Moving the World <span className="text-orange">Closer Together</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm text-white/70">
              At SwiftShip, we believe delivery is more than just a destination — it's a connection. We move people, businesses, and possibilities forward, every single day.
            </p>
            <p className="mt-4 border-l-2 border-orange pl-3 text-sm italic text-white/80">"Reliable. Fast. Global."</p>
          </div>
          <div className="flex justify-center">
            {/* <Truck size={130} className="text-white/15" strokeWidth={1} /> */}
            <img width='500px' src={express} alt="" className='rounded-md' />

          </div>
        </div>
        <div className="max-w-screen-2xl mx-8 pb-10">
          <div className="grid grid-cols-2 gap-6 rounded-2xl bg-white/10 p-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <s.icon size={20} className="text-orange" />
                <div>
                  <p className="text-lg font-extrabold text-white">{s.value}</p>
                  <p className="text-xs text-white/60">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      </section>

      <section className="section">
        <div className="max-w-screen-xl ml-16 grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="section-label">Our Story</p>
            <h2 className="mt-2 text-2xl font-extrabold text-text-primary sm:text-3xl">
              Built on Trust. <span className="text-orange">Driven by People.</span>
            </h2>
            <p className="mt-4 text-left text-sm leading-relaxed text-text-secondary">
              SwiftShip was founded with a simple vision — to make global shipping smarter, faster, and more reliable. What started as a small logistics network has grown into a trusted delivery partner, serving individuals, businesses, and communities across the country.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Today, we combine technology, people, and a customer-first approach to ensure every package reaches its destination safely and on time.
            </p>
            <Link to="/services" className="btn-outline mt-6 inline-flex">Our Journey <ArrowRight size={16} /></Link>
          </div>
          <div className="space-y-4">
            {values.map((v) => (
              <div key={v.title} className="card p-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-light-blue-bg text-blue"><v.icon size={17} /></div>
                <p className="mt-2.5 text-sm font-bold text-text-primary">{v.title}</p>
                <p className="mt-1 text-xs text-text-secondary">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-off-white pb-14">
        <div className="max-w-screen-2xl mx-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div>
            <p className="section-label">Global Reach</p>
            <h3 className="mt-2 text-2xl font-extrabold text-text-primary">A Stronger, <span className="text-orange">More Connected Tomorrow</span></h3>
            <p className="mt-3 text-sm text-text-secondary">From local deliveries to global shipments, SwiftShip keeps the world moving — today and for generations ahead.</p>
          </div>
          <div className="rounded-2xl bg-navy p-8 text-white">
            <h4 className="text-lg font-extrabold">Be a Part of Our Journey</h4>
            <p className="mt-2 text-sm text-white/70">Whether you're an individual, a business, or a partner, let's move the world forward together.</p>
            <Link to="/shipment-request" className="btn-accent mt-5 inline-flex">Ship with Us <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
