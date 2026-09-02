import express from 'express';
import { reverseGeocode } from '../services/geocodingService.js';
import { successResponse, errorResponse } from '../utils/response.js';

const router = express.Router();

/**
 * POST /api/location/reverse-geocode
 * Reverse geocode latitude and longitude into structured place, district, state, country, and postal code.
 */
router.post('/reverse-geocode', async (req, res, next) => {
  try {
    const { latitude, longitude, accuracy } = req.body;

    if (latitude === undefined || longitude === undefined || latitude === null || longitude === null) {
      return errorResponse(res, 'Latitude and Longitude are required.', 400, 'VALIDATION_ERROR');
    }

    const latNum = parseFloat(latitude);
    const lonNum = parseFloat(longitude);

    if (isNaN(latNum) || isNaN(lonNum)) {
      return errorResponse(res, 'Latitude and Longitude must be valid numerical values.', 400, 'INVALID_COORDINATES');
    }

    if (latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180) {
      return errorResponse(res, 'Coordinates out of bounds: Latitude must be between -90 and 90, Longitude between -180 and 180.', 400, 'COORDINATES_OUT_OF_BOUNDS');
    }

    const result = await reverseGeocode(latNum, lonNum, accuracy);

    if (!result.success && result.error === 'REVERSE_GEOCODE_FAILED') {
      // Still return 200 with coordinates payload and clear error note so frontend can use coordinates & fallback
      return successResponse(res, {
        location: result,
        warning: result.message
      }, result.message);
    }

    return successResponse(res, { location: result }, 'Location reverse-geocoded successfully.');
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/location/reverse-geocode?lat=...&lon=...
 */
router.get('/reverse-geocode', async (req, res, next) => {
  try {
    const { lat, lon, latitude, longitude, accuracy } = req.query;
    const targetLat = latitude || lat;
    const targetLon = longitude || lon;

    if (!targetLat || !targetLon) {
      return errorResponse(res, 'Latitude and Longitude query parameters are required.', 400, 'VALIDATION_ERROR');
    }

    const latNum = parseFloat(targetLat);
    const lonNum = parseFloat(targetLon);

    if (isNaN(latNum) || isNaN(lonNum)) {
      return errorResponse(res, 'Latitude and Longitude must be valid numbers.', 400, 'INVALID_COORDINATES');
    }

    const result = await reverseGeocode(latNum, lonNum, accuracy);
    return successResponse(res, { location: result }, 'Location reverse-geocoded successfully.');
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/location/search?q=...
 * Forward geocoding search for villages, towns, colonies, landmarks
 */
router.get('/search', async (req, res, next) => {
  try {
    const { q, query } = req.query;
    const searchTerm = q || query;

    if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim().length < 2) {
      return successResponse(res, { results: [] }, 'Query too short.');
    }

    const { searchLocation } = await import('../services/geocodingService.js');
    const results = await searchLocation(searchTerm);
    return successResponse(res, { results }, 'Location search completed.');
  } catch (err) {
    next(err);
  }
});

export default router;
