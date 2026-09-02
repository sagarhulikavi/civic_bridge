import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Mail, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-surface-border text-dark-700 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-lg">
                स
              </div>
              <span className="text-lg font-bold text-dark-900">{t('brand_name')}</span>
            </div>
            <p className="text-xs text-dark-500 leading-relaxed">
              Empowering civic participation through AI perception and multi-stakeholder engineering collaboration between citizens, universities, and industry.
            </p>
            <div className="inline-flex items-center space-x-1.5 text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-200 font-medium">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>SIH Verified Architecture</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-dark-900 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/explore" className="hover:text-brand-600 transition">Explore Problems</Link></li>
              <li><Link to="/report" className="hover:text-brand-600 transition">Report an Issue</Link></li>
              <li><Link to="/login" className="hover:text-brand-600 transition">University Portal</Link></li>
              <li><Link to="/login" className="hover:text-brand-600 transition">Industry CSR Portal</Link></li>
            </ul>
          </div>

          {/* Col 3: Support & Contact */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-dark-900 uppercase tracking-wider">Support & Help</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/support" className="hover:text-brand-600 transition">Help Desk & Ticketing</Link></li>
              <li><Link to="/support" className="hover:text-brand-600 transition">Frequently Asked Questions</Link></li>
              <li><Link to="/support" className="hover:text-brand-600 transition">Contact Civic Authorities</Link></li>
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-dark-900 uppercase tracking-wider">Legal & Compliance</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/privacy-policy" className="hover:text-brand-600 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-600 transition">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-brand-600 transition">Cookie Policy</Link></li>
              <li><Link to="/cookie-preferences" className="hover:text-brand-600 transition">Cookie Preferences</Link></li>
              <li><Link to="/refund-policy" className="hover:text-brand-600 transition">Refund & Cancellation Policy</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-surface-border flex flex-col md:flex-row items-center justify-between text-xs text-dark-500">
          <p>© 2026 Sahyog Platform. Open Civic-Tech Architecture for Jharkhand & National Deployment.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span>Built with React, Node.js, Prisma & FastAPI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
