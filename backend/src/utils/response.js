import { v4 as uuidv4 } from 'uuid';

/**
 * Standardized success response envelope
 */
export const successResponse = (res, data = {}, message = 'Operation successful', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    request_id: `REQ-${uuidv4().substring(0, 8).toUpperCase()}`,
    timestamp: new Date().toISOString()
  });
};

/**
 * Standardized error response envelope
 */
export const errorResponse = (res, message = 'An error occurred', statusCode = 500, errorCode = 'SERVER_ERROR', details = null) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      ...(details ? { details } : {})
    },
    request_id: `REQ-${uuidv4().substring(0, 8).toUpperCase()}`,
    timestamp: new Date().toISOString()
  });
};

/**
 * Generates user-friendly formatted sequential IDs
 */
export const generateDisplayId = (prefix, count) => {
  const padded = String(count + 1).padStart(6, '0');
  return `${prefix}-${padded}`;
};
