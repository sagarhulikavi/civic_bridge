import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

export const AccessDenied403 = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-dark-900">403 — Access Restricted</h1>
        <p className="text-xs text-dark-500">
          This portal section requires verified University, Industry, or Administrator permissions.
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
          to="/login"
          className="px-4 py-2.5 bg-white border border-surface-border text-dark-800 rounded-xl text-xs font-semibold shadow-clean transition"
        >
          Sign In with Authorized Role
        </Link>
      </div>
    </div>
  );
};
