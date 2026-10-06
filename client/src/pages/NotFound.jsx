import { Link } from 'react-router-dom';
import { PackageX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-app flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-light-blue-bg text-blue"><PackageX size={30} /></div>
      <h1 className="text-3xl font-extrabold text-text-primary">404 — Page Not Found</h1>
      <p className="max-w-sm text-sm text-text-secondary">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary">Back to Home</Link>
    </div>
  );
}