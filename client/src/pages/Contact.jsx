import { useState } from 'react';
import { Phone, Mail, MessageCircle, Headphones, MapPin, Send, ChevronRight, Handshake } from 'lucide-react';
import Input, { Field, Textarea, Select } from '../components/Input';
import { SuccessBanner } from '../components/States';
import hero from '../public/hero-bg.png'
import { motion } from 'framer-motion';


const contactMethods = [
  { icon: Phone, title: 'Call Us', value: '+91 1800 123 4567', sub: 'Mon – Sat, 9:00 AM – 8:00 PM (IST)' },
  { icon: Mail, title: 'Email Us', value: 'support@swiftship.com', sub: 'We reply within 24 hours' },
  { icon: MessageCircle, title: 'Live Chat', value: 'Chat with our support team', sub: 'Available on our website' },
  { icon: Headphones, title: 'Help Center', value: 'Find answers instantly', sub: 'Visit Help Center' },
];

const quickSupport = ['Track My Package', 'Delivery Information', 'Returns & Refunds', 'Account Help', 'Service Locations', 'Report an Issue'];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <section className="bg-navy min-h-[550px]">
          <div className="max-w-screen-2xl mx-8 py-14">
            <div className='flex justify-between max-w-screen-2xl  grid grid-cols-1 gap-8 py-14 lg:grid-cols-2 lg:items-center'>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-orange">Contact Us</p>
                <h1 className="mt-3 max-w-lg text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                  We're Here to <span className="text-orange">Move Forward With You</span>
                </h1>
                <p className="mt-3 max-w-lg text-sm text-white/70">Have a question, need support, or want to partner with us? Our team is ready to help. Let's keep the world moving together.</p>
                <p className="mt-3 border-l-2 border-orange pl-3 text-sm italic text-white/80">"People. Packages. Possibilities."</p>

              </div>
              <div className="flex justify-center">
                <img  alt="domestic-del-img" src={hero}  className='rounded-md w-[1000px] h-[290px]' />
              </div>
              {/* <img  src={hero} alt="domestic-del-img" className='rounded-md mb-4 w-[200px]' /> */}
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 rounded-2xl bg-white/10 p-5 sm:grid-cols-2 lg:grid-cols-4">
              {contactMethods.map((c) => (
                <div key={c.title} className="flex ml-10 items-center gap-4">
                  <c.icon size={20} className="shrink-0 text-orange" />
                  <div>
                    <p className="text-xs font-bold text-white">{c.title}</p>
                    <p className="text-xs text-white/80">{c.value}</p>
                    <p className="text-[11px] text-white/50">{c.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <section className="max-w-screen-2xl mx-8 py-12">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="card p-6 lg:col-span-1">
              <p className="section-label">Send Us a Message</p>
              <h3 className="mt-2 text-xl font-extrabold text-text-primary">Get in Touch</h3>
              <p className="mt-1.5 text-xs text-text-secondary">Fill out the form below and our team will get back to you as soon as possible.</p>
              {sent && <div className="mt-4"><SuccessBanner message="Your message has been sent. We'll be in touch soon!" /></div>}
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Full Name" required><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
                  <Field label="Email Address" required><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></Field>
                </div>
                <Field label="Subject" required>
                  <Select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required>
                    <option value="">Select a subject</option>
                    {['General Inquiry', 'Shipment Support', 'Business Partnership', 'Complaint'].map((s) => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </Field>
                <Field label="Your Message" required>
                  <Textarea rows={5} maxLength={500} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                </Field>
                <p className="text-right text-[11px] text-text-muted">{form.message.length}/500</p>
                <button className="btn-primary w-full justify-center">Send Message <Send size={15} /></button>
              </form>
            </div>

            <div className="card p-6 lg:col-span-1">
              <p className="section-label">Our Offices</p>
              <h3 className="mt-2 text-xl font-extrabold text-text-primary">Visit Us</h3>
              <p className="mt-1.5 text-xs text-text-secondary">Visit our headquarters or regional offices. We'd love to hear from you.</p>
              <div className="mt-4 rounded-xl border border-border p-4">
                <p className="flex items-center gap-2 text-sm font-bold text-text-primary"><MapPin size={16} className="text-blue" /> Global Headquarters</p>
                <p className="mt-2 text-xs text-text-secondary">SwiftShip Logistics Pvt. Ltd.<br />123 Innovation Drive, Tech Park,<br />Bengaluru, Karnataka 560100, India</p>
                <p className="mt-2 text-xs text-text-secondary">+91 1800 123 4567</p>
                <p className="text-xs text-text-secondary">Mon – Sat, 9:00 AM – 8:00 PM (IST)</p>
                <div className="mt-3 flex h-32 items-center justify-center rounded-lg bg-light-blue-bg text-blue"><MapPin size={26} /></div>
                <button className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-blue">Get Directions <ChevronRight size={14} /></button>
              </div>
            </div>

            <div className="space-y-5 lg:col-span-1">
              <div className="card p-5">
                <h4 className="text-sm font-bold text-text-primary">Quick Support</h4>
                <p className="text-xs text-text-muted">Find quick answers to common questions.</p>
                <ul className="mt-3 space-y-1">
                  {quickSupport.map((q) => (
                    <li key={q}>
                      <a href="#" className="flex items-center justify-between rounded-lg px-2 py-2 text-sm text-text-secondary hover:bg-off-white">
                        {q} <ChevronRight size={14} className="text-text-muted" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card p-5">
                <p className="flex items-center gap-2 text-sm font-bold text-text-primary"><Handshake size={16} className="text-blue" /> Business Inquiries</p>
                <p className="mt-1.5 text-xs text-text-secondary">Interested in business partnerships or bulk shipping solutions? We'd love to collaborate.</p>
                <button className="btn-outline btn-sm mt-3 w-full justify-center">Contact Sales</button>
              </div>
            </div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
