import { Loader2, PackageX, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function Loading({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-text-muted">
      <Loader2 className="animate-spin text-blue" size={30} />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', description = '', icon: Icon = PackageX, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-off-white py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-light-blue-bg text-blue">
        <Icon size={26} />
      </div>
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      {description && <p className="max-w-sm text-sm text-text-muted">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', description = 'Please try again in a moment.', action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-error">
        <AlertTriangle size={26} />
      </div>
      <h3 className="text-base font-semibold text-error">{title}</h3>
      {description && <p className="max-w-sm text-sm text-text-secondary">{description}</p>}
      {action}
    </div>
  );
}

export function SuccessBanner({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-success">
      <CheckCircle2 size={18} />
      {message}
    </div>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-error">
      <AlertTriangle size={18} />
      {message}
    </div>
  );
}
