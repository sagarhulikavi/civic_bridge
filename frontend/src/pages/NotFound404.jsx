import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound404 = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="text-6xl font-extrabold text-brand-600">404</div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-dark-900">Page Not Found</h1>
        <p className="text-xs text-dark-500">
          The civic record, problem link, or page you requested could not be located.
        </p>
      </div>

      <div className="flex items-center justify-center space-x-3 pt-2">
        <Link
          to="/"
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-clean transition flex items-center space-x-1.5"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/explore"
          className="px-4 py-2.5 bg-white border border-surface-border text-dark-800 rounded-xl text-xs font-semibold shadow-clean transition"
        >
          Explore Problems
        </Link>
      </div>
    </div>
  );
};
