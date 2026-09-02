import React from 'react';
import { CheckCircle2, Clock, Sparkles, Building, Wrench, CheckCheck, AlertCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const STAGES = [
  { id: 'SUBMITTED', key: 'status_reported', icon: Clock },
  { id: 'AI_PROCESSING', key: 'status_ai_analysis', icon: Sparkles },
  { id: 'APPROVED', key: 'status_verified', icon: CheckCircle2 },
  { id: 'MATCHED', key: 'status_matching', icon: Building },
  { id: 'COLLABORATION', key: 'status_collaboration', icon: Building },
  { id: 'IN_PROGRESS', key: 'status_solution', icon: Wrench },
  { id: 'RESOLVED', key: 'status_resolved', icon: CheckCheck }
];

export const StatusTimeline = ({ currentStatus = 'SUBMITTED', createdAt, updatedAt }) => {
  const { t } = useLanguage();

  const getStatusIndex = (status) => {
    switch (status) {
      case 'SUBMITTED': return 0;
      case 'AI_PROCESSING': return 1;
      case 'UNDER_REVIEW': return 1;
      case 'APPROVED': return 2;
      case 'MATCHED': return 3;
      case 'COLLABORATION': return 4;
      case 'IN_PROGRESS': return 5;
      case 'RESOLVED': return 6;
      case 'DUPLICATE': return -1;
      default: return 0;
    }
  };

  const currentIndex = getStatusIndex(currentStatus);

  if (currentStatus === 'DUPLICATE') {
    return (
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-center space-x-3 text-amber-800 text-sm">
        <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600" />
        <span>This problem has been identified as a duplicate and merged into an existing active issue.</span>
      </div>
    );
  }

  return (
    <div className="py-4">
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
