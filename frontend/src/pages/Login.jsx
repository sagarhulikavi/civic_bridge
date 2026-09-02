import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle, ShieldCheck, GraduationCap, Building2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export const Login = () => {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.data) {
        login(res.data.user, res.data.token);
        // Redirect according to role
        switch (res.data.user.role) {
          case 'ADMIN': navigate('/dashboard/admin'); break;
          case 'UNIVERSITY': navigate('/dashboard/university'); break;
          case 'INDUSTRY': navigate('/dashboard/industry'); break;
          default: navigate('/dashboard/citizen'); break;
        }
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-clean">
          स
        </div>
        <h1 className="text-2xl font-bold text-dark-900 tracking-tight">
          Sign In to Sahyog
        </h1>
        <p className="text-xs text-dark-500">
          Access your personal or organizational civic workspace.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-800 font-medium">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-surface-border p-6 shadow-clean space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-dark-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="citizen@sahyog.in"
            className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-dark-700">Password</label>
            <Link to="/forgot-password" className="text-brand-600 hover:text-brand-700 font-medium">
              Forgot?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition shadow-clean disabled:opacity-50 flex items-center justify-center space-x-1.5 text-xs"
        >
          <LogIn className="w-4 h-4" />
          <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
        </button>

        <div className="text-center pt-2">
          <span className="text-dark-500">Don't have an account? </span>
          <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">
            Register here
          </Link>
        </div>
      </form>

      {/* Demo Credentials Quick Switcher */}
      <div className="bg-surface-muted rounded-2xl border border-surface-border p-4 text-xs space-y-2.5">
        <span className="font-bold text-dark-900 block uppercase tracking-wider text-[10px]">
          Demo Access (One-Click Testing)
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin('citizen@sahyog.in', 'Password@123')}
            className="p-2 bg-white rounded-lg border border-surface-border text-left hover:border-brand-500 transition"
          >
            <span className="font-bold text-dark-900 block flex items-center"><User className="w-3 h-3 mr-1 text-blue-600" /> Citizen</span>
            <span className="text-[10px] text-dark-500">Ramesh (Khortha)</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin('prof.sharma@bitmesra.ac.in', 'Password@123')}
            className="p-2 bg-white rounded-lg border border-surface-border text-left hover:border-indigo-500 transition"
          >
            <span className="font-bold text-dark-900 block flex items-center"><GraduationCap className="w-3 h-3 mr-1 text-indigo-600" /> University</span>
            <span className="text-[10px] text-dark-500">BIT Mesra Dept</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin('siddharth@tatasteel.com', 'Password@123')}
            className="p-2 bg-white rounded-lg border border-surface-border text-left hover:border-amber-500 transition"
          >
            <span className="font-bold text-dark-900 block flex items-center"><Building2 className="w-3 h-3 mr-1 text-amber-600" /> Industry</span>
            <span className="text-[10px] text-dark-500">Tata Steel CSR</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin('admin@sahyog.gov.in', 'Password@123')}
            className="p-2 bg-white rounded-lg border border-surface-border text-left hover:border-red-500 transition"
          >
            <span className="font-bold text-dark-900 block flex items-center"><ShieldCheck className="w-3 h-3 mr-1 text-red-600" /> Admin</span>
            <span className="text-[10px] text-dark-500">State Triage</span>
          </button>
        </div>
      </div>

    </div>
  );
};
