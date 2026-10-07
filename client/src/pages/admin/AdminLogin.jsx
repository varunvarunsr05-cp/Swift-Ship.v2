import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Package, BarChart3, Grid3x3, Image as ImageIcon, Globe2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Input, { Field } from '../../components/Input';
import { ErrorBanner } from '../../components/States';
import Logo from '../../components/Logo';

const features = [
  { icon: Package, title: 'Shipment Management', desc: 'Create, update and manage shipments' },
  { icon: BarChart3, title: 'Real-time Tracking', desc: 'Keep your customers informed' },
  { icon: Grid3x3, title: 'Service Management', desc: 'Manage services and offerings' },
  { icon: ImageIcon, title: 'Content Control', desc: 'Update banners, images and pages' },
];

const stats = [
  { value: '200+', label: 'Countries' },
  { value: '1M+', label: 'Deliveries' },
  { value: '50K+', label: 'Happy Customers' },
  { value: '99.9%', label: 'On-time Delivery' },
];

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@swiftship.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role !== 'admin') {
        setError('This account does not have admin access.');
        return;
      }
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-navy via-navy to-blue px-10 py-14 lg:flex lg:flex-col lg:justify-center">
        <div className="absolute right-6 top-6 text-xs font-semibold text-white/70">Admin Portal</div>
        <p className="text-xs font-bold uppercase tracking-wider text-white/60">Trusted Logistics Partner</p>
        <h1 className="mt-3 max-w-sm text-3xl font-extrabold leading-tight text-white">
          Movement That <span className="text-orange">Connects</span> Possibilities
        </h1>
        <p className="mt-3 max-w-sm text-sm text-white/70">Manage shipments, track updates, and keep the world moving — all from one place.</p>

        <div className="mt-8 space-y-4">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white"><f.icon size={17} /></div>
              <div>
                <p className="text-sm font-bold text-white">{f.title}</p>
                <p className="text-xs text-white/60">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 border-l-2 border-orange pl-3 text-sm italic text-white/80">"Reliable. Fast. Global."</p>

        <div className="mt-6 grid grid-cols-4 gap-3 rounded-xl bg-black/20 p-4">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-sm font-extrabold text-white">{s.value}</p>
              <p className="text-[10px] text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative flex items-center justify-center bg-off-white px-4 py-12">
        <Link to="/" className="absolute left-6 top-6 text-xs font-semibold text-text-secondary">← Back to Website</Link>
        <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-panel">
          <div className="flex justify-center"><Logo /></div>
          <h2 className="mt-6 text-center text-2xl font-extrabold text-text-primary">Admin Login</h2>
          <p className="text-center text-xs text-text-muted">Sign in to access your admin dashboard</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && <ErrorBanner message={error} />}
            <Field label="Email Address">
              <Input icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@swiftship.com" required />
            </Field>
            <Field label="Password">
              <div className="relative">
                <Input icon={Lock} type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-text-secondary">
                <input type="checkbox" checked={keepSignedIn} onChange={(e) => setKeepSignedIn(e.target.checked)} className="h-4 w-4 rounded border-border text-navy" />
                Keep me signed in
              </label>
              <a href="#" className="font-semibold text-blue">Forgot password?</a>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">{loading ? 'Signing in...' : 'Sign In'}</button>
            <div className="flex items-center gap-3 text-xs text-text-muted"><span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" /></div>
            <button type="button" className="btn-outline w-full justify-center"><ShieldCheck size={16} /> Login with SSO</button>
            <p className="text-center text-[11px] text-text-muted">Restricted access. Authorized personnel only.</p>
            {/* <p className="rounded-lg bg-light-blue-bg p-2.5 text-center text-[11px] text-text-secondary">Demo: admin@swiftship.com / Admin@123</p> */}
          </form>
        </div>
      </div>
    </div>
  );
}
