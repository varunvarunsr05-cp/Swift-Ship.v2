export function Field({ label, required, error, hint, children }) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-text-primary">
          {label} {required && <span className="text-error">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1 text-xs text-text-muted">{hint}</p>}
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}

export default function Input({ icon: Icon, className = '', ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />}
      <input className={`input-field ${Icon ? 'pl-10' : ''} ${className}`} {...props} />
    </div>
  );
}

export function Textarea({ className = '', ...props }) {
  return <textarea className={`input-field resize-none ${className}`} {...props} />;
}

export function Select({ icon: Icon, className = '', children, ...props }) {
  return (
    <div className="relative">
      {Icon && <Icon size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />}
      <select className={`input-field appearance-none ${Icon ? 'pl-10' : ''} ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
}
