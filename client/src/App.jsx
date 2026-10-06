import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
// import { token1 } from './api/axios';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Track from './pages/Track';
import About from './pages/About';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Login from './pages/Login';
import ShipmentRequest from './pages/ShipmentRequest';
import ShipmentHistory from './pages/ShipmentHistory';
import ShipmentDetail from './pages/ShipmentDetail';
import NotFound from './pages/NotFound';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminShipments from './pages/admin/AdminShipments';
import AdminShipmentDetail from './pages/admin/AdminShipmentDetail';
import AdminTracking from './pages/admin/AdminTracking';
import AdminServices from './pages/admin/AdminServices';
import AdminContent from './pages/admin/AdminContent';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';

// function ScrollToTop() {
//   const { pathname } = useLocation();
//   useEffect(() => window.scrollTo(0, 0), [pathname]);
//   return null;
// }
// console.log("i am tokennnnnnnnnnn"+token1)

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public / customer-facing */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
        <Route path="/services/:id" element={<PublicLayout><ServiceDetail /></PublicLayout>} />
        <Route path="/track" element={<PublicLayout><Track /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

        <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />

        <Route
          path="/shipment-request"
          element={<PublicLayout><ProtectedRoute><ShipmentRequest /></ProtectedRoute></PublicLayout>}
        />
        <Route
          path="/my-shipments"
          element={<PublicLayout><ProtectedRoute><ShipmentHistory /></ProtectedRoute></PublicLayout>}
        />
        <Route
          path="/my-shipments/:id"
          element={<PublicLayout><ProtectedRoute><ShipmentDetail /></ProtectedRoute></PublicLayout>}
        />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/shipments" element={<ProtectedRoute adminOnly><AdminShipments /></ProtectedRoute>} />
        <Route path="/admin/shipments/:id" element={<ProtectedRoute adminOnly><AdminShipmentDetail /></ProtectedRoute>} />
        <Route path="/admin/tracking" element={<ProtectedRoute adminOnly><AdminTracking /></ProtectedRoute>} />
        <Route path="/admin/services" element={<ProtectedRoute adminOnly><AdminServices /></ProtectedRoute>} />
        <Route path="/admin/content" element={<ProtectedRoute adminOnly><AdminContent /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute adminOnly><AdminSettings /></ProtectedRoute>} />

        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </>
  );
}
