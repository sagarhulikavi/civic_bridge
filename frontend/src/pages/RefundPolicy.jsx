import React from 'react';

export const RefundPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2 border-b border-surface-border pb-6">
        <h1 className="text-3xl font-bold text-dark-900 tracking-tight">Refund & Cancellation Policy</h1>
        <p className="text-xs text-dark-500">Effective Date: January 1, 2026</p>
      </div>

      <div className="text-dark-700 space-y-6 text-xs leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-dark-900">1. Civic Public Service Statement</h2>
          <p>
            DRISHTI is a civic-tech public interest platform developed for crowdsourcing and collaborative engineering resolution of societal problems. There are no fees charged to citizens for reporting problems, recording audio, or viewing status progress.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-dark-900">2. CSR Grant Contributions & Corporate Sponsorships</h2>
          <p>
            Institutional and industrial partners pledging CSR funds for material deployment, contractor equipment, or university laboratory research stipends are bound by formal bilateral Memoranda of Understanding (MoUs) executed with respective municipal corporations or academic institutions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-dark-900">3. Contact Inquiries</h2>
          <p>
            For financial compliance inquiries or CSR allocation documentation, contact: <b>csr-grants@drishti.gov.in</b>.
          </p>
        </section>
      </div>
    </div>
  );
};
