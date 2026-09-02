import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Layers, Users, Building, 
  GitMerge, Edit3, Eye, FileText, Check, X, RefreshCw, Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Override Modal
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [overridePriority, setOverridePriority] = useState('HIGH');
  const [overrideStatus, setOverrideStatus] = useState('APPROVED');
  const [savingOverride, setSavingOverride] = useState(false);
  const [deletingProblem, setDeletingProblem] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [dashRes, probRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/problems?limit=10')
      ]);

      if (dashRes.success) {
        setStats(dashRes.data.stats);
        setAuditLogs(dashRes.data.recentAuditLogs || []);
      }
      if (probRes.success) {
        setProblems(probRes.data.problems || []);
      }
    } catch (err) {
      console.error('Error loading admin dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveOverride = async (e) => {
    e.preventDefault();
    if (!selectedProblem) return;

    try {
      setSavingOverride(true);
      const res = await api.post(`/admin/problems/${selectedProblem.id}/override`, {
        priority: overridePriority,
        status: overrideStatus,
        notes: 'Admin manual verification.'
      });

      if (res.success) {
        setSelectedProblem(null);
        setShowDeleteConfirm(false);
        fetchAdminData();
      }
    } catch (err) {
      alert(err.message || 'Failed to update problem.');
    } finally {
      setSavingOverride(false);
    }
  };

  const handleDeleteProblem = async (problemId) => {
    if (!problemId) return;

    try {
      setDeletingProblem(true);
      const res = await api.delete(`/admin/problems/${problemId}`);
      if (res.success) {
        setSelectedProblem(null);
        setShowDeleteConfirm(false);
        await fetchAdminData();
      }
    } catch (err) {
      alert(err.message || 'Failed to delete problem.');
    } finally {
      setDeletingProblem(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center space-x-1 text-xs font-bold text-red-800 bg-red-50 px-2.5 py-0.5 rounded border border-red-200">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-red-600" />
            <span>State Admin & Triage Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 tracking-tight mt-2">
            Civic Problem Triage & Moderation
          </h1>
        </div>
        <button
          onClick={fetchAdminData}
          className="px-3.5 py-2 bg-white border border-surface-border hover:bg-surface-subtle text-dark-700 rounded-xl text-xs font-semibold shadow-clean transition flex items-center space-x-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-clean">
          <span className="text-xs text-dark-500 font-medium">Total Submitted</span>
          <div className="text-2xl font-bold text-dark-900 mt-1">{stats?.totalProblems || problems.length}</div>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-clean">
          <span className="text-xs text-dark-500 font-medium">Pending Triage</span>
          <div className="text-2xl font-bold text-amber-600 mt-1">{stats?.pendingProblems || 0}</div>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-clean">
          <span className="text-xs text-dark-500 font-medium">Critical Priority</span>
          <div className="text-2xl font-bold text-red-600 mt-1">{stats?.criticalProblems || 1}</div>
        </div>
        <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-clean">
          <span className="text-xs text-dark-500 font-medium">Resolved in Field</span>
          <div className="text-2xl font-bold text-green-600 mt-1">{stats?.resolvedProblems || 0}</div>
        </div>
      </div>

      {/* Main Triage Queue */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-clean p-6 space-y-4">
        <h2 className="text-xs font-bold text-dark-900 uppercase tracking-wider">
          Problem Triage & AI Verification Queue
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-surface-border text-dark-500">
                <th className="pb-3 font-semibold">Problem ID</th>
                <th className="pb-3 font-semibold">Title & Category</th>
                <th className="pb-3 font-semibold">District</th>
                <th className="pb-3 font-semibold">AI Confidence</th>
                <th className="pb-3 font-semibold">Priority</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {problems.map((p) => (
                <tr key={p.id} className="hover:bg-surface-subtle transition">
                  <td className="py-3.5 font-bold text-dark-900">{p.displayId}</td>
                  <td className="py-3.5">
                    <div className="font-semibold text-dark-900 line-clamp-1">{p.title}</div>
                    <div className="text-[11px] text-dark-500">{p.category?.name || 'Road Infrastructure'}</div>
                  </td>
                  <td className="py-3.5 text-dark-700">{p.location?.district || 'Ranchi'}</td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      {Math.round((p.aiAnalyses?.[0]?.confidence || 0.9) * 100)}% Match
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                      p.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {p.priority}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <span className="font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded text-[11px]">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right space-x-1.5">
                    <button
                      onClick={() => {
                        setSelectedProblem(p);
                        setOverridePriority(p.priority);
                        setOverrideStatus(p.status);
                        setShowDeleteConfirm(false);
                      }}
                      className="px-2.5 py-1 bg-white border border-surface-border hover:bg-surface-muted text-dark-800 rounded font-semibold text-[11px] shadow-clean"
                    >
                      Override
                    </button>
                    <Link
                      to={`/problems/${p.id}`}
                      className="px-2.5 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded font-semibold text-[11px] inline-block shadow-clean"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Logs */}
      <div className="bg-white rounded-2xl border border-surface-border shadow-clean p-6 space-y-4">
        <h2 className="text-xs font-bold text-dark-900 uppercase tracking-wider flex items-center space-x-1.5">
          <FileText className="w-4 h-4 text-brand-600" />
          <span>Real-Time Audit Log & Triage Stream</span>
        </h2>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-2.5 bg-surface-muted rounded-xl border border-surface-border text-[11px] flex items-center justify-between text-dark-700">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-dark-900">{log.action}</span>
                <span>•</span>
                <span>Target: {log.entityType} ({log.entityId?.substring(0, 8)})</span>
              </div>
              <span className="text-dark-400">{new Date(log.createdAt).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Override Modal */}
      {selectedProblem && (
        <div className="fixed inset-0 z-50 bg-dark-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-surface-border max-w-md w-full p-6 shadow-clean-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-dark-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>Override Problem ({selectedProblem.displayId})</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedProblem(null);
                  setShowDeleteConfirm(false);
                }}
                className="text-dark-400 hover:text-dark-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleSaveOverride} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-dark-700 mb-1">Set Priority</label>
                <select
                  value={overridePriority}
                  onChange={(e) => setOverridePriority(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-surface-border bg-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-dark-700 mb-1">Set Status</label>
                <select
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-surface-border bg-white"
                >
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="APPROVED">Approved / Verified</option>
                  <option value="MATCHED">Matched</option>
                  <option value="COLLABORATION">Collaboration</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div className="pt-3 border-t border-surface-border flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProblem(null);
                    setShowDeleteConfirm(false);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-surface-border text-dark-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingOverride}
                  className="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold"
                >
                  {savingOverride ? 'Updating...' : 'Save Override'}
                </button>
              </div>
            </form>

            {/* Admin Delete Action Inside Override Modal */}
            {(isAdmin || user?.role === 'ADMIN') && (
              <div className="pt-4 border-t border-red-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      <span>Admin Delete Problem</span>
                    </h4>
                    <p className="text-[11px] text-dark-500">
                      Permanently delete this problem, its media, and AI records.
                    </p>
                  </div>
                  {!showDeleteConfirm && (
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg font-bold text-xs flex items-center space-x-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>

                {showDeleteConfirm && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2.5">
                    <p className="text-xs font-semibold text-red-800">
                      Are you sure you want to permanently delete problem <strong>{selectedProblem.displayId}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        disabled={deletingProblem}
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-2.5 py-1 bg-white border border-surface-border text-dark-700 rounded-lg text-xs font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={deletingProblem}
                        onClick={() => handleDeleteProblem(selectedProblem.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{deletingProblem ? 'Deleting...' : 'Confirm Delete'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
