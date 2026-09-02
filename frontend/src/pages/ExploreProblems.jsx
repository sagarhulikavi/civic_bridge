import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, MapPin, AlertCircle, PlusCircle, ArrowRight, Layers, LayoutGrid, Map as MapIcon, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export const ExploreProblems = () => {
  const { t } = useLanguage();
  const [problems, setProblems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  const JHARKHAND_DISTRICTS = [
    { name: 'Ranchi', lat: 23.3441, lng: 85.3096 },
    { name: 'Dhanbad', lat: 23.7957, lng: 86.4304 },
    { name: 'East Singhbhum', lat: 22.8046, lng: 86.2029 },
    { name: 'Bokaro', lat: 23.6693, lng: 86.1511 },
    { name: 'Hazaribagh', lat: 23.9925, lng: 85.3637 },
    { name: 'Deoghar', lat: 24.4826, lng: 86.7000 },
    { name: 'Giridih', lat: 24.1856, lng: 86.3079 },
    { name: 'Ramgarh', lat: 23.6300, lng: 85.5100 }
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProblems();
  }, [search, selectedCategory, selectedPriority, selectedDistrict]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.success && res.data.categories) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory) params.category = selectedCategory;
      if (selectedPriority) params.priority = selectedPriority;
      if (selectedDistrict) params.district = selectedDistrict;

      const res = await api.get('/problems', { params });
      if (res.success && res.data.problems) {
        setProblems(res.data.problems);
      }
    } catch (err) {
      console.error('Failed to load problems:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDistrictProblemCount = (districtName) => {
    return problems.filter(p => p.location?.district?.toLowerCase() === districtName.toLowerCase()).length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header with Title and Report CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 tracking-tight">
            Explore Community Problems
          </h1>
          <p className="text-xs sm:text-sm text-dark-600 mt-1">
            Browse verified civic challenges across Jharkhand, track remediation milestones, and explore university-industry collaborations.
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* View Toggle */}
          <div className="flex items-center bg-white border border-surface-border rounded-xl p-1 shadow-clean">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                viewMode === 'grid' ? 'bg-brand-600 text-white shadow-sm' : 'text-dark-600 hover:text-dark-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                viewMode === 'map' ? 'bg-brand-600 text-white shadow-sm' : 'text-dark-600 hover:text-dark-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>

          <Link
            to="/report"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-clean transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Problem</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-surface-border p-4 sm:p-5 shadow-clean space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search Box */}
          <div className="md:col-span-2 relative">
            <Search className="w-4 h-4 text-dark-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keyword, location, or PRB-ID..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-surface-border text-xs text-dark-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* District Filter */}
          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-surface-border text-xs text-dark-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="">All Districts (Jharkhand)</option>
              {JHARKHAND_DISTRICTS.map((d) => (
                <option key={d.name} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-surface-border text-xs text-dark-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="">All Priorities</option>
              <option value="CRITICAL">Critical Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

        </div>

        {/* Category Pill Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 border-t border-surface-border">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === '' ? 'bg-brand-600 text-white shadow-sm' : 'bg-surface-muted text-dark-700 hover:bg-surface-subtle'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat.name ? 'bg-brand-600 text-white shadow-sm' : 'bg-surface-muted text-dark-700 hover:bg-surface-subtle'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

      </div>

      {/* Main View Area */}
      {viewMode === 'map' ? (
        /* Interactive District Map View */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-clean">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-dark-900 flex items-center space-x-1.5">
                  <MapIcon className="w-4 h-4 text-brand-600" />
                  <span>Statewide Geographic Distribution (Jharkhand)</span>
                </h3>
                <p className="text-xs text-dark-500">Click any district card to filter active issues in that administrative boundary.</p>
              </div>
              <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200">
                {problems.length} Active Hotspots
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {JHARKHAND_DISTRICTS.map((dist) => {
                const count = getDistrictProblemCount(dist.name);
                const isSelected = selectedDistrict === dist.name;

                return (
                  <button
                    key={dist.name}
                    type="button"
                    onClick={() => setSelectedDistrict(isSelected ? '' : dist.name)}
                    className={`p-4 rounded-xl border text-left transition ${
                      isSelected
                        ? 'bg-brand-50 border-brand-500 shadow-sm'
                        : 'bg-surface-muted border-surface-border hover:border-brand-300 hover:bg-surface-subtle'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-dark-900">{dist.name}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        count > 0 ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {count} {count === 1 ? 'issue' : 'issues'}
                      </span>
                    </div>
                    <div className="mt-2 text-[11px] text-dark-500 flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-dark-400" />
                      <span>{dist.lat.toFixed(2)}° N, {dist.lng.toFixed(2)}° E</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtered list below map */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-dark-900 uppercase tracking-wider">
              {selectedDistrict ? `Issues in ${selectedDistrict} (${problems.length})` : `All Issues Across Districts (${problems.length})`}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {problems.map((prob) => (
                <Link
                  key={prob.id}
                  to={`/problems/${prob.id}`}
                  className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-clean hover:shadow-clean-md transition flex flex-col group"
                >
                  <div className="h-44 bg-dark-900/5 relative overflow-hidden">
                    {prob.media?.[0]?.fileUrl ? (
                      <img src={prob.media[0].fileUrl} alt={prob.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-dark-400 text-xs">Visual Proof</div>
                    )}
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold bg-dark-900/80 text-white backdrop-blur">
                      {prob.displayId}
                    </span>
                    <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                      prob.priority === 'CRITICAL' ? 'bg-red-600 text-white' :
                      prob.priority === 'HIGH' ? 'bg-orange-600 text-white' : 'bg-blue-600 text-white'
                    }`}>
                      {prob.priority}
                    </span>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                    <div>
                      <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider block">
                        {prob.category?.name || 'Road Infrastructure'}
                      </span>
                      <h4 className="text-xs font-bold text-dark-900 group-hover:text-brand-600 transition line-clamp-1">
                        {prob.title}
                      </h4>
                    </div>
                    <div className="pt-2 border-t border-surface-border flex items-center justify-between text-[11px] text-dark-500">
                      <span>{prob.location?.district}, Jharkhand</span>
                      <span className="font-semibold text-brand-600">{prob.status}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Problem Card Grid */
        loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-72 border border-surface-border" />
            ))}
          </div>
        ) : problems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems.map((prob) => (
              <Link
                key={prob.id}
                to={`/problems/${prob.id}`}
                className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-clean hover:shadow-clean-md transition flex flex-col group"
              >
                {/* Mandatory Image Thumbnail */}
                <div className="h-48 bg-dark-900/5 relative overflow-hidden">
                  {prob.media?.[0]?.fileUrl ? (
                    <img
                      src={prob.media[0].fileUrl}
                      alt={prob.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-dark-400 text-xs">
                      Visual Evidence
                    </div>
                  )}

                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-dark-900/80 text-white backdrop-blur">
                    {prob.displayId}
                  </span>

                  <span className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold ${
                    prob.priority === 'CRITICAL' ? 'bg-red-600 text-white' :
                    prob.priority === 'HIGH' ? 'bg-orange-600 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {prob.priority}
                  </span>
                </div>

                {/* Problem Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider block">
                      {prob.category?.name || 'Road Infrastructure'}
                    </span>
                    <h3 className="text-sm font-bold text-dark-900 group-hover:text-brand-600 transition line-clamp-1">
                      {prob.title}
                    </h3>
                    <p className="text-xs text-dark-500 line-clamp-2 leading-relaxed">
                      {prob.description || 'Societal observation captured with photo evidence.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs text-dark-500">
                    <span className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-dark-400" />
                      {prob.location?.district || 'Ranchi'}
                    </span>
                    <span className="font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                      {prob.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-surface-border space-y-3">
            <Layers className="w-10 h-10 text-dark-400 mx-auto" />
            <h3 className="text-sm font-bold text-dark-900">No matching problems found</h3>
            <p className="text-xs text-dark-500">Try adjusting your filters or search keywords.</p>
          </div>
        )
      )}

    </div>
  );
};
