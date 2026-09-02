import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Award, Sparkles, Building, ArrowRight, CheckCircle2, Users, Wrench } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const UniversityDashboard = () => {
  const { user } = useAuth();
  const [matchedProblems, setMatchedProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatchedProblems();
  }, []);

  const fetchMatchedProblems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/problems');
      if (res.success && res.data.problems) {
        setMatchedProblems(res.data.problems);
      }
    } catch (err) {
      console.error('Failed to load university problems:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
            <GraduationCap className="w-3.5 h-3.5 mr-1" />
            <span>Academic Research & Field Deployment Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 tracking-tight mt-2">
            {user?.organization?.name || 'BIT Mesra / IIT ISM Dhanbad'}
          </h1>
          <p className="text-xs text-dark-500 mt-0.5">
            AI-matched community engineering challenges aligned with your institutional labs and student research capabilities.
          </p>
        </div>
      </div>

      {/* Expertise Profile Highlights */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-clean space-y-3">
        <h2 className="text-xs font-bold text-dark-900 uppercase tracking-wider">
          Active Institutional Capabilities & Testing Labs
        </h2>
        <div className="flex flex-wrap gap-2">
          {['Civil & Pavement Engineering', 'Environmental Water Quality', 'IoT Sensor Prototyping', 'Structural Health Monitoring', 'Rural Soil Drainage'].map((exp, idx) => (
            <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-200 flex items-center space-x-1">
              <Award className="w-3 h-3 mr-1" />
              <span>{exp}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Matched Community Challenges */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-clean p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-dark-900 uppercase tracking-wider">
            AI-Matched Community Challenges ({matchedProblems.length})
          </h2>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
            90%+ Relevance Ranked
          </span>
        </div>

        {loading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map(n => <div key={n} className="h-24 bg-surface-subtle rounded-xl" />)}
          </div>
        ) : (
          <div className="space-y-4">
            {matchedProblems.map(prob => (
              <div
                key={prob.id}
                className="p-5 bg-surface-muted rounded-2xl border border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-300 transition"
              >
                <div className="flex items-start space-x-4">
                  {prob.media?.[0]?.fileUrl ? (
                    <img src={prob.media[0].fileUrl} alt={prob.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-surface-subtle flex items-center justify-center text-xs text-dark-400">Photo</div>
                  )}

                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold bg-dark-900 text-white px-2 py-0.5 rounded">
                        {prob.displayId}
                      </span>
                      <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {prob.category?.name || 'Road Infrastructure'}
                      </span>
                      <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
                        Priority: {prob.priority}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-dark-900">{prob.title}</h3>
                    <p className="text-xs text-dark-500 line-clamp-1">
                      {prob.description || 'Community challenge requiring civil/environmental engineering remediation.'}
                    </p>

                    <div className="flex items-center space-x-3 text-[11px] text-dark-500 pt-1">
                      <span>Location: <b>{prob.location?.district}, Jharkhand</b></span>
                      <span>•</span>
                      <span className="text-indigo-600 font-semibold">Match Score: 94% (Civil Research Lab)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end md:self-center">
                  <Link
                    to={`/problems/${prob.id}`}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1"
                  >
                    <span>View & Collaborate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
