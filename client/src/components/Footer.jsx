import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Instagram, Youtube, Mail, ArrowRight } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-screen-2xl mx-8 grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm text-white/70">
            Reliable courier and logistics solutions for individuals and businesses. Because every delivery moves a brighter tomorrow.
          </p>
          <div className="mt-5 flex gap-3">
            {[Linkedin, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-orange transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white/90">Quick Links</h4>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li><Link to="/" className="hover:text-orange">Home</Link></li>
            <li><Link to="/services" className="hover:text-orange">Services</Link></li>
            <li><Link to="/track" className="hover:text-orange">Track</Link></li>
            <li><Link to="/about" className="hover:text-orange">About</Link></li>
            <li><Link to="/contact" className="hover:text-orange">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white/90">Support</h4>
          <ul className="space-y-2.5 text-sm text-white/70">
            <li><a href="#" className="hover:text-orange">Help Center</a></li>
            <li><Link to="/track" className="hover:text-orange">Track Shipment</Link></li>
            <li><a href="#" className="hover:text-orange">Shipping Guide</a></li>
            <li><a href="#" className="hover:text-orange">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-orange">Terms of Service</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-white/90">Stay Updated</h4>
          <p className="mb-3 text-sm text-white/70">Get the latest updates, offers, and shipping tips.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <div className="relative flex-1">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
              <input type="email" placeholder="Enter your email" className="w-full rounded-lg border border-white/15 bg-white/10 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-orange" />
            </div>
            <button className="flex items-center justify-center rounded-lg bg-orange px-3.5 text-white hover:bg-orange/90">
              <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-screen-2xl flex flex-col items-center justify-between mx-8 gap-2 py-5 text-xs text-white/60 sm:flex-row">
          <p>© {new Date().getFullYear()} SwiftShip. All rights reserved.</p>
          <p className="italic">People · Packages · Possibilities</p>
        </div>
      </div>
    </footer>
  );
}
