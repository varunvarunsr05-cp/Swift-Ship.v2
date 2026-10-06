import { useEffect, useState } from 'react';
import api from '../../api/axios';
import Input, { Field, Select, Textarea } from '../Input';
import { ErrorBanner } from '../States';
import SlideOver from './SlideOver';

const emptyParty = { name: '', phone: '', address: '', city: '', state: '', postalCode: '', country: 'India' };

export default function ShipmentFormModal({ shipment, onClose, onSaved }) {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const isEdit = Boolean(shipment);

  const [form, setForm] = useState({
    serviceId: shipment?.serviceId?._id || shipment?.serviceId || '',
    packageType: shipment?.packageType || 'Parcel',
    weight: shipment?.weight || '',
    pickupDate: shipment?.pickupDate ? shipment.pickupDate.slice(0, 10) : '',
    sender: shipment?.sender || emptyParty,
    receiver: shipment?.receiver || emptyParty,
    specialInstructions: shipment?.specialInstructions || '',
  });

  useEffect(() => {
    api.get('/services').then((res) => setServices(res.data.data));
  }, []);

  const updateParty = (which, key, value) => setForm((f) => ({ ...f, [which]: { ...f[which], [key]: value } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEdit) {
        await api.put(`/shipments/${shipment._id}`, form);
      } else {
        await api.post('/shipments', form);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save shipment.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SlideOver title={isEdit ? 'Edit Shipment' : 'Add New Shipment'} onClose={onClose} wide>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorBanner message={error} />}
        <Field label="Service" required>
          <Select value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })} required>
            <option value="">Select a service</option>
            {services.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Package Type"><Input value={form.packageType} onChange={(e) => setForm({ ...form, packageType: e.target.value })} /></Field>
          <Field label="Weight (kg)"><Input type="number" step="0.1" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} required /></Field>
        </div>
        <Field label="Pickup Date"><Input type="date" value={form.pickupDate} onChange={(e) => setForm({ ...form, pickupDate: e.target.value })} required /></Field>

        <p className="pt-2 text-xs font-bold uppercase text-text-muted">Sender</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name"><Input value={form.sender.name} onChange={(e) => updateParty('sender', 'name', e.target.value)} required /></Field>
          <Field label="Phone"><Input value={form.sender.phone} onChange={(e) => updateParty('sender', 'phone', e.target.value)} required /></Field>
        </div>
        <Field label="Address"><Textarea rows={2} value={form.sender.address} onChange={(e) => updateParty('sender', 'address', e.target.value)} required /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="City"><Input value={form.sender.city} onChange={(e) => updateParty('sender', 'city', e.target.value)} /></Field>
          <Field label="State"><Input value={form.sender.state} onChange={(e) => updateParty('sender', 'state', e.target.value)} /></Field>
        </div>

        <p className="pt-2 text-xs font-bold uppercase text-text-muted">Receiver</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name"><Input value={form.receiver.name} onChange={(e) => updateParty('receiver', 'name', e.target.value)} required /></Field>
          <Field label="Phone"><Input value={form.receiver.phone} onChange={(e) => updateParty('receiver', 'phone', e.target.value)} required /></Field>
        </div>
        <Field label="Address"><Textarea rows={2} value={form.receiver.address} onChange={(e) => updateParty('receiver', 'address', e.target.value)} required /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="City"><Input value={form.receiver.city} onChange={(e) => updateParty('receiver', 'city', e.target.value)} /></Field>
          <Field label="State"><Input value={form.receiver.state} onChange={(e) => updateParty('receiver', 'state', e.target.value)} /></Field>
        </div>

        <Field label="Special Instructions"><Textarea rows={2} value={form.specialInstructions} onChange={(e) => setForm({ ...form, specialInstructions: e.target.value })} /></Field>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-outline flex-1 justify-center">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">{saving ? 'Saving...' : 'Save Shipment'}</button>
        </div>
      </form>
    </SlideOver>
  );
}
