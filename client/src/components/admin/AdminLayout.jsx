import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, MapPin, Layers, Image, Users, Settings,
  Search, Bell, ChevronDown, LogOut, Menu, X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import WhiteLogo from '../WhiteLogo';


const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/shipments', label: 'Shipments', icon: Package },
  { to: '/admin/tracking', label: 'Tracking Updates', icon: MapPin },
  { to: '/admin/services', label: 'Services', icon: Layers },
  { to: '/admin/content', label: 'Content & Gallery', icon: Image },
  { to: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminLayout({ children, title, subtitle, action }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-w-screen bg-off-white">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy px-4 py-6 transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-1">
          <WhiteLogo light size="sm" />
          <button className="text-white lg:hidden" onClick={() => setSidebarOpen(false)}><X size={20} /></button>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/admin/settings"
            className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold ${isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
          >
            <Settings size={18} /> Settings
          </NavLink>
        </nav>

        <div className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-blue to-navy p-4 text-white">
          <p className="font-serif italic leading-snug">People<br />Packages<br />Possibilities</p>
        </div>

        <button onClick={handleLogout} className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-white/20 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10">
          <LogOut size={16} /> Logout
        </button>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-border bg-white px-4 py-3 sm:px-6">
          <button className="text-navy lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={22} /></button>
          <div className="relative hidden flex-1 max-w-md sm:block">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input placeholder="Search shipments, services, or anything..." className="w-full rounded-xl border border-border bg-off-white py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue/20" />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <button className="relative rounded-full p-2 text-text-secondary hover:bg-off-white">
              <Bell size={19} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-error" />
            </button>
            <div className="relative">
              <button onClick={() => setMenuOpen((v) => !v)} className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-light-blue-bg text-sm font-bold text-navy">
                  {user?.name?.slice(0, 2).toUpperCase() || 'AS'}
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-sm font-semibold text-text-primary leading-tight">{user?.name || 'Admin'}</span>
                  <span className="block text-xs text-text-muted leading-tight">System Administrator</span>
                </span>
                <ChevronDown size={15} className="hidden text-text-muted sm:block" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-white py-1.5 shadow-panel">
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-error hover:bg-red-50">
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          {(title || action) && (
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium text-text-muted">Dashboard {title ? `> ${title}` : ''}</p>
                <h1 className="mt-1 text-2xl font-extrabold text-text-primary sm:text-3xl">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-text-secondary">{subtitle}</p>}
              </div>
              {action}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
