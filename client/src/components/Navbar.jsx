import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ChevronDown, Package, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/track', label: 'Track' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur">
      <div className="max-w-screen-2xl mx-8 flex h-16 items-center justify-between gap-4">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `relative py-1 text-sm font-semibold transition-colors ${
                  isActive ? 'text-navy after:absolute after:-bottom-[21px] after:left-0 after:h-0.5 after:w-full after:bg-orange' : 'text-text-secondary hover:text-navy'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {/* <button className="rounded-full p-2 text-text-secondary hover:bg-off-white" aria-label="Search">
            <Search size={19} />
          </button> */}
          {!user ? (
            <>
              <Link to="/login" className="btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn-primary btn-sm">Register</Link>
            </>
          ) : (
            <div className="relative">
              <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2 rounded-full border border-border py-1.5 pl-1.5 pr-3 hover:bg-off-white">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                  {user.name?.slice(0, 2).toUpperCase()}
                </span>
                <span className="text-sm font-semibold text-text-primary">Hi, {user.name?.split(' ')[0]}</span>
                <ChevronDown size={15} className="text-text-muted" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-white py-1.5 shadow-panel">
                  {user.role === 'admin' ? (
                    <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-primary hover:bg-off-white">
                      <LayoutDashboard size={16} /> Admin Dashboard
                    </Link>
                  ) : (
                    <Link to="/my-shipments" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-primary hover:bg-off-white">
                      <Package size={16} /> My Shipments
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-error hover:bg-red-50">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="rounded-lg p-2 text-navy lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-white px-4 pb-5 pt-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) => `rounded-lg px-3 py-2.5 text-sm font-semibold ${isActive ? 'bg-light-blue-bg text-navy' : 'text-text-secondary'}`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            {!user ? (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="btn-outline w-full">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="btn-primary w-full">Register</Link>
              </>
            ) : (
              <>
                {user.role === 'admin' ? (
                  <Link to="/admin/dashboard" onClick={() => setOpen(false)} className="btn-outline w-full">Admin Dashboard</Link>
                ) : (
                  <Link to="/my-shipments" onClick={() => setOpen(false)} className="btn-outline w-full">My Shipments</Link>
                )}
                <button onClick={handleLogout} className="btn-ghost w-full justify-center text-error">Logout</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
