import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';

export const CookieBanner = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('sahyog_cookie_consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('sahyog_cookie_consent', 'accepted');
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem('sahyog_cookie_consent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 bg-white rounded-2xl shadow-clean-lg border border-surface-border p-4 transition animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-brand-50 rounded-xl text-brand-600 flex-shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="flex-1 text-xs text-dark-700">
          <p className="font-semibold text-dark-900 mb-1">Cookie & Privacy Notice</p>
          <p className="leading-relaxed">
            DRISHTI uses essential cookies and local storage to remember your language preferences and provide secure session authentication.
          </p>
          <div className="mt-3 flex items-center space-x-2">
            <button
              onClick={handleAccept}
              className="px-3 py-1.5 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition"
            >
              Accept All
            </button>
            <button
              onClick={handleDecline}
              className="px-3 py-1.5 bg-surface-subtle text-dark-700 border border-surface-border rounded-lg font-medium hover:bg-surface-border transition"
            >
              Essential Only
            </button>
            <Link
              to="/cookies"
              className="text-brand-600 underline hover:text-brand-700 pl-1"
            >
              Learn more
            </Link>
          </div>
        </div>
        <button
          onClick={() => setShow(false)}
          className="text-dark-500 hover:text-dark-900 p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
