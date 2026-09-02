import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Sparkles, Building2, Wrench, ArrowRight, ShieldCheck, MapPin, CheckCircle2, Users, Layers, Award } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export const Home = () => {
  const { t } = useLanguage();
  const [recentProblems, setRecentProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await api.get('/problems?limit=4');
        if (res.success && res.data.problems) {
          setRecentProblems(res.data.problems);
        }
      } catch (err) {
        console.warn('Could not load recent problems:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <div className="space-y-16">
      
      {/* 1. Hero Section - Classic Dual-Tone White & Subtle Slate */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-xs font-semibold text-brand-700 shadow-clean">
            <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse"></span>
            <span>Civic Problem-Solving Platform for Jharkhand & Beyond</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark-900 tracking-tight leading-[1.15]">
            {t('hero_title')}
          </h1>

          <p className="text-base sm:text-lg text-dark-600 leading-relaxed font-normal">
            {t('hero_subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to="/report"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-700 shadow-clean-md transition"
            >
              <Camera className="w-4 h-4" />
              <span>{t('cta_report')}</span>
            </Link>

            <Link
              to="/explore"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-white border border-surface-border text-dark-800 font-semibold text-sm hover:bg-surface-subtle shadow-clean transition"
            >
              <span>{t('cta_explore')}</span>
              <ArrowRight className="w-4 h-4 text-dark-500" />
            </Link>
          </div>

          {/* Core Rule Callout */}
          <p className="text-xs text-dark-500 pt-2">
            📸 <span className="font-semibold text-dark-700">Photo mandatory</span> • Optional Khortha/Hindi voice & text • GPS Auto-tagging
          </p>
        </div>
      </section>

      {/* 2. How It Works (4 Clean Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-dark-900 tracking-tight">
            How Sahyog Works
          </h2>
          <p className="text-sm text-dark-600 mt-2">
            A seamless transition from citizen observation to verified engineering deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-clean hover:shadow-clean-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-dark-900">{t('step1_title')}</h3>
            <p className="text-xs text-dark-600 leading-relaxed">{t('step1_desc')}</p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-clean hover:shadow-clean-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-dark-900">{t('step2_title')}</h3>
            <p className="text-xs text-dark-600 leading-relaxed">{t('step2_desc')}</p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-clean hover:shadow-clean-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-dark-900">{t('step3_title')}</h3>
            <p className="text-xs text-dark-600 leading-relaxed">{t('step3_desc')}</p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-clean hover:shadow-clean-md transition space-y-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-dark-900">{t('step4_title')}</h3>
            <p className="text-xs text-dark-600 leading-relaxed">{t('step4_desc')}</p>
          </div>

        </div>
      </section>

      {/* 3. Live Recent Submissions Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-dark-900">Recent Community Issues</h2>
            <p className="text-xs text-dark-500 mt-1">Real reports currently undergoing AI perception and collaborative triage</p>
          </div>
          <Link to="/explore" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center">
            View all <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-64 border border-surface-border" />
            ))}
          </div>
        ) : recentProblems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProblems.map((prob) => (
              <Link
                key={prob.id}
                to={`/problems/${prob.id}`}
                className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-clean hover:shadow-clean-md transition group flex flex-col"
              >
                <div className="h-40 bg-surface-subtle relative overflow-hidden">
                  {prob.media?.[0]?.fileUrl ? (
                    <img
                      src={prob.media[0].fileUrl}
                      alt={prob.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-dark-500 text-xs">
                      Visual Evidence Attached
                    </div>
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-dark-900/80 text-white backdrop-blur">
                    {prob.displayId}
                  </span>
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-brand-600 text-white">
                    {prob.category?.name || 'Road Infrastructure'}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-dark-900 line-clamp-1 group-hover:text-brand-600 transition">
                      {prob.title}
                    </h3>
                    <p className="text-xs text-dark-500 line-clamp-2 mt-1">
                      {prob.description || 'Community issue reported with visual evidence and GPS coordinates.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-surface-border flex items-center justify-between text-[11px] text-dark-500">
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-dark-400" />
                      {prob.location?.district || 'Ranchi'}
                    </span>
                    <span className="font-semibold text-brand-600">
                      {prob.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-surface-border">
            <p className="text-sm text-dark-600">No problems reported yet. Be the first to report!</p>
            <Link to="/report" className="mt-3 inline-block px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-semibold">
              Report Problem
            </Link>
          </div>
        )}
      </section>

      {/* 4. Trust & Impact Statistics */}
      <section className="bg-white border-y border-surface-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-brand-600">100%</div>
              <div className="text-xs font-semibold text-dark-700">{t('stats_reported')} Verified</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-dark-900">&lt; 2 min</div>
              <div className="text-xs font-semibold text-dark-700">Citizen Submission Time</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-indigo-600">5+</div>
              <div className="text-xs font-semibold text-dark-700">Universities & Industry Labs</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-extrabold text-green-600">24</div>
              <div className="text-xs font-semibold text-dark-700">{t('stats_districts')} Coverage</div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
