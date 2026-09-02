import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowLeft, AlertCircle } from 'lucide-react';
import api from '../services/api';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to dispatch reset instructions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <Link to="/login" className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Sign In</span>
      </Link>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-dark-900 tracking-tight">
          Reset Your Password
        </h1>
        <p className="text-xs text-dark-500">
          Enter your registered email address to receive password recovery instructions.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-clean text-center space-y-4 text-xs">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-dark-900">Recovery Instructions Sent</h3>
          <p className="text-dark-600 leading-relaxed">
            If an account is associated with <b>{email}</b>, we have dispatched a secure recovery link.
          </p>
          <Link to="/login" className="inline-block px-4 py-2 bg-brand-600 text-white rounded-xl font-bold shadow-clean">
            Return to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-surface-border p-6 shadow-clean space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-dark-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-clean transition disabled:opacity-50 flex items-center justify-center space-x-1.5"
          >
            <Mail className="w-4 h-4" />
            <span>{loading ? 'Dispatching...' : 'Send Reset Link'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
