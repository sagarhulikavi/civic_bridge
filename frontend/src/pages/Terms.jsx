import React from 'react';

export const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 border-b border-surface-border pb-6">
        <h1 className="text-3xl font-bold text-dark-900 tracking-tight">Terms of Service</h1>
        <p className="text-xs text-dark-500">Effective Date: January 1, 2026</p>
      </div>

      <div className="text-dark-700 space-y-6 text-xs leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-dark-900">1. Acceptance of Terms</h2>
          <p>
            By using the Sahyog platform, you agree to comply with all applicable local, state, and national laws and use the system exclusively for lawful civic reporting and collaborative solution engineering.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-dark-900">2. User Responsibilities & Reporting Integrity</h2>
          <p>
            Users are required to submit accurate, truthful photographic evidence of community infrastructure or civic issues. Fraudulent submissions, malicious reports, or upload of prohibited materials will result in immediate account suspension.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-dark-900">3. Collaborative Intellectual Property</h2>
          <p>
            Remediation designs, laboratory studies, and technological prototypes developed in Collaboration Workspaces are intended for public benefit and open civic infrastructure improvements.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-dark-900">4. Limitation of Liability</h2>
          <p>
            Sahyog provides a coordination and AI-perception framework and is not liable for indirect damages resulting from community infrastructure failures.
          </p>
        </section>
      </div>
    </div>
  );
};
