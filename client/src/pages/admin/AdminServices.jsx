import { useEffect, useState } from 'react';
import { Search, Filter, Plus, Pencil, Trash2, MoreHorizontal, Layers, CheckCircle2, PauseCircle, Clock3, Package, Zap, Plane, Truck, FileText, Shield, Undo2, MapPin } from 'lucide-react';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { StatCard, Pagination } from '../../components/admin/AdminWidgets';
import { Loading, ErrorState, EmptyState, ErrorBanner } from '../../components/States';
import StatusBadge from '../../components/StatusBadge';
import Input, { Field, Select, Textarea } from '../../components/Input';
import SlideOver from '../../components/admin/SlideOver';

const icons = ['package', 'zap', 'plane', 'truck', 'file', 'shield', 'undo', 'pin'];
const iconMap = { package: Package, zap: Zap, plane: Plane, truck: Truck, file: FileText, shield: Shield, undo: Undo2, pin: MapPin };
const emptyForm = { name: '', description: '', deliveryTime: '', icon: 'package', status: 'active' };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchServices = () => {
    setLoading(true);
    api.get('/services', { params: { search } })
      .then((res) => setServices(res.data.data))
      .catch(() => setError('Could not load services.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { const t = setTimeout(fetchServices, 300); return () => clearTimeout(t); }, [search]); // eslint-disable-line

  const openAdd = () => { setEditing(null); setForm(emptyForm); setFormError(''); setPanelOpen(true); };
  const openEdit = (s) => { setEditing(s); setForm({ name: s.name, description: s.description, deliveryTime: s.deliveryTime, icon: s.icon, status: s.status }); setFormError(''); setPanelOpen(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service? This cannot be undone.')) return;
    await api.delete(`/services/${id}`);
    fetchServices();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    try {
      if (editing) await api.put(`/services/${editing._id}`, form);
      else await api.post('/services', form);
      setPanelOpen(false);
      fetchServices();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save service.');
    } finally {
      setSaving(false);
    }
  };

  const total = services.length;
  const active = services.filter((s) => s.status === 'active').length;
  const inactive = services.filter((s) => s.status === 'inactive').length;
  const review = services.filter((s) => s.status === 'under_review').length;

  return (
    <AdminLayout
      title="Services"
      subtitle="Manage your shipping and logistics services. Add, edit or deactivate services."
      action={<button onClick={openAdd} className="btn-primary"><Plus size={16} /> Add New Service</button>}
    >
      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Layers} value={total} label="Total Services" color="blue" />
        <StatCard icon={CheckCircle2} value={active} label="Active Services" color="green" />
        <StatCard icon={PauseCircle} value={inactive} label="Inactive Service" color="orange" />
        <StatCard icon={Clock3} value={review} label="Under Review" color="red" />
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="lg:col-span-2">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by service name or description..." className="input-field pl-10" />
          </div>
          <button className="btn-outline"><Filter size={15} /> Filter</button>
        </div>

        {loading && <Loading />}
        {!loading && error && <ErrorState description={error} />}
        {!loading && !error && services.length === 0 && <EmptyState title="No services yet" />}
        {!loading && !error && services.length > 0 && (
          <div className="card overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border bg-off-white text-left text-xs font-bold uppercase text-text-muted">
                  <th className="px-4 py-3">#</th><th className="px-4 py-3">Service Name</th><th className="px-4 py-3">Description</th><th className="px-4 py-3">Delivery Time</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s, i) => {
                  const Icon = iconMap[s.icon] || Package;
                  return (
                    <tr key={s._id} className="border-b border-border last:border-0 hover:bg-off-white/60">
                      <td className="px-4 py-3 text-text-muted">{i + 1}</td>
                      <td className="px-4 py-3"><span className="flex items-center gap-2 font-semibold text-blue"><Icon size={15} /> {s.name}</span></td>
                      <td className="max-w-xs px-4 py-3 text-text-secondary">{s.description}</td>
                      <td className="px-4 py-3">{s.deliveryTime}</td>
                      <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          <button onClick={() => openEdit(s)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-off-white"><Pencil size={14} /></button>
                          <button onClick={() => handleDelete(s._id)} className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-error hover:bg-red-50"><Trash2 size={14} /></button>
                          <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-off-white"><MoreHorizontal size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {panelOpen && (
          <SlideOver title={editing ? 'Edit Service' : 'Add New Service'} onClose={() => setPanelOpen(false)}>
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && <ErrorBanner message={formError} />}
              <Field label="Service Name" required><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></Field>
              <Field label="Description" required><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></Field>
              <Field label="Delivery Time" required><Input placeholder="e.g. 3 - 5 business days" value={form.deliveryTime} onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })} required /></Field>
              <Field label="Service Icon">
                <div className="flex flex-wrap gap-2">
                  {icons.map((ic) => {
                    const Icon = iconMap[ic];
                    return (
                      <button type="button" key={ic} onClick={() => setForm({ ...form, icon: ic })} className={`flex h-10 w-10 items-center justify-center rounded-xl border ${form.icon === ic ? 'border-navy bg-light-blue-bg text-navy' : 'border-border text-text-muted'}`}>
                        <Icon size={17} />
                      </button>
                    );
                  })}
                </div>
              </Field>
              <Field label="Status">
                <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="under_review">Under Review</option>
                </Select>
              </Field>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setPanelOpen(false)} className="btn-outline flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">{saving ? 'Saving...' : 'Save Service'}</button>
              </div>
            </form>
          </SlideOver>
        )}
      </div>
      </div>
    </AdminLayout>
  );
}
