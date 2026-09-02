import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, CheckCircle2, Clock, MapPin, Plus, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [myProblems, setMyProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProblems();
  }, [user]);

  const fetchMyProblems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/problems', {
        params: { reporterId: user?.id }
      });
      if (res.success && res.data.problems) {
        setMyProblems(res.data.problems);
      }
    } catch (err) {
      console.error('Failed to load my problems:', err);
    } finally {
      setLoading(false);
    }
  };

  const resolvedCount = myProblems.filter(p => p.status === 'RESOLVED').length;
  const inProgressCount = myProblems.filter(p => ['COLLABORATION', 'IN_PROGRESS'].includes(p.status)).length;
  const pendingCount = myProblems.filter(p => ['SUBMITTED', 'AI_PROCESSING', 'UNDER_REVIEW'].length).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider block">
            Citizen Community Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 tracking-tight mt-1">
            Welcome back, {user?.name || 'Citizen'}
          </h1>
          <p className="text-xs text-dark-500 mt-0.5">
            Track your reported observations and monitor university & industry solution progress.
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-clean transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Problem</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-clean flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center font-bold">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-dark-500 font-medium">Total Reported</span>
            <div className="text-2xl font-bold text-dark-900">{myProblems.length}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-clean flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-dark-500 font-medium">In Collaboration</span>
            <div className="text-2xl font-bold text-dark-900">{inProgressCount}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-clean flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-dark-500 font-medium">Resolved in Field</span>
            <div className="text-2xl font-bold text-dark-900">{resolvedCount}</div>
          </div>
        </div>
      </div>

      {/* My Reports List */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-clean p-6 space-y-4">
        <h2 className="text-sm font-bold text-dark-900 uppercase tracking-wider">
          My Reported Problems ({myProblems.length})
        </h2>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2].map(n => <div key={n} className="h-20 bg-surface-subtle rounded-xl" />)}
          </div>
        ) : myProblems.length > 0 ? (
          <div className="space-y-3">
            {myProblems.map(prob => (
              <div
                key={prob.id}
                className="p-4 bg-surface-muted rounded-xl border border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-300 transition"
              >
                <div className="flex items-start space-x-3">
                  {prob.media?.[0]?.fileUrl ? (
                    <img src={prob.media[0].fileUrl} alt={prob.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-surface-subtle flex items-center justify-center text-[10px] text-dark-400">Photo</div>
                  )}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold bg-dark-900 text-white px-2 py-0.5 rounded">
                        {prob.displayId}
                      </span>
                      <span className="text-[10px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                        {prob.category?.name || 'Road Infrastructure'}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-dark-900">{prob.title}</h3>
                    <p className="text-[11px] text-dark-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {prob.location?.district}, Jharkhand • Reported on {new Date(prob.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                    prob.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                    prob.status === 'COLLABORATION' ? 'bg-indigo-100 text-indigo-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {prob.status}
                  </span>
                  <Link
                    to={`/problems/${prob.id}`}
                    className="px-3 py-1.5 bg-white border border-surface-border text-dark-800 hover:text-brand-600 rounded-lg text-xs font-semibold shadow-clean"
                  >
                    View Status
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 space-y-3">
            <p className="text-xs text-dark-500">You have not submitted any problem reports yet.</p>
            <Link to="/report" className="inline-block px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold">
              Submit Your First Problem
            </Link>
          </div>
        )}
      </div>

    </div>
  );
};
