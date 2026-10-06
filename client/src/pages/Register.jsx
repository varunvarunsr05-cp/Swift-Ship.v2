import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Lock, Eye, EyeOff, Truck, ShieldCheck, Package, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input, { Field } from '../components/Input';
import { ErrorBanner } from '../components/States';
import domestic from '../public/domestic.png'


const benefits = [
  { icon: Truck, title: 'Fast & Reliable', desc: 'Ship with confidence' },
  { icon: ShieldCheck, title: 'Your Data is Safe', desc: 'We value your privacy' },
  { icon: Package, title: 'Manage Shipments', desc: 'Track and view history' },
  { icon: Bell, title: 'Get Real-Time Updates', desc: 'Stay informed always' },
];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (!agree) return setError('Please agree to the Terms of Service and Privacy Policy.');

    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-64px)] grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center ml-13 justify-center  py-12 sm:px-8">
        <div className="w-full max-w-screen-2xl mx-8">
          <p className="text-xs text-text-muted">Home &gt; Register</p>
          <h1 className="mt-2 text-3xl font-extrabold text-text-primary">
            Create Your <span className="text-orange">Account</span>
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary">Join SwiftShip and start shipping with ease. Fast. Safe. Reliable.</p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            {error && <ErrorBanner message={error} />}

            <div>
              <p className="mb-3 text-sm font-bold text-text-primary">Personal Information</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Full Name" required>
                  <Input icon={User} placeholder="Enter your full name" value={form.name} onChange={update('name')} required />
                </Field>
                <Field label="Email Address" required>
                  <Input icon={Mail} type="email" placeholder="Enter your email address" value={form.email} onChange={update('email')} required />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Phone Number" required>
                  <Input icon={Phone} placeholder="Enter your phone number" value={form.phone} onChange={update('phone')} required />
                </Field>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-bold text-text-primary">Address Information</p>
              <Field label="Address" required>
                <Input icon={MapPin} placeholder="House/Building, Street, Area" value={form.address} onChange={update('address')} required />
              </Field>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <Field label="City" required>
                  <Input placeholder="Enter your city" value={form.city} onChange={update('city')} required />
                </Field>
                <Field label="State" required>
                  <Input placeholder="Enter your state" value={form.state} onChange={update('state')} required />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="PIN Code" required>
                  <Input placeholder="Enter PIN code" value={form.pincode} onChange={update('pincode')} required />
                </Field>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-bold text-text-primary">Account Security</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Password" required>
                  <div className="relative">
                    <Input icon={Lock} type={showPassword ? 'text' : 'password'} placeholder="Create a password" value={form.password} onChange={update('password')} required className="pr-10" />
                    <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </Field>
                <Field label="Confirm Password" required>
                  <Input icon={Lock} type={showPassword ? 'text' : 'password'} placeholder="Confirm your password" value={form.confirmPassword} onChange={update('confirmPassword')} required />
                </Field>
              </div>
              <p className="mt-2 rounded-lg bg-light-blue-bg p-3 text-xs text-text-secondary">
                Password must be at least 6 characters long.
              </p>
            </div>

            <label className="flex items-start gap-2.5 text-xs text-text-secondary">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border text-navy focus:ring-blue" />
              I agree to the <span className="font-semibold text-blue">Terms of Service</span> and <span className="font-semibold text-blue">Privacy Policy</span>
            </label>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="text-center text-sm text-text-secondary">
              Already have an account? <Link to="/login" className="font-semibold text-blue">Login here</Link>
            </p>
          </form>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-to-br pl-14  from-navy to-blue px-10 py-12 lg:flex lg:flex-col lg:justify-center">
        <img width='650px' src={domestic} alt="domestic-del-img" className='rounded-md mb-4' />

        <p className="text-xs font-bold uppercase tracking-wider text-white/60">Welcome to SwiftShip</p>
        <h2 className="mt-3 max-w-md text-3xl font-extrabold leading-tight text-white">
          A Smarter Way <br /> to Connect <span className="text-orange">the World</span>
        </h2>
        <p className="mt-4 max-w-sm text-sm text-white/70">Create your account and be part of a faster, safer, and more connected delivery experience.</p>

        <div className="mt-9 space-y-5">
          {benefits.map((b) => (
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
    </div>
  );
}
