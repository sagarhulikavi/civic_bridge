import React, { useState, useEffect } from 'react';
import { Cookie, CheckCircle2 } from 'lucide-react';

export const CookiePreferences = () => {
  const [essential, setEssential] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('sahyog_cookie_consent');
    if (consent === 'accepted') {
      setAnalytics(true);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('sahyog_cookie_consent', analytics ? 'accepted' : 'essential');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 border-b border-surface-border pb-6">
        <h1 className="text-3xl font-bold text-dark-900 tracking-tight">Cookie Preferences & Settings</h1>
        <p className="text-xs text-dark-500">Manage how cookies and local caching are used during your browsing session.</p>
      </div>

      {saved && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-800 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>Your cookie preferences have been successfully updated.</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-clean space-y-6 text-xs">
        {/* Essential */}
        <div className="flex items-start justify-between space-x-4">
          <div className="space-y-1">
            <h3 className="font-bold text-dark-900 text-sm">Essential Storage (Required)</h3>
            <p className="text-dark-600 leading-relaxed">
              Required for session management, token security, language switcher state, and core platform functionality. Cannot be disabled.
            </p>
          </div>
          <input type="checkbox" checked disabled className="h-4 w-4 rounded text-brand-600 cursor-not-allowed" />
        </div>

        {/* Performance / Diagnostics */}
        <div className="pt-4 border-t border-surface-border flex items-start justify-between space-x-4">
          <div className="space-y-1">
            <h3 className="font-bold text-dark-900 text-sm">Performance & AI Telemetry (Optional)</h3>
            <p className="text-dark-600 leading-relaxed">
              Enables anonymous telemetry metrics on AI inference response times and UI load latency to optimize statewide deployment.
            </p>
          </div>
          <input
            type="checkbox"
            checked={analytics}
            onChange={(e) => setAnalytics(e.target.checked)}
            className="h-4 w-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
          />
        </div>

        <div className="pt-4 border-t border-surface-border flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-clean transition text-xs"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};
