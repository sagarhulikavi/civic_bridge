import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, Image as ImageIcon, MapPin, Mic, AlertCircle, 
  CheckCircle2, Loader2, X, Info, Navigation, RefreshCw,
  Search, Crosshair, Map as MapIcon
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { VoiceRecorder } from '../components/common/VoiceRecorder';
import { InteractiveMapPicker } from '../components/common/InteractiveMapPicker';
import api from '../services/api';

export const ReportProblem = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Media & Text State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // Location State (Starts unset until detected or selected)
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [place, setPlace] = useState('');
  const [locality, setLocality] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [postalCode, setPostalCode] = useState('');
  const [locationName, setLocationName] = useState('');
  
  // Location Search & Map State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isCoarseAccuracy, setIsCoarseAccuracy] = useState(false);

  // GPS Execution State
  const [gpsDetected, setGpsDetected] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submitStep, setSubmitStep] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const fileInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    fetchCategories();
    detectGPSLocation();

    return () => {
      if (watchIdRef.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      if (res.success && res.data?.categories) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.warn('Could not load categories list:', err);
    }
  };

  /**
   * Reverse-geocodes given lat/lng and updates all location state fields
   */
  const handleFetchAddress = async (lat, lon, acc = null) => {
    try {
      const geoRes = await api.post('/location/reverse-geocode', {
        latitude: lat,
        longitude: lon,
        accuracy: acc
      });

      if (geoRes.success && geoRes.data?.location) {
        const loc = geoRes.data.location;
        const clean = (v) => (!v || v === 'Not available' || v === 'undefined' || v === 'null' ? '' : String(v).trim());

        const resPlace = clean(loc.place);
        const resLocality = clean(loc.locality);
        const resCity = clean(loc.city);
        const resDistrict = clean(loc.district);
        const resState = clean(loc.state);
        const resCountry = clean(loc.country) || 'India';
        const resPostalCode = clean(loc.postalCode);

        setPlace(resPlace);
        setLocality(resLocality);
        setCity(resCity);
        setDistrict(resDistrict);
        setState(resState);
        setCountry(resCountry);
        setPostalCode(resPostalCode);

        const formattedName = loc.locationName || (resPlace ? `${resPlace}, ${resDistrict || resCity || resState}` : `Coordinates (${lat}, ${lon})`);
        setLocationName(formattedName);
        setLocationError(null);
      } else {
        setLocationError("Location coordinates detected, but we couldn't determine the address. Please try again or enter the location manually.");
      }
    } catch (geoErr) {
      console.warn('Reverse geocode error:', geoErr);
      setLocationError("Location coordinates detected, but we couldn't determine the address. Please try again or enter the location manually.");
    }
  };

  /**
   * High-Precision GPS Lock with Progressive Convergence
   */
  const detectGPSLocation = () => {
    if (detectingLocation) return;

    if (!navigator.geolocation) {
      setLocationError('Unable to detect your location.');
      return;
    }

    setDetectingLocation(true);
    setLocationError(null);
    setIsCoarseAccuracy(false);

    let bestPosition = null;
    let scanCount = 0;

    const finalizePosition = (pos) => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }

      if (!pos) {
        setDetectingLocation(false);
        setLocationError('Unable to detect your location.');
        return;
      }

      const lat = parseFloat(pos.coords.latitude.toFixed(6));
      const lng = parseFloat(pos.coords.longitude.toFixed(6));
      const acc = pos.coords.accuracy ? Math.round(pos.coords.accuracy) : null;

      setLatitude(lat);
      setLongitude(lng);
      setGpsAccuracy(acc);
      setGpsDetected(true);
      setDetectingLocation(false);

      if (acc && acc > 2000) {
        setIsCoarseAccuracy(true);
      }

      handleFetchAddress(lat, lng, acc);
    };

    // Progressive GPS watch to converge on best accuracy
    try {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          scanCount++;
          if (!bestPosition || (pos.coords.accuracy && pos.coords.accuracy < bestPosition.coords.accuracy)) {
            bestPosition = pos;
          }

          // If high-accuracy lock acquired (<= 50 meters) or 3 samples gathered
          if ((pos.coords.accuracy && pos.coords.accuracy <= 50) || scanCount >= 3) {
            finalizePosition(bestPosition || pos);
          }
        },
        (err) => {
          // If watch fails, try single fallback
          navigator.geolocation.getCurrentPosition(
            (pos) => finalizePosition(pos),
            (fallbackErr) => {
              setDetectingLocation(false);
              if (fallbackErr.code === 1) {
                setLocationError('Location permission denied. Please allow location access.');
              } else if (fallbackErr.code === 2) {
                setLocationError('Unable to detect your location.');
              } else if (fallbackErr.code === 3) {
                setLocationError('Location request timed out. Please try again.');
              } else {
                setLocationError('Unable to detect your location.');
              }
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
          );
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      // Auto-finalize after 3.5 seconds if still watching
      setTimeout(() => {
        if (detectingLocation && bestPosition) {
          finalizePosition(bestPosition);
        } else if (detectingLocation && watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
          setDetectingLocation(false);
        }
      }, 3500);

    } catch (e) {
      setDetectingLocation(false);
      setLocationError('Unable to detect your location.');
    }
  };

  /**
   * Search village, town, or landmark (Forward Geocoding Autocomplete)
   */
  const handleSearchQueryChange = (text) => {
    setSearchQuery(text);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (!text || text.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setSearching(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await api.get(`/location/search?q=${encodeURIComponent(text.trim())}`);
        if (res.success && res.data?.results) {
          setSearchResults(res.data.results);
          setShowSearchResults(true);
        }
      } catch (err) {
        console.warn('Search location error:', err);
      } finally {
        setSearching(false);
      }
    }, 350);
  };

  /**
   * User picks a search result from the dropdown
   */
  const handleSelectSearchResult = (item) => {
    setLatitude(item.latitude);
    setLongitude(item.longitude);
    setGpsAccuracy(null);
    setGpsDetected(true);
    setIsCoarseAccuracy(false);

    const clean = (v) => (!v || v === 'Not available' || v === 'undefined' || v === 'null' ? '' : String(v).trim());
    const resPlace = clean(item.place);
    const resLocality = clean(item.locality);
    const resCity = clean(item.city);
    const resDistrict = clean(item.district);
    const resState = clean(item.state);
    const resCountry = clean(item.country) || 'India';
    const resPostalCode = clean(item.postalCode);

    setPlace(resPlace);
    setLocality(resLocality);
    setCity(resCity);
    setDistrict(resDistrict);
    setState(resState);
    setCountry(resCountry);
    setPostalCode(resPostalCode);
    setLocationName(resPlace ? `${resPlace}, ${resDistrict || resCity || resState}` : item.displayName);

    setSearchQuery('');
    setShowSearchResults(false);
    setLocationError(null);
  };

  /**
   * User clicks or drags the pin on the interactive Leaflet map
   */
  const handleMapPinSelected = (lat, lon) => {
    setLatitude(lat);
    setLongitude(lon);
    setGpsDetected(true);
    setIsCoarseAccuracy(false);
    handleFetchAddress(lat, lon, null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowed.includes(file.type)) {
        setErrorMessage('Please select a valid image file (JPG, PNG, or WebP).');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrorMessage(null);
    }
  };

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Mandatory Image Validation
    if (!imageFile) {
      setErrorMessage('A photo is required. Please upload or capture an image of the problem before submitting.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // 2. Mandatory Location Validation
    if (!locationName.trim() && !place.trim() && !gpsDetected && (!latitude || !longitude)) {
      setErrorMessage('Location is mandatory. Please click "Take Live Location", pinpoint on the map, or enter your Landmark / Village Area.');
      const locEl = document.getElementById('location-section');
      if (locEl) locEl.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    setSubmitStep('Uploading photo and audio evidence...');

    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      if (audioBlob) {
        formData.append('audio', audioBlob, 'voice_recording.webm');
      }
      if (title.trim()) formData.append('title', title.trim());
      if (description.trim()) formData.append('description', description.trim());
      if (selectedCategoryId) formData.append('categoryId', selectedCategoryId);
      formData.append('language', language);
      
      // Complete Structured Location Details
      formData.append('latitude', latitude || 20.5937);
      formData.append('longitude', longitude || 78.9629);
      if (gpsAccuracy) formData.append('accuracy', gpsAccuracy);
      if (place.trim()) formData.append('place', place.trim());
      if (locality.trim()) formData.append('locality', locality.trim());
      if (city.trim()) formData.append('city', city.trim());
      if (district.trim()) formData.append('district', district.trim());
      if (state.trim()) formData.append('state', state.trim());
      if (country.trim()) formData.append('country', country.trim());
      if (postalCode.trim()) formData.append('postalCode', postalCode.trim());
      
      const effectiveLocName = locationName.trim() || place.trim() || `${district || 'Community Area'}, ${state || 'India'}`;
      formData.append('locationName', effectiveLocName);

      setSubmitStep('Running AI Multimodal Perception & Synthesis...');

      const response = await api.post('/problems', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.success && response.data?.problem) {
        setSubmitStep('Submitted! Awaiting admin verification...');
        setTimeout(() => {
          navigate(`/problems/${response.data.problem.id}`);
        }, 600);
      } else {
        throw new Error(response.message || 'Submission failed.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMessage(err.message || 'Failed to submit problem. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 tracking-tight">
          {t('form_title')}
        </h1>
        <p className="text-xs sm:text-sm text-dark-600">
          {t('form_subtitle')}
        </p>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 text-red-800 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
          <button onClick={() => setErrorMessage(null)} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-surface-border p-6 sm:p-8 shadow-clean space-y-6">
        
        {/* 1. MANDATORY IMAGE UPLOAD */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-dark-900 uppercase tracking-wider flex items-center space-x-1.5">
              <Camera className="w-4 h-4 text-brand-600" />
              <span>{t('upload_photo_req')}</span>
            </label>
            <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
              MANDATORY
            </span>
          </div>

          {!imagePreview ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-brand-300 hover:border-brand-500 bg-brand-50/40 hover:bg-brand-50/70 rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-white shadow-clean flex items-center justify-center text-brand-600">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-dark-900">{t('take_photo')} / {t('upload_photo')}</p>
                <p className="text-[11px] text-dark-500 mt-0.5">{t('upload_photo_sub')}</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                capture="environment"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-surface-border bg-dark-900/5 max-h-80 flex items-center justify-center">
              <img src={imagePreview} alt="Problem Preview" className="w-full h-auto max-h-80 object-contain rounded-2xl" />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-3 right-3 p-2 bg-dark-900/80 hover:bg-dark-900 text-white rounded-full backdrop-blur shadow-sm transition"
                title={t('change_photo')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* 2. OPTIONAL VOICE RECORDING */}
        <div className="space-y-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-dark-900 uppercase tracking-wider">
              {t('describe_voice')}
            </span>
            <span className="text-[11px] text-dark-500 font-medium">OPTIONAL</span>
          </div>
          <VoiceRecorder
            onAudioRecorded={(blob) => setAudioBlob(blob)}
            onAudioCleared={() => setAudioBlob(null)}
          />
        </div>

        {/* 3. OPTIONAL TEXT TITLE & DESCRIPTION */}
        <div className="space-y-4 pt-2 border-t border-surface-border">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-dark-900 uppercase tracking-wider">
              Problem Classification & Details
            </label>
            <span className="text-[11px] text-dark-500 font-medium">OPTIONAL</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-700 mb-1 flex items-center justify-between">
              <span>Category / Domain</span>
              <span className="text-[10px] text-brand-600 font-normal">AI Auto-Detect (Default)</span>
            </label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border text-xs text-dark-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="">✨ Auto-Detect with AI (Classify automatically from photo)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.nameHi ? `(${c.nameHi})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-700 mb-1">
              Short Title (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Broken water pipe / Highway pothole / Garbage heap"
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border text-xs text-dark-900 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-dark-700 mb-1">
              {t('describe_text')}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('describe_placeholder')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-surface-border text-xs text-dark-900 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              maxLength={1000}
            />
          </div>
        </div>

        {/* 4. LOCATION INFORMATION (MANDATORY) */}
        <div id="location-section" className="space-y-4 pt-2 border-t border-surface-border">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-dark-900 uppercase tracking-wider flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-brand-600" />
              <span>{t('location_title')}</span>
            </label>
            <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
              MANDATORY
            </span>
          </div>

          {/* Quick Action Button & Search Autocomplete Header */}
          <div className="p-4 bg-brand-50/40 border border-brand-200/80 rounded-2xl space-y-3.5">
            
            {/* GPS Trigger Button Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
              <div className="text-xs text-dark-700">
                <span className="font-semibold text-dark-900">Live GPS Positioning:</span>
                <span className="ml-1 text-dark-500">Detect your exact device coordinates</span>
              </div>
              <button
                type="button"
                onClick={detectGPSLocation}
                disabled={detectingLocation}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white rounded-xl text-xs font-bold shadow-clean transition flex items-center justify-center space-x-2 flex-shrink-0"
              >
                {detectingLocation ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Detecting your location...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-3.5 h-3.5" />
                    <span>{gpsDetected ? 'Re-take Live Location' : 'Take Live Location'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Instant Forward Location Search Bar */}
            <div className="relative">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-dark-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchQueryChange(e.target.value)}
                  onFocus={() => { if (searchResults.length > 0) setShowSearchResults(true); }}
                  placeholder="🔍 Search your village, town, colony, or landmark (e.g. Kittur, Mesra, Whitefield)..."
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-surface-border text-xs text-dark-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white placeholder:text-dark-400 shadow-sm"
                />
                {searching && (
                  <Loader2 className="w-3.5 h-3.5 text-brand-600 animate-spin absolute right-3" />
                )}
                {searchQuery && !searching && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setSearchResults([]); setShowSearchResults(false); }}
                    className="absolute right-3 text-dark-400 hover:text-dark-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Search Suggestions Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-surface-border rounded-xl shadow-clean-lg z-50 max-h-56 overflow-y-auto divide-y divide-surface-border">
                  {searchResults.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectSearchResult(item)}
                      className="p-2.5 hover:bg-brand-50 cursor-pointer text-xs transition flex items-start space-x-2.5"
                    >
                      <MapPin className="w-3.5 h-3.5 text-brand-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-bold text-dark-900">{item.place || item.city || 'Location'}</p>
                        <p className="text-[11px] text-dark-500 line-clamp-1">{item.displayName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Coarse Accuracy Notice (Desktop / ISP network triangulation) */}
            {isCoarseAccuracy && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-start space-x-2 text-xs text-blue-900 animate-in fade-in">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold">Desktop / ISP Network Position:</span> Your browser returned an estimated regional area (±{Math.round((gpsAccuracy || 0)/1000)} km). 
                  <span className="font-semibold text-blue-950 ml-1">Use the search box above or click on the interactive map below to pinpoint your exact street or village.</span>
                </div>
              </div>
            )}

            {/* GPS Error Banner with Try Again */}
            {locationError && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900 animate-in fade-in">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">{locationError}</span>
                </div>
                <button
                  type="button"
                  onClick={detectGPSLocation}
                  disabled={detectingLocation}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 flex-shrink-0 self-start sm:self-auto"
                >
                  <RefreshCw className={`w-3 h-3 ${detectingLocation ? 'animate-spin' : ''}`} />
                  <span>Try Again</span>
                </button>
              </div>
            )}

            {/* Structured Location Detected Card */}
            {latitude && longitude && (
              <div className="p-4 bg-green-50/90 border border-green-200 rounded-xl space-y-2.5 text-xs text-green-950 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-green-200/80 pb-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="font-bold text-green-900 text-sm">Location detected</span>
                  </div>
                  <button
                    type="button"
                    onClick={detectGPSLocation}
                    disabled={detectingLocation}
                    className="text-[11px] font-bold text-green-800 hover:text-green-950 underline flex items-center gap-1"
                    title="Update GPS coordinates"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Re-take Location</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-1 text-xs">
                  <div>
                    <span className="text-green-700 font-medium">Place:</span>{' '}
                    <b className="text-green-950">{place || locality || locationName || 'Not available'}</b>
                  </div>
                  {city && city !== place && (
                    <div>
                      <span className="text-green-700 font-medium">City / Town:</span>{' '}
                      <b className="text-green-950">{city}</b>
                    </div>
                  )}
                  <div>
                    <span className="text-green-700 font-medium">District:</span>{' '}
                    <b className="text-green-950">{district || 'Not available'}</b>
                  </div>
                  <div>
                    <span className="text-green-700 font-medium">State:</span>{' '}
                    <b className="text-green-950">{state || 'Not available'}</b>
                  </div>
                  <div>
                    <span className="text-green-700 font-medium">Country:</span>{' '}
                    <b className="text-green-950">{country || 'India'}</b>
                  </div>
                  <div>
                    <span className="text-green-700 font-medium">Pincode:</span>{' '}
                    <b className="text-green-950">{postalCode || 'Not available'}</b>
                  </div>
                  <div className="sm:col-span-2 pt-1.5 border-t border-green-200/60 text-[11px] text-green-800 flex flex-wrap items-center justify-between gap-1">
                    <span>
                      Coordinates: <b>{latitude.toFixed(6)}, {longitude.toFixed(6)}</b>
                    </span>
                    {gpsAccuracy && (
                      <span className="text-green-700 font-semibold bg-green-100 px-2 py-0.5 rounded">
                        Accuracy: ±{gpsAccuracy}m
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Interactive OpenStreetMap Map with Draggable Pinpoint */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-dark-700">
                <span className="flex items-center gap-1">
                  <MapIcon className="w-3.5 h-3.5 text-brand-600" />
                  <span>Interactive Map Pinpoint</span>
                </span>
                <span className="text-dark-500 font-normal">Click map or drag marker to set exact spot</span>
              </div>

              <InteractiveMapPicker
                latitude={latitude}
                longitude={longitude}
                accuracy={gpsAccuracy}
                onLocationSelected={handleMapPinSelected}
              />
            </div>

          </div>

          {/* Manual Location Fallback / Refinement Fields */}
          <div className="pt-2">
            <p className="text-[11px] font-semibold text-dark-500 uppercase tracking-wider mb-2">
              Manual Location Entry & Verification (Fallback)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-dark-700 mb-1">
                  Place / Landmark / Street <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={place || locationName}
                  onChange={(e) => {
                    setPlace(e.target.value);
                    setLocationName(e.target.value);
                  }}
                  placeholder="e.g. Kittur / BIT Mesra Gate 2"
                  required={!latitude || !longitude}
                  className="w-full px-3.5 py-2 rounded-lg border border-surface-border text-xs text-dark-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-dark-700 mb-1">
                  District <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Belagavi / Ranchi"
                  required
                  className="w-full px-3.5 py-2 rounded-lg border border-surface-border text-xs text-dark-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-dark-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Karnataka / Jharkhand"
                  className="w-full px-3.5 py-2 rounded-lg border border-surface-border text-xs text-dark-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-dark-700 mb-1">
                  Pincode / Postal Code
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 591115 / 835215"
                  className="w-full px-3.5 py-2 rounded-lg border border-surface-border text-xs text-dark-900 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 5. SUBMIT ACTION */}
        <div className="pt-4 border-t border-surface-border space-y-3">
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-clean-md hover:shadow-clean-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{submitStep || t('submitting')}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{t('btn_submit_problem')}</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-dark-500">
            By submitting, you confirm that this observation represents a genuine community civic issue.
          </p>
        </div>

      </form>

    </div>
  );
};
