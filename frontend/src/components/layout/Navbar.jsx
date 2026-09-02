import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Globe, User, LogOut, Menu, X, PlusCircle, LayoutDashboard, Shield, Building2, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isUniversity, isIndustry } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserDropdownOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'ADMIN': return '/dashboard/admin';
      case 'UNIVERSITY': return '/dashboard/university';
      case 'INDUSTRY': return '/dashboard/industry';
      default: return '/dashboard/citizen';
    }
  };

  const getRoleBadge = () => {
    if (!user) return null;
    switch (user.role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
            <Shield className="w-3 h-3 mr-1" /> Admin
          </span>
        );
      case 'UNIVERSITY':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <GraduationCap className="w-3 h-3 mr-1" /> University
          </span>
        );
      case 'INDUSTRY':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Building2 className="w-3 h-3 mr-1" /> Industry
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            Citizen
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-surface-border shadow-clean">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-sm group-hover:bg-brand-700 transition">
                स
              </div>
              <div>
                <span className="text-xl font-bold text-dark-900 tracking-tight block leading-none">
                  {t('brand_name')}
                </span>
                <span className="text-[11px] text-dark-500 font-medium tracking-wide">
                  {t('brand_tagline')}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                location.pathname === '/' ? 'text-brand-600 bg-brand-50' : 'text-dark-700 hover:text-dark-900 hover:bg-surface-subtle'
              }`}
            >
              {t('nav_home')}
            </Link>
            <Link
              to="/explore"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                location.pathname === '/explore' ? 'text-brand-600 bg-brand-50' : 'text-dark-700 hover:text-dark-900 hover:bg-surface-subtle'
              }`}
            >
              {t('nav_problems')}
            </Link>
            <Link
              to="/support"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                location.pathname === '/support' ? 'text-brand-600 bg-brand-50' : 'text-dark-700 hover:text-dark-900 hover:bg-surface-subtle'
              }`}
            >
              Support
            </Link>
          </nav>

          {/* Action Area (Language Selector, Report CTA, User Menu) */}
          <div className="hidden md:flex items-center space-x-3">
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-surface-border text-xs font-semibold text-dark-700 hover:bg-surface-subtle transition"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-brand-600" />
                <span>{language === 'en' ? 'English' : language === 'hi' ? 'हिन्दी' : 'खोरठा'}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-clean-lg border border-surface-border py-1 z-50">
                  <button
                    onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-brand-50 hover:text-brand-600 ${language === 'en' ? 'text-brand-600 font-bold bg-brand-50' : 'text-dark-700'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => { setLanguage('hi'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-brand-50 hover:text-brand-600 ${language === 'hi' ? 'text-brand-600 font-bold bg-brand-50' : 'text-dark-700'}`}
                  >
                    हिन्दी (Hindi)
                  </button>
                  <button
                    onClick={() => { setLanguage('kh'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-brand-50 hover:text-brand-600 ${language === 'kh' ? 'text-brand-600 font-bold bg-brand-50' : 'text-dark-700'}`}
                  >
                    खोरठा (Khortha)
                  </button>
                </div>
              )}
            </div>

            {/* Quick Report Button */}
            <Link
              to="/report"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 shadow-sm transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t('cta_report')}</span>
            </Link>

            {/* Auth / Profile Area */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border border-surface-border hover:bg-surface-subtle transition"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left hidden lg:block">
                    <span className="text-xs font-semibold text-dark-900 block leading-none">
                      {user?.name?.split(' ')[0]}
                    </span>
                    {getRoleBadge()}
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-clean-lg border border-surface-border py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-surface-border">
                      <p className="text-xs font-semibold text-dark-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-dark-500 truncate">{user?.email}</p>
                      <div className="mt-1">{getRoleBadge()}</div>
                    </div>
                    <Link
                      to={getDashboardPath()}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs font-medium text-dark-700 hover:bg-brand-50 hover:text-brand-600"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 mr-2" />
                      {t('nav_dashboard')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-3.5 h-3.5 mr-2" />
                      {t('nav_logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-dark-700 hover:text-dark-900 border border-surface-border rounded-lg hover:bg-surface-subtle transition"
                >
                  {t('nav_login')}
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 text-xs font-semibold bg-dark-900 text-white rounded-lg hover:bg-dark-800 transition"
                >
                  {t('nav_register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              to="/report"
              className="p-2 rounded-lg bg-brand-600 text-white"
              title="Report"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-surface-border text-dark-700"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-border bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex space-x-2 py-2 border-b border-surface-border">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded text-xs font-medium ${language === 'en' ? 'bg-brand-600 text-white' : 'bg-surface-subtle text-dark-700'}`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1 rounded text-xs font-medium ${language === 'hi' ? 'bg-brand-600 text-white' : 'bg-surface-subtle text-dark-700'}`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLanguage('kh')}
              className={`px-3 py-1 rounded text-xs font-medium ${language === 'kh' ? 'bg-brand-600 text-white' : 'bg-surface-subtle text-dark-700'}`}
            >
              खोरठा
            </button>
          </div>

          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-dark-900 hover:bg-brand-50"
            >
              {t('nav_home')}
            </Link>
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-dark-900 hover:bg-brand-50"
            >
              {t('nav_problems')}
            </Link>
            <Link
              to="/report"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-semibold text-brand-600 hover:bg-brand-50"
            >
              + {t('cta_report')}
            </Link>
            <Link
              to="/support"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-dark-900 hover:bg-brand-50"
            >
              Support
            </Link>
          </div>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-surface-border space-y-2">
              <div className="px-3 py-1">
                <span className="text-sm font-bold text-dark-900">{user?.name}</span>
                <div className="mt-1">{getRoleBadge()}</div>
              </div>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium bg-brand-50 text-brand-700"
              >
                {t('nav_dashboard')}
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
              >
                {t('nav_logout')}
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-surface-border grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 border border-surface-border rounded-lg text-sm font-semibold"
              >
                {t('nav_login')}
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2 bg-dark-900 text-white rounded-lg text-sm font-semibold"
              >
                {t('nav_register')}
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
