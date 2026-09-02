import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { PasswordInput } from '../components/common/PasswordInput';
import api from '../services/api';

export const Register = () => {
  const { login } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CITIZEN');
  const [preferredLang, setPreferredLang] = useState(language || 'en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        phone,
        password,
        role,
        preferredLanguage: preferredLang
      });

      if (res.success && res.data) {
        login(res.data.user, res.data.token);
        switch (res.data.user.role) {
          case 'UNIVERSITY': navigate('/dashboard/university'); break;
          case 'INDUSTRY': navigate('/dashboard/industry'); break;
          default: navigate('/dashboard/citizen'); break;
        }
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10 space-y-6">
      
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-dark-900 tracking-tight">
          Create a DRISHTI Account
        </h1>
        <p className="text-xs text-dark-500">
          Join the statewide civic problem-solving and engineering network.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-800 font-medium">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-surface-border p-6 shadow-clean space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-dark-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ramesh Kumar"
            className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-dark-700 mb-1">Mobile Phone (Optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9876543210"
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-dark-700 mb-1">Primary Language</label>
            <select
              value={preferredLang}
              onChange={(e) => setPreferredLang(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:ring-2 focus:ring-brand-500 bg-white outline-none"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="kh">खोरठा (Khortha)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-dark-700 mb-1">Select Your Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border focus:ring-2 focus:ring-brand-500 bg-white outline-none"
          >
            <option value="CITIZEN">Citizen (Report and Track Issues)</option>
            <option value="UNIVERSITY">University Faculty / Student Researcher</option>
            <option value="INDUSTRY">Industry & CSR Representative</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-dark-700 mb-1">Create Password</label>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition shadow-clean disabled:opacity-50 flex items-center justify-center space-x-1.5"
        >
          <UserPlus className="w-4 h-4" />
          <span>{loading ? 'Creating Account...' : 'Register'}</span>
        </button>

        <div className="text-center pt-2">
          <span className="text-dark-500">Already registered? </span>
          <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </div>
      </form>

    </div>
  );
};
