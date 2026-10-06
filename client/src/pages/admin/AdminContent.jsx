import { useEffect, useState } from 'react';
import { Plus, Image as ImageIcon, Monitor, FileText, Layers, Eye, Pencil, MoreHorizontal, UploadCloud, ExternalLink } from 'lucide-react';
import api from '../../api/axios';
import AdminLayout from '../../components/admin/AdminLayout';
import { StatCard } from '../../components/admin/AdminWidgets';
import { Loading, ErrorState, EmptyState, ErrorBanner } from '../../components/States';
import StatusBadge from '../../components/StatusBadge';
import Input, { Field, Select } from '../../components/Input';
import SlideOver from '../../components/admin/SlideOver';

const tabs = [
  { id: 'banner', label: 'Banners' },
  { id: 'gallery', label: 'Gallery Images' },
];

export default function AdminContent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('banner');
  const [panelOpen, setPanelOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [form, setForm] = useState({ title: '', link: '', displayOrder: 1, status: 'active' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchItems = () => {
    setLoading(true);
    api.get('/gallery', { params: { type: tab, status: 'all' } })
      .then((res) => setItems(res.data.data))
      .catch(() => setError('Could not load content.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, [tab]); // eslint-disable-line

  const handleUpload = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!file) return setFormError('Please choose an image to upload.');
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('title', form.title);
      fd.append('link', form.link);
      fd.append('displayOrder', form.displayOrder);
      fd.append('status', form.status);
      fd.append('type', tab);
      await api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setPanelOpen(false);
      setForm({ title: '', link: '', displayOrder: 1, status: 'active' });
      setFile(null);
      fetchItems();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Upload failed.');
    } finally {
      setSaving(false);
    }
  };

  const totalImages = items.length;
  const activeBanners = items.filter((i) => i.type === 'banner' && i.status === 'active').length;

  return (
    <AdminLayout
      title="Content & Gallery"
      subtitle="Manage website content, banners, images and other media."
      action={<button onClick={() => setPanelOpen(true)} className="btn-primary"><Plus size={16} /> Upload New</button>}
    >
      <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={ImageIcon} value={totalImages} label="Total Images" color="blue" />
        <StatCard icon={Monitor} value={activeBanners} label="Active Banners" color="green" />
        <StatCard icon={FileText} value={8} label="Pages / Sections" color="orange" />
        <StatCard icon={Eye} value="24.5K" label="Total Views" color="blue" />
      </div>

      <div className="mb-5 flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`border-b-2 px-4 py-2.5 text-sm font-semibold ${tab === t.id ? 'border-navy text-navy' : 'border-transparent text-text-muted'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && <Loading />}
      {!loading && error && <ErrorState description={error} />}
      {!loading && !error && items.length === 0 && <EmptyState icon={ImageIcon} title="No content uploaded yet" />}

      {!loading && !error && items.length > 0 && (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <img src={item.url} alt={item.title} className="h-24 w-full rounded-xl object-cover sm:w-40" />
              <div className="flex-1">
                <p className="text-sm font-bold text-text-primary">{item.title || 'Untitled'}</p>
                <StatusBadge status={item.status} />
                <p className="mt-1 text-xs text-text-muted">Updated on {new Date(item.updatedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-1.5">
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-off-white"><Pencil size={14} /></button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-text-secondary hover:bg-off-white"><MoreHorizontal size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl bg-light-blue-bg p-5 sm:flex-row">
        <p className="text-sm text-text-secondary">Keep your website fresh and engaging — update banners and content regularly.</p>
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm font-semibold text-blue">Preview Website <ExternalLink size={14} /></a>
      </div>

      {panelOpen && (
        <SlideOver title="Upload / Edit Banner" onClose={() => setPanelOpen(false)}>
          <form onSubmit={handleUpload} className="space-y-4">
            {formError && <ErrorBanner message={formError} />}
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-8 text-center hover:bg-off-white">
              <UploadCloud size={26} className="text-blue" />
              <span className="text-sm text-text-secondary">{file ? file.name : 'Drag & drop an image here, or click to browse'}</span>
              <span className="text-xs text-text-muted">PNG, JPG, WEBP (Max 5MB)</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
            </label>
            <Field label="Banner Title" required><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></Field>
            <Field label="Link" hint="Optional"><Input placeholder="e.g. /tracking or https://..." value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} /></Field>
            <Field label="Display Order"><Input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })} /></Field>
            <Field label="Status">
              <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
                <option value="inactive">Inactive</option>
              </Select>
            </Field>
            <button type="submit" disabled={saving} className="btn-primary w-full justify-center">{saving ? 'Uploading...' : 'Upload Banner'}</button>
          </form>
        </SlideOver>
      )}
    </AdminLayout>
  );
}
