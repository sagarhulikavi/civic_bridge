import axios from 'axios';

/**
 * Service to perform reverse geocoding via OpenStreetMap Nominatim API
 * with custom User-Agent, timeout, validation, and address standardizer.
 */
export async function reverseGeocode(latitude, longitude, accuracy = null) {
  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  const acc = accuracy !== null && accuracy !== undefined ? Math.round(parseFloat(accuracy)) : null;

  // 1. Coordinates validation
  if (isNaN(lat) || isNaN(lon)) {
    throw new Error('Invalid coordinates: Latitude and Longitude must be valid numbers.');
  }

  if (lat < -90 || lat > 90) {
    throw new Error('Invalid latitude: Must be between -90 and 90 degrees.');
  }

  if (lon < -180 || lon > 180) {
    throw new Error('Invalid longitude: Must be between -180 and 180 degrees.');
  }

  try {
    const url = 'https://nominatim.openstreetmap.org/reverse';
    const response = await axios.get(url, {
      params: {
        format: 'jsonv2',
        lat: lat.toFixed(6),
        lon: lon.toFixed(6),
        zoom: 18,
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'Sahyog-Societal-Portal/1.0 (contact@sahyog.gov.in)',
        'Accept': 'application/json',
        'Accept-Language': 'en,hi'
      },
      timeout: 6500
    });

    const data = response.data;
    if (!data || !data.address) {
      return createFallbackLocation(lat, lon, acc, 'Location detected without address details.');
    }

    const addr = data.address;

    // Standardize address components
    const place = cleanValue(
      addr.amenity ||
      addr.building ||
      addr.suburb ||
      addr.neighbourhood ||
      addr.village ||
      addr.hamlet ||
      addr.road ||
      addr.residential ||
      addr.county ||
      addr.city_district ||
      null
    );

    const locality = cleanValue(
      addr.suburb ||
      addr.neighbourhood ||
      addr.residential ||
      addr.locality ||
      null
    );

    const city = cleanValue(
      addr.city ||
      addr.town ||
      addr.municipality ||
      addr.village ||
      addr.county ||
      addr.city_district ||
      null
    );

    const district = cleanValue(
      addr.state_district ||
      addr.district ||
      addr.county ||
      addr.city ||
      null
    );

    const state = cleanValue(
      addr.state ||
      addr.province ||
      null
    );

    const country = cleanValue(addr.country) || 'India';
    const postalCode = cleanValue(addr.postcode);

    // Build a human-friendly display name
    const parts = [];
    if (place) parts.push(place);
    if (city && city !== place) parts.push(city);
    if (district && district !== city && district !== place) parts.push(district);
    if (state && state !== district) parts.push(state);

    const locationName = parts.length > 0 ? parts.join(', ') : `Coordinates (${lat.toFixed(4)}, ${lon.toFixed(4)})`;

    return {
      success: true,
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lon.toFixed(6)),
      accuracy: acc,
      place: place || 'Not available',
      locality: locality || 'Not available',
      city: city || 'Not available',
      district: district || 'Not available',
      state: state || 'Not available',
      country: country || 'India',
      postalCode: postalCode || 'Not available',
      locationName,
      displayName: data.display_name || locationName,
      rawAddress: JSON.stringify(addr)
    };
  } catch (err) {
    console.warn('⚠️ Reverse geocoding external service error:', err.message);
    // Return structured coordinates response with failure indicator
    return {
      success: false,
      error: 'REVERSE_GEOCODE_FAILED',
      message: "Location coordinates detected, but we couldn't determine the address. Please try again or enter the location manually.",
      latitude: parseFloat(lat.toFixed(6)),
      longitude: parseFloat(lon.toFixed(6)),
      accuracy: acc,
      place: 'Not available',
      locality: 'Not available',
      city: 'Not available',
      district: 'Not available',
      state: 'Not available',
      country: 'India',
      postalCode: 'Not available',
      locationName: `GPS (${lat.toFixed(4)}, ${lon.toFixed(4)})`
    };
  }
}

function cleanValue(val) {
  if (!val) return null;
  const str = String(val).trim();
  if (str === '' || str.toLowerCase() === 'undefined' || str.toLowerCase() === 'null') {
    return null;
  }
  return str;
}

function createFallbackLocation(lat, lon, acc, msg) {
  return {
    success: true,
    latitude: parseFloat(lat.toFixed(6)),
    longitude: parseFloat(lon.toFixed(6)),
    accuracy: acc,
    place: 'Not available',
    locality: 'Not available',
    city: 'Not available',
    district: 'Not available',
    state: 'Not available',
    country: 'India',
    postalCode: 'Not available',
    locationName: `GPS (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
    displayName: `Coordinates (${lat.toFixed(4)}, ${lon.toFixed(4)})`,
    rawAddress: null,
    message: msg
  };
}

/**
 * Forward Geocoding Search: Search village, town, landmark, street, colony
 */
export async function searchLocation(query) {
  if (!query || typeof query !== 'string' || query.trim().length < 2) {
    return [];
  }

  try {
    const url = 'https://nominatim.openstreetmap.org/search';
    const response = await axios.get(url, {
      params: {
        format: 'jsonv2',
        q: query.trim(),
        countrycodes: 'in',
        limit: 6,
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'Sahyog-Societal-Portal/1.0 (contact@sahyog.gov.in)',
        'Accept': 'application/json',
        'Accept-Language': 'en,hi'
      },
      timeout: 6000
    });

    if (!Array.isArray(response.data)) return [];

    return response.data.map(item => {
      const addr = item.address || {};
      const place = cleanValue(
        addr.amenity || addr.building || addr.suburb || addr.neighbourhood || addr.village || addr.hamlet || addr.road || addr.residential || null
      );
      const locality = cleanValue(addr.suburb || addr.neighbourhood || addr.residential || addr.locality || null);
      const city = cleanValue(addr.city || addr.town || addr.municipality || addr.village || addr.county || null);
      const district = cleanValue(addr.state_district || addr.district || addr.county || null);
      const state = cleanValue(addr.state || addr.province || null);
      const postalCode = cleanValue(addr.postcode);

      return {
        latitude: parseFloat(parseFloat(item.lat).toFixed(6)),
        longitude: parseFloat(parseFloat(item.lon).toFixed(6)),
        place: place || item.name || 'Not available',
        locality: locality || 'Not available',
        city: city || 'Not available',
        district: district || 'Not available',
        state: state || 'Not available',
        country: cleanValue(addr.country) || 'India',
        postalCode: postalCode || 'Not available',
        displayName: item.display_name,
        type: item.type || 'place'
      };
    });
  } catch (err) {
    console.warn('⚠️ Forward geocode search error:', err.message);
    return [];
  }
}

