import { X } from 'lucide-react';

export default function SlideOver({ title, onClose, children, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className={`h-full w-full ${wide ? 'max-w-lg' : 'max-w-md'} overflow-y-auto bg-white p-6 shadow-panel`}>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-text-primary">{title}</h3>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-off-white"><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
