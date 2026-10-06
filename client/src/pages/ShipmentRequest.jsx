import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, User, MapPin, FileText, ArrowLeft, ArrowRight, ShieldCheck, Zap, Headphones, CheckCircle2, Truck } from 'lucide-react';
import api from '../api/axios';
import Input, { Field, Textarea, Select } from '../components/Input';
import { ErrorBanner, Loading } from '../components/States';
import hero from '../public/hero-bg.png'

const steps = ['Shipment Details', 'Sender & Receiver', 'Review', 'Confirm'];

const emptyParty = { name: '', phone: '', address: '', city: '', state: '', postalCode: '', country: 'India' };

export default function ShipmentRequest() {
  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [sameAsSender, setSameAsSender] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    serviceId: '',
    packageType: '',
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    pickupDate: '',
    preferredTimeSlot: '',
    sender: emptyParty,
    receiver: emptyParty,
    specialInstructions: '',
  });

  useEffect(() => {
    api.get('/services').then((res) => setServices(res.data.data));
  }, []);

  useEffect(() => {
    if (sameAsSender) setForm((f) => ({ ...f, receiver: { ...f.sender } }));
  }, [sameAsSender]);

  const updateField = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const updateParty = (which, key, value) => setForm((f) => ({ ...f, [which]: { ...f[which], [key]: value } }));

  const validateStep1 = () => form.serviceId && form.packageType && form.weight && form.pickupDate && form.preferredTimeSlot;
  const validateStep2 = () => form.sender.name && form.sender.phone && form.sender.address && form.receiver.name && form.receiver.phone && form.receiver.address;

  const next = () => {
    setError('');
    if (step === 0 && !validateStep1()) return setError('Please fill in all required shipment details.');
    if (step === 1 && !validateStep2()) return setError('Please fill in all required sender and receiver details.');
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const { data } = await api.post('/shipments', form);
      setSuccess(data.data);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit your shipment request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <section className="bg-off-white">
        <div className="max-w-screen-2xl mx-8 grid grid-cols-1 gap-8 py-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs text-text-muted">Home &gt; Shipment Request</p>
            <p className="section-label mt-2">Shipment Request</p>
            <h1 className="mt-2 text-3xl font-extrabold text-text-primary sm:text-4xl">
              Send with <span className="text-orange">Confidence</span>
            </h1>
            <p className="mt-3 max-w-md text-sm text-text-secondary">Fill in the details below to create your shipment. We'll take care of the rest — safely, quickly, and reliably.</p>
            <div className="mt-5 flex flex-wrap gap-5 text-xs font-semibold text-text-secondary">
              <span className="flex items-center gap-1.5"><ShieldCheck size={15} className="text-blue" /> Safe & Secure</span>
              <span className="flex items-center gap-1.5"><Zap size={15} className="text-blue" /> On-Time Pickup</span>
              <span className="flex items-center gap-1.5"><Headphones size={15} className="text-blue" /> Real Support</span>
            </div>
          </div>
          <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br text-blue p-8 sm:p-6 bg-center bg-cover min-h-[400px]  max hidden justify-end lg:flex`}
            style={{ backgroundImage: `url(${hero})` }}>
            {/* <Truck size={110} className="text-navy/20" strokeWidth={1} /> */}
            {/* <img src={hero} alt="" /> */}
          </div>
        </div>
      </section>

      <section className="max-w-screen-2xl  mx-8 py-10">
        {/* Progress */}
        <div className="bg-border p-5 mb-2 flex items-center gap-2 overflow-x-auto pb-5">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${i === step ? 'bg-navy text-white' : i < step ? 'bg-light-blue-bg text-blue' : 'bg-off-white text-text-muted'}`}>
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${i <= step ? 'bg-white/20' : 'bg-white'}`}>
                  {i < step ? <CheckCircle2 size={13} /> : i + 1}
                </span>
                {s}
              </div>
              {i < steps.length - 1 && <div className="h-px w-6 bg-border sm:w-10" />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {error && <div className="mb-5"><ErrorBanner message={error} /></div>}

            {step === 0 && (
              <div className="card space-y-5 p-6">
                <div className="flex items-center gap-2 text-base font-bold text-text-primary"><Package size={18} className="text-blue" /> 1. Shipment Details</div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Service Type" required>
                    <Select value={form.serviceId} onChange={(e) => updateField('serviceId', e.target.value)}>
                      <option value="">Select a service</option>
                      {services.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </Select>
                  </Field>
                  <Field label="Package Type" required>
                    <Select value={form.packageType} onChange={(e) => updateField('packageType', e.target.value)}>
                      <option value="">Select package type</option>
                      {['Document', 'Parcel', 'Fragile', 'Bulk/Freight'].map((p) => <option key={p} value={p}>{p}</option>)}
                    </Select>
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Weight (kg)" required>
                    <Input type="number" min="0" step="0.1" placeholder="e.g. 2.5" value={form.weight} onChange={(e) => updateField('weight', e.target.value)} />
                  </Field>
                  <Field label="Dimensions (cm)" hint="Optional">
                    <div className="grid grid-cols-3 gap-2">
                      <Input placeholder="L" value={form.dimensions.length} onChange={(e) => updateField('dimensions', { ...form.dimensions, length: e.target.value })} />
                      <Input placeholder="W" value={form.dimensions.width} onChange={(e) => updateField('dimensions', { ...form.dimensions, width: e.target.value })} />
                      <Input placeholder="H" value={form.dimensions.height} onChange={(e) => updateField('dimensions', { ...form.dimensions, height: e.target.value })} />
                    </div>
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Pick-up Date" required>
                    <Input type="date" value={form.pickupDate} onChange={(e) => updateField('pickupDate', e.target.value)} />
                  </Field>
                  <Field label="Preferred Time Slot" required>
                    <Select value={form.preferredTimeSlot} onChange={(e) => updateField('preferredTimeSlot', e.target.value)}>
                      <option value="">Select time slot</option>
                      {['9:00 AM - 12:00 PM', '12:00 PM - 3:00 PM', '3:00 PM - 6:00 PM', '6:00 PM - 9:00 PM'].map((t) => <option key={t} value={t}>{t}</option>)}
                    </Select>
                  </Field>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div className="card space-y-4 p-6">
                  <div className="flex items-center gap-2 text-base font-bold text-text-primary"><User size={18} className="text-blue" /> 2. Sender Information</div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Full Name" required><Input value={form.sender.name} onChange={(e) => updateParty('sender', 'name', e.target.value)} placeholder="Enter your full name" /></Field>
                    <Field label="Phone Number" required><Input value={form.sender.phone} onChange={(e) => updateParty('sender', 'phone', e.target.value)} placeholder="Enter phone number" /></Field>
                  </div>
                  <Field label="Address" required><Textarea rows={2} value={form.sender.address} onChange={(e) => updateParty('sender', 'address', e.target.value)} placeholder="Enter complete pick-up address" /></Field>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Field label="City"><Input value={form.sender.city} onChange={(e) => updateParty('sender', 'city', e.target.value)} /></Field>
                    <Field label="State"><Input value={form.sender.state} onChange={(e) => updateParty('sender', 'state', e.target.value)} /></Field>
                    <Field label="Postal Code"><Input value={form.sender.postalCode} onChange={(e) => updateParty('sender', 'postalCode', e.target.value)} /></Field>
                  </div>
                </div>

                <div className="card space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-base font-bold text-text-primary"><MapPin size={18} className="text-blue" /> 3. Receiver Information</div>
                    <label className="flex items-center gap-2 text-xs text-text-secondary">
                      <input type="checkbox" checked={sameAsSender} onChange={(e) => setSameAsSender(e.target.checked)} className="h-4 w-4 rounded border-border text-navy" />
                      Same as sender
                    </label>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Full Name" required><Input value={form.receiver.name} onChange={(e) => updateParty('receiver', 'name', e.target.value)} placeholder="Enter receiver's full name" /></Field>
                    <Field label="Phone Number" required><Input value={form.receiver.phone} onChange={(e) => updateParty('receiver', 'phone', e.target.value)} placeholder="Enter phone number" /></Field>
                  </div>
                  <Field label="Address" required><Textarea rows={2} value={form.receiver.address} onChange={(e) => updateParty('receiver', 'address', e.target.value)} placeholder="Enter complete delivery address" /></Field>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Field label="City"><Input value={form.receiver.city} onChange={(e) => updateParty('receiver', 'city', e.target.value)} /></Field>
                    <Field label="State"><Input value={form.receiver.state} onChange={(e) => updateParty('receiver', 'state', e.target.value)} /></Field>
                    <Field label="Postal Code"><Input value={form.receiver.postalCode} onChange={(e) => updateParty('receiver', 'postalCode', e.target.value)} /></Field>
                  </div>
                </div>

                <div className="card space-y-3 p-6">
                  <div className="flex items-center gap-2 text-base font-bold text-text-primary"><FileText size={18} className="text-blue" /> 4. Additional Information</div>
                  <Field label="Special Instructions" hint="Optional">
                    <Textarea rows={2} value={form.specialInstructions} onChange={(e) => updateField('specialInstructions', e.target.value)} placeholder="e.g. Handle with care, Call before delivery, etc." />
                  </Field>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="card space-y-5 p-6">
                <h3 className="text-base font-bold text-text-primary">Review Your Shipment</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                  <div><p className="text-text-muted">Service</p><p className="font-semibold text-text-primary">{services.find((s) => s._id === form.serviceId)?.name || '—'}</p></div>
                  <div><p className="text-text-muted">Package Type</p><p className="font-semibold text-text-primary">{form.packageType}</p></div>
                  <div><p className="text-text-muted">Weight</p><p className="font-semibold text-text-primary">{form.weight} kg</p></div>
                  <div><p className="text-text-muted">Pickup</p><p className="font-semibold text-text-primary">{form.pickupDate} · {form.preferredTimeSlot}</p></div>
                  <div><p className="text-text-muted">Sender</p><p className="font-semibold text-text-primary">{form.sender.name}, {form.sender.city}</p></div>
                  <div><p className="text-text-muted">Receiver</p><p className="font-semibold text-text-primary">{form.receiver.name}, {form.receiver.city}</p></div>
                </div>
                {form.specialInstructions && (
                  <div className="text-sm"><p className="text-text-muted">Special Instructions</p><p className="font-medium text-text-primary">{form.specialInstructions}</p></div>
                )}
              </div>
            )}

            {step === 3 && success && (
              <div className="card flex flex-col items-center gap-3 p-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-success"><CheckCircle2 size={32} /></div>
                <h3 className="text-xl font-extrabold text-text-primary">Shipment Booked!</h3>
                <p className="max-w-sm text-sm text-text-secondary">Your shipment has been created successfully. Use the tracking ID below to follow its journey.</p>
                <p className="rounded-xl bg-light-blue-bg px-5 py-2.5 text-lg font-bold tracking-wide text-navy">{success.trackingNumber}</p>
                <div className="mt-2 flex gap-3">
                  <button onClick={() => navigate(`/track?id=${success.trackingNumber}`)} className="btn-primary">Track This Shipment</button>
                  <button onClick={() => navigate('/my-shipments')} className="btn-outline">View My Shipments</button>
                </div>
              </div>
            )}

            {step < 3 && (
              <div className="mt-6 flex justify-between">
                {step > 0 ? <button onClick={back} className="btn-outline"><ArrowLeft size={16} /> Back</button> : <span />}
                {step < 2 && <button onClick={next} className="btn-primary">Review Shipment <ArrowRight size={16} /></button>}
                {step === 2 && <button onClick={handleSubmit} disabled={submitting} className="btn-accent">{submitting ? 'Submitting...' : 'Confirm & Submit'}</button>}
              </div>
            )}
          </div>

          {step < 3 && (
            <div className="space-y-5">
              <div className="card p-5">
                <h4 className="text-sm font-bold text-text-primary">Why Ship with SwiftShip?</h4>
                <ul className="mt-3 space-y-3 text-xs text-text-secondary">
                  <li className="flex gap-2"><ShieldCheck size={16} className="shrink-0 text-blue" /> Reliable & Secure — your packages are in safe hands</li>
                  <li className="flex gap-2"><Zap size={16} className="shrink-0 text-blue" /> Fast Pickup — we pick up at your convenience</li>
                  <li className="flex gap-2"><MapPin size={16} className="shrink-0 text-blue" /> Pan-India Delivery — from cities to the farthest places</li>
                  <li className="flex gap-2"><Headphones size={16} className="shrink-0 text-blue" /> Dedicated Support — we're here to help, anytime</li>
                </ul>
              </div>
              <div className="card p-5">
                <h4 className="flex items-center gap-2 text-sm font-bold text-text-primary"><Headphones size={16} /> Need Help?</h4>
                <p className="mt-1.5 text-xs text-text-secondary">Our support team is ready to assist you with your shipment request.</p>
                <button className="btn-outline btn-sm mt-3 w-full justify-center">Contact Support</button>
              </div>
              <div className="rounded-2xl bg-navy p-5 text-white">
                <p className="text-sm font-bold">Every Shipment Brings People Closer</p>
                <p className="mt-1.5 text-xs text-white/70">Delivering a smarter, more connected tomorrow.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
