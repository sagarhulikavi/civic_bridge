import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Calendar, Building2, GraduationCap, Sparkles, MessageSquare, 
  Share2, ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck, Users, ExternalLink, Send,
  Trash2, X, Wrench
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { StatusTimeline } from '../components/common/StatusTimeline';
import { AIAnalysisCard } from '../components/common/AIAnalysisCard';
import api from '../services/api';

export const ProblemDetails = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [joiningCollab, setJoiningCollab] = useState(false);

  // Admin Override & Delete
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overridePriority, setOverridePriority] = useState('HIGH');
  const [overrideStatus, setOverrideStatus] = useState('APPROVED');
  const [savingOverride, setSavingOverride] = useState(false);
  const [deletingProblem, setDeletingProblem] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


  useEffect(() => {
    fetchProblemDetails();
  }, [id]);

  const fetchProblemDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/problems/${id}`);
      if (res.success && res.data.problem) {
        setProblem(res.data.problem);
      }
    } catch (err) {
      console.error('Error loading problem details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setSubmittingComment(true);
      const res = await api.post(`/problems/${problem.id}/comments`, {
        content: commentText.trim()
      });
      if (res.success && res.data.comment) {
        setProblem(prev => ({
          ...prev,
          comments: [...(prev.comments || []), res.data.comment]
        }));
        setCommentText('');
      }
    } catch (err) {
      alert(err.message || 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleStartCollaboration = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      setJoiningCollab(true);
      const res = await api.post('/collaborations', {
        problemId: problem.id,
        organizationId: user.organizationId
      });
      if (res.success && res.data.collaboration) {
        navigate(`/collaborations/${res.data.collaboration.id}`);
      }
    } catch (err) {
      alert(err.message || 'Failed to enter collaboration');
    } finally {
      setJoiningCollab(false);
    }
  };

  const handleSaveOverride = async (e) => {
    e.preventDefault();
    try {
      setSavingOverride(true);
      const isStatusChange = overrideStatus && overrideStatus !== problem.status;
      const res = isStatusChange
        ? await api.patch(`/problems/${problem.id}/status`, {
            status: overrideStatus,
            priority: overridePriority,
            notes: 'Admin manual verification.'
          })
        : await api.post(`/admin/problems/${problem.id}/override`, {
            priority: overridePriority,
            notes: 'Admin manual verification.'
          });

      if (res.success) {
        setProblem(prev => ({
          ...prev,
          priority: overridePriority,
          status: overrideStatus
        }));
        setShowOverrideModal(false);
        setShowDeleteConfirm(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to update problem.');
    } finally {
      setSavingOverride(false);
    }
  };

  const handleDeleteProblem = async () => {
    try {
      setDeletingProblem(true);
      const res = await api.delete(`/admin/problems/${problem.id}`);
      if (res.success) {
        setShowOverrideModal(false);
        setShowDeleteConfirm(false);
        alert(`Problem ${problem.displayId} has been successfully deleted.`);
        navigate('/explore');
      }
    } catch (err) {
      alert(err.message || 'Failed to delete problem.');
    } finally {
      setDeletingProblem(false);
    }
  };


  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-dark-600">Retrieving problem data & AI synthesis...</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-dark-900">Problem Not Found</h2>
        <p className="text-xs text-dark-500">The requested problem reference does not exist or has been archived.</p>
        <Link to="/explore" className="inline-block px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-semibold">
          Back to Explore
        </Link>
      </div>
    );
  }

  const imageMedia = problem.media?.find(m => m.mediaType === 'IMAGE');
  const audioMedia = problem.media?.find(m => m.mediaType === 'AUDIO');
  const activeAnalysis = problem.aiAnalyses?.[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Back Link & Header */}
      <div>
        <Link to="/explore" className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-600 hover:text-brand-700 mb-3">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Problems</span>
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-dark-900 text-white">
                {problem.displayId}
              </span>
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                {problem.category?.name || 'Road Infrastructure'}
              </span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                problem.priority === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                problem.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
              }`}>
                Priority: {problem.priority} ({problem.priorityScore || 78}/100)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-dark-900 mt-2">
              {problem.title}
            </h1>
          </div>

          {/* Action Area */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Community Upvote Button */}
            <button
              onClick={async () => {
                try {
                  const res = await api.post(`/problems/${problem.id}/upvote`);
                  if (res.success && res.data.problem) {
                    setProblem(prev => ({
                      ...prev,
                      priorityScore: res.data.problem.priorityScore
                    }));
                  }
                } catch (err) {
                  console.warn('Upvote error:', err);
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-surface-muted hover:bg-surface-subtle border border-surface-border text-dark-800 text-xs font-semibold shadow-clean transition flex items-center space-x-1.5"
              title="Confirm you are also affected by this issue"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
              <span>Confirm / Upvote Issue</span>
            </button>

            {/* Share Button */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Problem link copied to clipboard!');
              }}
              className="px-3 py-2 rounded-xl bg-white hover:bg-surface-subtle border border-surface-border text-dark-700 text-xs font-medium shadow-clean transition flex items-center space-x-1"
              title="Copy shareable link"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            {(isAdmin || user?.role === 'ADMIN') && (
              <button
                onClick={() => {
                  setOverridePriority(problem.priority);
                  setOverrideStatus(problem.status);
                  setShowOverrideModal(true);
                  setShowDeleteConfirm(false);
                }}
                className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 text-xs font-bold shadow-clean transition flex items-center space-x-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Admin Override</span>
              </button>
            )}

            {(user?.role === 'UNIVERSITY' || user?.role === 'INDUSTRY') && (
              <button
                onClick={handleStartCollaboration}
                disabled={joiningCollab}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-clean transition flex items-center space-x-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Join Collaboration Workspace</span>
              </button>
            )}
            {problem.collaborations?.length > 0 && (
              <Link
                to={`/collaborations/${problem.collaborations[0].id}`}
                className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold shadow-clean transition flex items-center space-x-1.5"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>View Live Solution Room</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Status Timeline */}
      <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-clean">
        <h3 className="text-xs font-bold text-dark-900 uppercase tracking-wider mb-4">
          Problem Resolution Lifecycle
        </h3>
        <StatusTimeline
          currentStatus={problem.status}
          createdAt={problem.createdAt}
          updatedAt={problem.updatedAt}
        />
      </div>

      {/* Main Content Layout (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Evidence & Description */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Photo Media Evidence */}
          <div className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-clean">
            <div className="p-4 border-b border-surface-border flex items-center justify-between">
              <span className="text-xs font-bold text-dark-900 uppercase tracking-wider">
                Visual Evidence (Mandatory Photo)
              </span>
              <span className="text-[11px] text-dark-500">
                Uploaded: {new Date(problem.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <div className="bg-dark-900 flex items-center justify-center max-h-96 overflow-hidden">
              {imageMedia?.fileUrl ? (
                <img
                  src={imageMedia.fileUrl}
                  alt={problem.title}
                  className="w-full h-auto max-h-96 object-contain"
                />
              ) : (
                <div className="py-20 text-white/50 text-xs">Visual media attached</div>
              )}
            </div>

            {/* Optional Voice Note Player */}
            {audioMedia?.fileUrl && (
              <div className="p-4 bg-brand-50/50 border-t border-surface-border flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-dark-900 block">Citizen Voice Note</span>
                  <span className="text-[11px] text-dark-500">Recorded in vernacular dialect (Khortha/Hindi)</span>
                </div>
                <audio controls src={audioMedia.fileUrl} className="h-8" />
              </div>
            )}
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-clean space-y-3">
            <h3 className="text-xs font-bold text-dark-900 uppercase tracking-wider">
              Citizen Description & Observation
            </h3>
            <p className="text-xs sm:text-sm text-dark-800 leading-relaxed">
              {problem.description || 'No additional text description provided by reporter. Full context synthesized via visual AI perception.'}
            </p>
            <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs text-dark-500">
              <span>Reported Language: <b className="text-dark-700">{problem.originalLanguage?.toUpperCase()}</b></span>
              <span>Reporter ID: <b className="text-dark-700">{problem.reporter?.displayId || 'Anonymous Citizen'}</b></span>
            </div>
          </div>

          {/* Multimodal AI Perception Analysis Card */}
          <AIAnalysisCard
            analysis={activeAnalysis}
            priority={problem.priority}
            priorityScore={problem.priorityScore}
            priorityReasons={problem.priorityReasons}
            expertise={problem.expertise}
          />

          {/* Community Discussion / Comments */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-clean space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-dark-900 uppercase tracking-wider flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-brand-600" />
                <span>Discussion & Updates ({problem.comments?.length || 0})</span>
              </h3>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {problem.comments && problem.comments.length > 0 ? (
                problem.comments.map((c) => (
                  <div key={c.id} className="p-3 bg-surface-muted rounded-xl border border-surface-border text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-dark-900">{c.user?.name || 'Contributor'}</span>
                      <span className="text-[10px] text-dark-400">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-dark-700">{c.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-dark-500 italic py-2">No comments yet. Start the conversation below.</p>
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handlePostComment} className="flex gap-2 pt-2 border-t border-surface-border">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={isAuthenticated ? 'Write a comment or note...' : 'Sign in to add a note'}
                disabled={!isAuthenticated || submittingComment}
                className="flex-1 px-3.5 py-2 rounded-xl border border-surface-border text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-surface-subtle"
              />
              <button
                type="submit"
                disabled={!isAuthenticated || submittingComment || !commentText.trim()}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition disabled:opacity-50 flex items-center space-x-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right 1 Column: Location & Explainable Matches */}
        <div className="space-y-6">
          
          {/* Location Card */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-clean space-y-3">
            <h3 className="text-xs font-bold text-dark-900 uppercase tracking-wider flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-brand-600" />
              <span>Location Details</span>
            </h3>
            <div className="space-y-2 text-xs text-dark-700">
              {problem.location?.place && problem.location.place !== 'Not available' && (
                <div><span className="text-dark-500">Place:</span> <b className="text-dark-900">{problem.location.place}</b></div>
              )}
              {problem.location?.city && problem.location.city !== 'Not available' && problem.location.city !== problem.location.place && (
                <div><span className="text-dark-500">City / Town:</span> <b className="text-dark-900">{problem.location.city}</b></div>
              )}
              <div><span className="text-dark-500">District:</span> <b className="text-dark-900">{problem.location?.district || 'Not available'}</b></div>
              <div><span className="text-dark-500">State:</span> <b className="text-dark-900">{problem.location?.state || 'Not available'}</b></div>
              <div><span className="text-dark-500">Country:</span> <b className="text-dark-900">{problem.location?.country || 'India'}</b></div>
              {problem.location?.postalCode && problem.location.postalCode !== 'Not available' && (
                <div><span className="text-dark-500">Pincode:</span> <b className="text-dark-900">{problem.location.postalCode}</b></div>
              )}
              <div className="pt-2 border-t border-surface-border text-[11px] text-dark-500 flex flex-wrap items-center justify-between gap-1">
                <span>
                  Coordinates: <b>{problem.location?.latitude?.toFixed(4)}, {problem.location?.longitude?.toFixed(4)}</b>
                </span>
                {problem.location?.accuracy && (
                  <span className="bg-surface-subtle px-1.5 py-0.5 rounded font-medium text-dark-600">
                    ±{problem.location.accuracy}m
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Matched Universities Card */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-clean space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-dark-900 uppercase tracking-wider flex items-center space-x-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                <span>University Matches</span>
              </h3>
              <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                Domain Matched
              </span>
            </div>

            <div className="space-y-3">
              {problem.matches?.filter(m => m.organization?.type === 'UNIVERSITY').map(match => {
                const reasons = typeof match.matchReasons === 'string' ? JSON.parse(match.matchReasons) : (match.matchReasons || []);
                return (
                  <div key={match.id} className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-dark-900">{match.organization?.name}</span>
                      <span className="px-2 py-0.5 bg-indigo-600 text-white rounded font-bold text-[10px]">
                        {match.matchScore}% Match
                      </span>
                    </div>
                    {reasons.length > 0 && (
                      <ul className="space-y-1 text-[11px] text-dark-600">
                        {reasons.map((r, i) => (
                          <li key={i} className="flex items-start space-x-1">
                            <span className="text-indigo-600">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Matched Industry Partners Card */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-clean space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-dark-900 uppercase tracking-wider flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>Industry & CSR Partners</span>
              </h3>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                Deployment Ready
              </span>
            </div>

            <div className="space-y-3">
              {problem.matches?.filter(m => m.organization?.type === 'INDUSTRY').map(match => {
                const reasons = typeof match.matchReasons === 'string' ? JSON.parse(match.matchReasons) : (match.matchReasons || []);
                return (
                  <div key={match.id} className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-dark-900">{match.organization?.name}</span>
                      <span className="px-2 py-0.5 bg-amber-600 text-white rounded font-bold text-[10px]">
                        {match.matchScore}% Match
                      </span>
                    </div>
                    {reasons.length > 0 && (
                      <ul className="space-y-1 text-[11px] text-dark-600">
                        {reasons.map((r, i) => (
                          <li key={i} className="flex items-start space-x-1">
                            <span className="text-amber-600">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Admin Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 z-50 bg-dark-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-surface-border max-w-md w-full p-6 shadow-clean-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-dark-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>Admin Override ({problem.displayId})</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowOverrideModal(false);
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
                  <option value="APPROVED">Approved / Verified</option>
                  <option value="PENDING_ADMIN_REVIEW">Pending Admin Review</option>
                  <option value="NEEDS_MORE_INFORMATION">Need More Information</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div className="pt-3 border-t border-surface-border flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowOverrideModal(false);
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
                      Are you sure you want to permanently delete problem <strong>{problem.displayId}</strong>? This action cannot be undone.
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
                        onClick={handleDeleteProblem}
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
