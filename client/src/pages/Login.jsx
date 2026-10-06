import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Package, Settings, ShieldCheck, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input, { Field } from '../components/Input';
import { ErrorBanner } from '../components/States';

const bullets = [
  { icon: Package, title: 'Track Your Shipments', desc: 'Get real-time updates' },
  { icon: Settings, title: 'Manage Your Requests', desc: 'View and track history' },
  { icon: ShieldCheck, title: 'Secure & Reliable', desc: 'Your data is always safe' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      const from = location.state?.from?.pathname;
      navigate(from || (user.role === 'admin' ? '/admin/dashboard' : '/'));
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-navy to-blue px-10 py-16 lg:flex lg:flex-col lg:justify-center">
        <p className="text-xs font-bold uppercase tracking-wider text-white/60">Welcome Back</p>
        <h2 className="mt-3 max-w-sm text-3xl font-extrabold leading-tight text-white">
          Log In to Keep <span className="text-orange">Moving</span>
        </h2>
        <p className="mt-4 max-w-sm text-sm text-white/70">
          Access your account to track shipments, manage requests, and enjoy a faster, smarter shipping experience.
        </p>
        <div className="mt-9 space-y-5">
          {bullets.map((b) => (
            <div key={b.title} className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
                <b.icon size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{b.title}</p>
                <p className="text-xs text-white/60">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <Truck size={130} className="absolute bottom-6 right-6 text-white/10" strokeWidth={0.9} />
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <p className="text-xs text-text-muted">Home &gt; Login</p>
          <h1 className="mt-2 text-3xl font-extrabold text-text-primary">Welcome Back</h1>
          <p className="mt-1.5 text-sm text-text-secondary">Log in to your SwiftShip account</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {error && <ErrorBanner message={error} />}
            <Field label="Email Address" required>
              <Input icon={Mail} type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Field>
            <Field label="Password" required>
              <div className="relative">
                <Input icon={Lock} type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </Field>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-text-secondary">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 rounded border-border text-navy focus:ring-blue" />
                Remember me
              </label>
              <a href="#" className="font-semibold text-blue">Forgot Password?</a>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Logging in...' : 'Log In'}
            </button>
            <p className="text-center text-sm text-text-secondary">
              Don't have an account? <Link to="/register" className="font-semibold text-blue">Register here</Link>
            </p>
            <p className="text-center text-xs text-text-muted">
              Administrator? <Link to="/admin/login" className="font-semibold text-blue">Admin login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
