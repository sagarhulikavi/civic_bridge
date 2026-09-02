import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Award, ArrowRight, Wrench, CheckCircle2, Factory, ThumbsUp, ThumbsDown, Hammer, Flag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { STATUS_LABELS } from '../../components/common/StatusTimeline';
import api from '../../services/api';

export const IndustryDashboard = () => {
  const { user } = useAuth();
  const [matchedProblems, setMatchedProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await api.get('/problems');
      if (res.success && res.data.problems) {
        setMatchedProblems(res.data.problems);
      }
    } catch (err) {
      console.error('Failed to load industry problems:', err);
    } finally {
      setLoading(false);
    }
  };

  const runAction = async (prob, action, body) => {
    try {
      setActingId(prob.id);
      setActionError(null);
      const res = await api.post(`/workflow/${prob.id}/${action}`, body);
      if (res.success) {
        await fetchProblems();
      }
    } catch (err) {
      setActionError(err.message || 'Action failed. Please try again.');
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-1 text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
          <Factory className="w-3.5 h-3.5 mr-1 text-amber-600" />
          <span>Industry CSR & Equipment Deployment Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 tracking-tight mt-2">
          {user?.organization?.name || 'Tata Steel CSR / L&T Smart Infrastructure'}
        </h1>
        <p className="text-xs text-dark-500 mt-0.5">
          Vetted civic projects ready for corporate CSR grant allocation, machinery deployment, and field engineering execution.
        </p>
      </div>

      {/* CSR & Hardware Capabilities */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-clean space-y-3">
        <h2 className="text-xs font-bold text-dark-900 uppercase tracking-wider">
          Company Hardware & CSR Capabilities
        </h2>
        <div className="flex flex-wrap gap-2">
          {['Rapid Bitumen Road Rollers', 'Direct CSR Grant Allocation', 'Acoustic Pipe Leak Scanners', 'Heavy Earthmoving Excavators', 'Prefabricated Steel Culverts'].map((item, idx) => (
            <span key={idx} className="px-3 py-1 bg-amber-50 text-amber-800 rounded-lg text-xs font-semibold border border-amber-200 flex items-center space-x-1">
              <Wrench className="w-3 h-3 mr-1 text-amber-600" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Matched CSR Opportunities */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-clean p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-dark-900 uppercase tracking-wider">
            Verified CSR & Field Repair Matches ({matchedProblems.length})
          </h2>
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
            High Priority Civic Need
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
                className="p-5 bg-surface-muted rounded-2xl border border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-300 transition"
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
                      <span className="text-[10px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {prob.category?.name || 'Road Infrastructure'}
                      </span>
                      <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                        Priority: {prob.priority}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-dark-900">{prob.title}</h3>
                    <p className="text-xs text-dark-500 line-clamp-1">
                      {prob.description || 'Verified community repair project ready for equipment support.'}
                    </p>

                    <div className="flex items-center space-x-3 text-[11px] text-dark-500 pt-1">
                      <span>Location: <b>{prob.location?.district}, Jharkhand</b></span>
                      <span>•</span>
                      <span className="text-amber-700 font-semibold">Matched for Equipment / CSR</span>
                    </div>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {STATUS_LABELS[prob.status] || prob.status}
                    </span>
                  </div>
                </div>

                    <div className="flex items-center space-x-2 self-end md:self-center">
                  {prob.status === 'INDUSTRY_REVIEW' && (
                    <>
                      <button onClick={() => runAction(prob, 'review', { decision: 'ACCEPT' })} disabled={actingId === prob.id} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 disabled:opacity-50">
                        <ThumbsUp className="w-3.5 h-3.5" /><span>Accept</span>
                      </button>
                      <button onClick={() => runAction(prob, 'review', { decision: 'DECLINE' })} disabled={actingId === prob.id} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 disabled:opacity-50">
                        <ThumbsDown className="w-3.5 h-3.5" /><span>Decline</span>
                      </button>
                    </>
                  )}
                  {prob.status === 'ACCEPTED' && (
                    <button onClick={() => runAction(prob, 'support')} disabled={actingId === prob.id} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 disabled:opacity-50">
                      <Wrench className="w-3.5 h-3.5" /><span>Support Development</span>
                    </button>
                  )}
                  {prob.status === 'PROTOTYPE_DEVELOPMENT' && (
                    <button onClick={() => runAction(prob, 'implement')} disabled={actingId === prob.id} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 disabled:opacity-50">
                      <Hammer className="w-3.5 h-3.5" /><span>Mark Implemented</span>
                    </button>
                  )}
                  {prob.status === 'IMPLEMENTED' && (
                    <button onClick={() => runAction(prob, 'resolve')} disabled={actingId === prob.id} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1 disabled:opacity-50">
                      <Flag className="w-3.5 h-3.5" /><span>Confirm Resolved</span>
                    </button>
                  )}
                  <Link to={`/problems/${prob.id}`} className="px-4 py-2 bg-white border border-surface-border hover:bg-amber-50 text-amber-700 rounded-xl text-xs font-bold transition flex items-center space-x-1">
                    <span>View</span><ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        {actionError && (
          <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {actionError}
          </p>
        )}
      </div>

    </div>
  );
};
