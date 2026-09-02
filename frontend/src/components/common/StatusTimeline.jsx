import React from 'react';
import { CheckCircle2, Clock, Sparkles, ShieldCheck, Building, Wrench, CheckCheck, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const STAGES = [
  { id: 'SUBMITTED', key: 'status_reported', icon: Clock },
  { id: 'AI_ANALYZING', key: 'status_ai_analysis', icon: Sparkles },
  { id: 'PENDING_ADMIN_REVIEW', key: 'status_admin_review', icon: ShieldCheck },
  { id: 'APPROVED', key: 'status_verified', icon: CheckCircle2 },
  { id: 'UNIVERSITY_MATCHING', key: 'status_university', icon: Building },
  { id: 'INDUSTRY_REVIEW', key: 'status_industry', icon: Wrench },
  { id: 'RESOLVED', key: 'status_resolved', icon: CheckCheck }
];

// Human-readable label for any canonical status.
export const STATUS_LABELS = {
  SUBMITTED: 'Submitted',
  AI_ANALYZING: 'AI Analyzing',
  AI_FAILED: 'AI Needs Review',
  PENDING_ADMIN_REVIEW: 'Pending Admin Review',
  NEEDS_MORE_INFORMATION: 'More Info Needed',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  UNIVERSITY_MATCHING: 'University Matching',
  UNIVERSITY_INTERESTED: 'University Interested',
  IDEA_SUBMITTED: 'Idea Submitted',
  INDUSTRY_REVIEW: 'Industry Review',
  ACCEPTED: 'Accepted',
  DECLINED: 'Declined',
  PROTOTYPE_DEVELOPMENT: 'Prototype Development',
  IMPLEMENTED: 'Implemented',
  RESOLVED: 'Resolved',
  CANCELLED: 'Cancelled'
};

const TERMINAL_BLOCKED = ['REJECTED', 'DECLINED', 'CANCELLED'];

export const getStatusIndex = (status) => {
  switch (status) {
    case 'SUBMITTED': return 0;
    case 'AI_ANALYZING':
    case 'AI_FAILED': return 1;
    case 'PENDING_ADMIN_REVIEW':
    case 'NEEDS_MORE_INFORMATION': return 2;
    case 'APPROVED': return 3;
    case 'UNIVERSITY_MATCHING':
    case 'UNIVERSITY_INTERESTED':
    case 'IDEA_SUBMITTED': return 4;
    case 'INDUSTRY_REVIEW':
    case 'ACCEPTED':
    case 'PROTOTYPE_DEVELOPMENT':
    case 'IMPLEMENTED': return 5;
    case 'RESOLVED': return 6;
    default: return 0;
  }
};

export const StatusTimeline = ({ currentStatus = 'SUBMITTED', createdAt, updatedAt }) => {
  const { t } = useLanguage();

  if (TERMINAL_BLOCKED.includes(currentStatus)) {
    return (
      <div className="p-4 bg-red-50 rounded-xl border border-red-200 flex items-center space-x-3 text-red-800 text-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
        <span>
          This problem has been <strong>{STATUS_LABELS[currentStatus] || currentStatus}</strong> and is no longer in the active workflow.
        </span>
      </div>
    );
  }

  const currentIndex = getStatusIndex(currentStatus);

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-dark-600 uppercase tracking-wider">Workflow Progress</span>
        <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
          {STATUS_LABELS[currentStatus] || currentStatus}
        </span>
      </div>

      <div className="relative">
        {/* Progress connector line */}
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-surface-border -translate-y-1/2 hidden md:block" />

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 relative">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={stage.id} className="flex flex-col items-center text-center group">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition z-10 ${
                    isCurrent
                      ? 'bg-brand-600 text-white ring-4 ring-brand-100 shadow-sm'
                      : isCompleted
                      ? 'bg-green-600 text-white'
                      : 'bg-white border-2 border-surface-border text-dark-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-xs mt-2 font-medium leading-tight ${
                    isCurrent
                      ? 'text-brand-700 font-bold'
                      : isCompleted
                      ? 'text-dark-900 font-semibold'
                      : 'text-dark-500'
                  }`}
                >
                  {t(stage.key)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
