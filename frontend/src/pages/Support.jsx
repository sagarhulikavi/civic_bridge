import React, { useState } from 'react';
import { HelpCircle, Mail, Phone, MessageSquare, Send, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../services/api';

const FAQS = [
  {
    q: 'Why is an image required for every problem submission?',
    a: 'Photographs provide objective, unforgeable visual proof of physical distress (such as pothole dimensions or pipeline leaks), enabling our Multimodal AI vision engine to extract features and eliminate fraudulent reports.'
  },
  {
    q: 'Can I submit problem descriptions in Khortha or Hindi?',
    a: 'Yes! Sahyog has built-in vernacular Automatic Speech Recognition (ASR) and multilingual NLP specifically calibrated for Khortha, Hindi, and Indian English dialects.'
  },
  {
    q: 'How do universities get matched with civic problems?',
    a: 'Our intelligence service matches required engineering domains (e.g. Pavement Engineering, Hydrology) with verified university departments and testing laboratories like BIT Mesra and IIT (ISM) Dhanbad.'
  },
  {
    q: 'How can industries deploy CSR funds for repairs?',
    a: 'Corporate partners can review vetted engineering scopes on the Industry Portal and directly sponsor materials, equipment deployment, or contractor execution.'
  }
];

export const Support = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Technical Issue');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [ticketResult, setTicketResult] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/support', {
        email,
        subject,
        category,
        description
      });
      if (res.success && res.data.ticket) {
        setTicketResult(res.data.ticket);
        setEmail('');
        setSubject('');
        setDescription('');
      }
    } catch (err) {
      alert(err.message || 'Failed to submit support ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 tracking-tight">
          Help Desk & Community Support
        </h1>
        <p className="text-xs sm:text-sm text-dark-600">
          Have a question about reporting, AI verification, or university-industry collaborations? We are here to assist you.
        </p>
      </div>

      {/* 2 Column Support Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Col: Support Ticket Form */}
        <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-clean space-y-4">
          <h2 className="text-xs font-bold text-dark-900 uppercase tracking-wider flex items-center space-x-1.5">
            <MessageSquare className="w-4 h-4 text-brand-600" />
            <span>Submit a Support Request</span>
          </h2>

          {ticketResult ? (
            <div className="p-5 bg-green-50 rounded-xl border border-green-200 text-center space-y-2 text-xs">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
              <h3 className="font-bold text-dark-900 text-sm">Ticket Raised Successfully</h3>
              <p className="text-dark-600">
                Your Reference Ticket ID is <b className="text-green-800">{ticketResult.displayId}</b>. Our civic support desk will reach out within 24 hours.
              </p>
              <button
                onClick={() => setTicketResult(null)}
                className="mt-2 px-3 py-1.5 bg-green-600 text-white rounded-lg font-semibold"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-dark-700 mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-surface-border focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-dark-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-surface-border focus:ring-2 focus:ring-brand-500 bg-white outline-none"
                  >
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="Problem Submission Query">Problem Submission</option>
                    <option value="University Partnership">University Query</option>
                    <option value="Industry / CSR Inquiry">Industry / CSR</option>
                    <option value="Data Privacy">Data Privacy</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-dark-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief summary..."
                    className="w-full px-3 py-2 rounded-xl border border-surface-border focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-dark-700 mb-1">Message Description</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide all relevant details regarding your inquiry..."
                  className="w-full px-3 py-2 rounded-xl border border-surface-border focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold shadow-clean transition disabled:opacity-50 flex items-center justify-center space-x-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Submitting...' : 'Submit Support Ticket'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Col: FAQs & Helpline */}
        <div className="space-y-6">
          
          {/* Emergency & Direct Helplines */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-clean space-y-3">
            <h2 className="text-xs font-bold text-dark-900 uppercase tracking-wider">
              Official Civic Assistance
            </h2>
            <div className="space-y-2 text-xs text-dark-700">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-brand-600" />
                <span>State Civic Helpline: <b>1800-345-6543 (Toll Free)</b></span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-brand-600" />
                <span>Email Support: <b>support@sahyog.gov.in</b></span>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-clean space-y-3">
            <h2 className="text-xs font-bold text-dark-900 uppercase tracking-wider flex items-center space-x-1.5">
              <HelpCircle className="w-4 h-4 text-brand-600" />
              <span>Frequently Asked Questions</span>
            </h2>

            <div className="space-y-2 pt-1">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="border border-surface-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    className="w-full p-3 text-left font-semibold text-xs text-dark-900 bg-surface-muted flex items-center justify-between"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? <ChevronUp className="w-4 h-4 text-dark-500" /> : <ChevronDown className="w-4 h-4 text-dark-500" />}
                  </button>
                  {openFaq === idx && (
                    <div className="p-3 bg-white text-xs text-dark-600 leading-relaxed border-t border-surface-border">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
