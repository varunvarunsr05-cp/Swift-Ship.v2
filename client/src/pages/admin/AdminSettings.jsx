import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/admin/AdminLayout';
import Input, { Field } from '../../components/Input';
import { SuccessBanner } from '../../components/States';

export default function AdminSettings() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <AdminLayout title="Settings" subtitle="Manage your admin account preferences.">
      <div className="max-w-lg card p-6">
        <h3 className="text-base font-bold text-text-primary">Admin Profile</h3>
        {saved && <div className="mt-3"><SuccessBanner message="Settings saved successfully." /></div>}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Field label="Full Name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="Email"><Input value={user?.email || ''} disabled /></Field>
          <button type="submit" className="btn-primary">Save Changes</button>
        </form>
      </div>
    </AdminLayout>
  );
}
