import React from 'react';
import { Wrench, Clock, ShieldCheck } from 'lucide-react';

export const Maintenance = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
        <Wrench className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-dark-900">Scheduled Civic Maintenance</h1>
        <p className="text-xs text-dark-500 leading-relaxed">
          The Sahyog platform is currently undergoing scheduled statewide infrastructure updates. All services will resume shortly.
        </p>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-surface-border shadow-clean text-xs text-dark-700 space-y-2">
        <div className="flex items-center justify-center space-x-2 text-amber-700 font-semibold">
          <Clock className="w-4 h-4" />
          <span>Estimated window: 15–30 minutes</span>
        </div>
        <p className="text-[11px] text-dark-400">Emergency civic issues can be reported to 1800-345-6543.</p>
      </div>
    </div>
  );
};
