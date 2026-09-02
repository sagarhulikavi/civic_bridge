import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, GraduationCap, Users, Wrench, CheckCircle2, ArrowLeft, 
  Clock, Plus, ShieldCheck, FileText, Send, CheckCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const CollaborationWorkspace = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [collab, setCollab] = useState(null);
  const [loading, setLoading] = useState(true);

  // New Milestone Form
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDesc, setUpdateDesc] = useState('');
  const [progressPercent, setProgressPercent] = useState(50);
  const [stage, setStage] = useState('TESTING');
  const [savingUpdate, setSavingUpdate] = useState(false);

  useEffect(() => {
    fetchCollab();
  }, [id]);

  const fetchCollab = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/collaborations/${id}`);
      if (res.success && res.data.collaboration) {
        setCollab(res.data.collaboration);
      }
    } catch (err) {
      console.error('Error fetching collaboration workspace:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogProgress = async (e) => {
    e.preventDefault();
    if (!updateTitle.trim()) return;

    const currentSolution = collab.solutions?.[0];
    if (!currentSolution) return;

    try {
      setSavingUpdate(true);
      const res = await api.post(`/collaborations/${collab.id}/solutions/${currentSolution.id}/updates`, {
        title: updateTitle.trim(),
        description: updateDesc.trim(),
        progressPercentage: parseInt(progressPercent, 10),
        stage
      });

      if (res.success) {
        setShowMilestoneModal(false);
        setUpdateTitle('');
        setUpdateDesc('');
        fetchCollab();
      }
    } catch (err) {
      alert(err.message || 'Failed to log progress update.');
    } finally {
      setSavingUpdate(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-dark-600">Entering Collaboration Workspace...</p>
      </div>
    );
  }

  if (!collab) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-3">
        <h2 className="text-xl font-bold text-dark-900">Workspace Not Found</h2>
        <Link to="/explore" className="text-xs text-brand-600 underline">Back to Explore</Link>
      </div>
    );
  }

  const solution = collab.solutions?.[0];
  const progress = solution?.progressPercentage || 20;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header & Breadcrumb */}
      <div>
        <Link
          to={`/problems/${collab.problemId}`}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-600 hover:text-brand-700 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Problem Details ({collab.problem?.displayId})</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                ACTIVE COLLABORATION ROOM
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-dark-900 text-white">
                {collab.problem?.displayId}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-dark-900 mt-2">
              {solution?.title || 'Joint Engineering & Remediation Plan'}
            </h1>
            <p className="text-xs text-dark-500 mt-1">
              Target Problem: {collab.problem?.title} ({collab.problem?.location?.district}, Jharkhand)
            </p>
          </div>

          <button
            onClick={() => setShowMilestoneModal(true)}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-clean transition flex items-center space-x-1.5 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Log Milestone Progress</span>
          </button>
        </div>
      </div>

      {/* Progress Bar Card */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-clean space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-brand-600" />
            <div>
              <h3 className="text-sm font-bold text-dark-900">Overall Solution Progress</h3>
              <p className="text-xs text-dark-500">Current Stage: <span className="font-bold text-brand-600">{solution?.status || 'DESIGN'}</span></p>
            </div>
          </div>
          <span className="text-2xl font-extrabold text-brand-600">{progress}%</span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-surface-subtle h-3.5 rounded-full overflow-hidden border border-surface-border">
          <div
            className={`h-full transition-all duration-500 ${
              progress >= 100 ? 'bg-green-600' : 'bg-brand-600'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid grid-cols-4 text-center text-[11px] font-semibold text-dark-600 pt-1">
          <span className={progress >= 20 ? 'text-brand-600' : ''}>1. Design (20%)</span>
          <span className={progress >= 50 ? 'text-brand-600' : ''}>2. Testing (50%)</span>
          <span className={progress >= 80 ? 'text-brand-600' : ''}>3. Deploy (80%)</span>
          <span className={progress >= 100 ? 'text-green-600 font-bold' : ''}>4. Resolved (100%)</span>
        </div>
      </div>

      {/* 2 Column Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Milestone Updates Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-clean space-y-4">
            <h3 className="text-xs font-bold text-dark-900 uppercase tracking-wider flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>Milestone Action Log & Engineering Updates</span>
            </h3>

            <div className="space-y-4 pt-2">
              {solution?.updates && solution.updates.length > 0 ? (
                solution.updates.map((upd) => (
                  <div key={upd.id} className="p-4 bg-surface-muted rounded-xl border border-surface-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-dark-900 text-xs">{upd.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                        {upd.progressPercentage}% Completed
                      </span>
                    </div>
                    <p className="text-xs text-dark-700 leading-relaxed">{upd.description}</p>
                    <div className="pt-2 border-t border-surface-border flex items-center justify-between text-[11px] text-dark-500">
                      <span>Logged by: <b className="text-dark-800">{upd.updatedBy?.name || 'Partner Member'}</b> ({upd.updatedBy?.role})</span>
                      <span>{new Date(upd.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-dark-500 italic py-4">No updates logged yet. Log the first milestone using the button above.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Team Roster & Artifacts */}
        <div className="space-y-6">
          
          {/* Active Members Roster */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-clean space-y-4">
            <h3 className="text-xs font-bold text-dark-900 uppercase tracking-wider flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-brand-600" />
              <span>Collaboration Roster</span>
            </h3>

            <div className="space-y-2.5">
              {collab.members?.map((m) => (
                <div key={m.id} className="p-3 bg-surface-muted rounded-xl border border-surface-border flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-dark-900 block">{m.user?.name || 'Partner Member'}</span>
                    <span className="text-[11px] text-dark-500">{m.organization?.name || m.user?.role}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Problem Summary */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-clean space-y-3 text-xs">
            <h3 className="font-bold text-dark-900 uppercase tracking-wider">Problem Snapshot</h3>
            <div className="space-y-1.5 text-dark-700">
              <div><span className="text-dark-500">Category:</span> <b className="text-dark-900">{collab.problem?.category?.name || 'Road Infrastructure'}</b></div>
              <div><span className="text-dark-500">Location:</span> <b className="text-dark-900">{collab.problem?.location?.district}, Jharkhand</b></div>
              <div><span className="text-dark-500">Priority:</span> <b className="text-brand-600">{collab.problem?.priority}</b></div>
            </div>
            {collab.problem?.media?.[0]?.fileUrl && (
              <img src={collab.problem.media[0].fileUrl} alt="Problem thumbnail" className="w-full h-32 object-cover rounded-xl mt-2" />
            )}
          </div>

        </div>

      </div>

      {/* Milestone Modal */}
      {showMilestoneModal && (
        <div className="fixed inset-0 z-50 bg-dark-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-surface-border max-w-lg w-full p-6 shadow-clean-lg space-y-4">
            <h3 className="text-base font-bold text-dark-900">Log Milestone Progress</h3>
            
            <form onSubmit={handleLogProgress} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-dark-700 mb-1">Milestone Title</label>
                <input
                  type="text"
                  required
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                  placeholder="e.g. Completed Bitumen Patching and Drainage Redirection"
                  className="w-full px-3 py-2 rounded-lg border border-surface-border focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-dark-700 mb-1">Technical Notes / Remediations</label>
                <textarea
                  rows={3}
                  value={updateDesc}
                  onChange={(e) => setUpdateDesc(e.target.value)}
                  placeholder="Detail the materials deployed, labor, or laboratory test results..."
                  className="w-full px-3 py-2 rounded-lg border border-surface-border focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-dark-700 mb-1">Progress (%)</label>
                  <select
                    value={progressPercent}
                    onChange={(e) => setProgressPercent(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-lg border border-surface-border focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value={20}>20% (Design)</option>
                    <option value={50}>50% (Testing)</option>
                    <option value={80}>80% (Implementation)</option>
                    <option value={100}>100% (Fully Resolved)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-dark-700 mb-1">Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-surface-border focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="DESIGN">Design</option>
                    <option value="TESTING">Testing</option>
                    <option value="IMPLEMENTATION">Implementation</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-border flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowMilestoneModal(false)}
                  className="px-4 py-2 rounded-lg border border-surface-border text-dark-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingUpdate}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold"
                >
                  {savingUpdate ? 'Saving...' : 'Submit Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
