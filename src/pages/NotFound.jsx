import { Link } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-white mb-2">404</h1>
          <p className="text-3xl font-bold text-accent">Page Not Found</p>
        </div>
        
        <p className="text-lg text-white mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:shadow-lg transition"
        >
          <Home className="w-5 h-5" />
          Back to Dashboard
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
