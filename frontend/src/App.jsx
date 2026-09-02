import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CookieBanner } from './components/layout/CookieBanner';

// Pages
import { Home } from './pages/Home';
import { ReportProblem } from './pages/ReportProblem';
import { ProblemDetails } from './pages/ProblemDetails';
import { ExploreProblems } from './pages/ExploreProblems';
import { CollaborationWorkspace } from './pages/CollaborationWorkspace';
import { Support } from './pages/Support';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Terms } from './pages/Terms';
import { CookiePreferences } from './pages/CookiePreferences';
import { RefundPolicy } from './pages/RefundPolicy';
import { NotFound404 } from './pages/NotFound404';
import { AccessDenied403 } from './pages/AccessDenied403';
import { Maintenance } from './pages/Maintenance';

// Dashboards
import { CitizenDashboard } from './pages/dashboards/CitizenDashboard';
import { UniversityDashboard } from './pages/dashboards/UniversityDashboard';
import { IndustryDashboard } from './pages/dashboards/IndustryDashboard';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-dual-tone">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Core Routes */}
                <Route path="/" element={<Home />} />
                {/* Alias that forwards to the protected report route — prevents
                    accessing the report form via a non-protected /report-problem path. */}
                <Route path="/report-problem" element={<Navigate to="/report" replace />} />
                <Route
                  path="/report"
                  element={
                    <ProtectedRoute allowedRoles={['CITIZEN']}>
                      <ReportProblem />
                    </ProtectedRoute>
                  }
                />
                <Route path="/problems/:id" element={<ProblemDetails />} />
                <Route path="/explore" element={<ExploreProblems />} />
                <Route path="/collaborations/:id" element={<CollaborationWorkspace />} />
                <Route path="/support" element={<Support />} />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected Role Dashboards */}
                <Route
                  path="/dashboard/citizen"
                  element={
                    <ProtectedRoute allowedRoles={['CITIZEN', 'ADMIN']}>
                      <CitizenDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/university"
                  element={
                    <ProtectedRoute allowedRoles={['UNIVERSITY', 'ADMIN']}>
                      <UniversityDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/industry"
                  element={
                    <ProtectedRoute allowedRoles={['INDUSTRY', 'ADMIN']}>
                      <IndustryDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/admin"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Legal & Policy Pages */}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/cookies" element={<CookiePreferences />} />
                <Route path="/cookie-preferences" element={<CookiePreferences />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />

                {/* System & Error Pages */}
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/403" element={<AccessDenied403 />} />
                <Route path="/404" element={<NotFound404 />} />
                <Route path="*" element={<NotFound404 />} />
              </Routes>
            </main>
            <Footer />
            <CookieBanner />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
