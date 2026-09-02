import React from 'react';
import { Sparkles, CheckCircle, AlertTriangle, Layers, Award, Tag } from 'lucide-react';

export const AIAnalysisCard = ({ analysis, priority, priorityScore, priorityReasons = [], expertise = [] }) => {
  if (!analysis) return null;

  const visualFeatures = analysis.visualFeatures ? (
    typeof analysis.visualFeatures === 'string' 
      ? JSON.parse(analysis.visualFeatures) 
      : analysis.visualFeatures
  ) : [];

  const reasons = Array.isArray(priorityReasons)
    ? priorityReasons
    : (typeof priorityReasons === 'string' ? JSON.parse(priorityReasons) : []);

  const confidencePercent = Math.round((analysis.confidence || 0.9) * 100);

  return (
    <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-clean">
      <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-dark-900">Multimodal AI Synthesis</h3>
            <p className="text-xs text-dark-500">Processed by DRISHTI Vision & NLP Engine v1.0</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            {confidencePercent}% Confidence
          </span>
        </div>
      </div>

      <div className="space-y-4 text-xs">
        {/* Category & Subcategory */}
        <div>
          <span className="text-dark-500 block mb-1 font-medium">Detected Category & Issue:</span>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="px-2.5 py-1 bg-brand-50 text-brand-700 rounded-lg font-semibold border border-brand-200">
              {analysis.suggestedCategory || 'Road Infrastructure'}
            </span>
            <span className="text-dark-500">›</span>
            <span className="px-2.5 py-1 bg-surface-subtle text-dark-700 rounded-lg font-medium border border-surface-border">
              {analysis.classifications?.[0]?.subcategoryName || 'Infrastructure Damage'}
            </span>
          </div>
        </div>

        {/* AI Summary */}
        <div>
          <span className="text-dark-500 block mb-1 font-medium">Visual & Contextual Evidence:</span>
          <p className="text-dark-800 bg-surface-muted p-3 rounded-xl border border-surface-border leading-relaxed">
            {analysis.summary || 'Visual evidence indicates severe asphalt erosion and traffic hazard.'}
          </p>
        </div>

        {/* Visual Features Recognized */}
        {visualFeatures.length > 0 && (
          <div>
            <span className="text-dark-500 block mb-1 font-medium">Recognized Visual Artifacts:</span>
            <div className="flex flex-wrap gap-1.5">
              {visualFeatures.map((feat, idx) => (
                <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                  <Tag className="w-3 h-3 mr-1 text-slate-500" />
                  {feat}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Priority Score & Why Breakdown */}
        <div className="pt-3 border-t border-surface-border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-dark-900">Priority Assessment ({priority || 'HIGH'})</span>
            <span className="font-bold text-brand-600">{priorityScore || 78} / 100</span>
          </div>
          {reasons.length > 0 && (
            <ul className="space-y-1 text-dark-600 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
              {reasons.map((r, i) => (
                <li key={i} className="flex items-start space-x-1.5 text-[11px]">
                  <span className="text-amber-600">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Required Expertise */}
        {expertise.length > 0 && (
          <div className="pt-3 border-t border-surface-border">
            <span className="text-dark-500 block mb-1 font-medium">Required Technical Domains:</span>
            <div className="flex flex-wrap gap-1.5">
              {expertise.map((exp, idx) => (
                <span key={idx} className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">
                  <Award className="w-3 h-3 mr-1" />
                  {exp.expertiseName || exp}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
