import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 border-b border-surface-border pb-6">
        <div className="inline-flex items-center space-x-1 text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-0.5 rounded border border-green-200">
          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
          <span>Official Privacy Policy</span>
        </div>
        <h1 className="text-3xl font-bold text-dark-900 tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-dark-500">Effective Date: January 1, 2026 • Last Updated: August 31, 2026</p>
      </div>

      <div className="prose prose-sm text-dark-700 space-y-6 text-xs leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-dark-900">1. Information We Collect</h2>
          <p>
            Sahyog collects observations submitted by citizens solely for the purpose of identifying and resolving public societal problems. This includes photographic evidence (mandatory), audio recordings, text descriptions, and geolocation coordinates.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-dark-900">2. Role of Artificial Intelligence & Computer Vision</h2>
          <p>
            Uploaded photos and audio are processed via automated multimodal artificial intelligence perception engines to classify damage severity and domain requirements. No biometric facial recognition or private profiling is conducted.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-dark-900">3. Information Sharing with Universities & Industry</h2>
          <p>
            Problem details, photographic evidence, and general geographical locations are shared with verified academic institutions (e.g. BIT Mesra, IIT ISM Dhanbad) and industrial CSR partners solely to design and deploy remediation solutions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-dark-900">4. Data Security & Retention</h2>
          <p>
            All submitted records are encrypted in transit via TLS 1.3 and stored securely with role-based access control. Audit logs track all modifications and administrative triage actions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-dark-900">5. Contact Data Protection Officer</h2>
          <p>
            For inquiries regarding your data or to request record removal, contact: <b>privacy@sahyog.gov.in</b>.
          </p>
        </section>
      </div>
    </div>
  );
};
