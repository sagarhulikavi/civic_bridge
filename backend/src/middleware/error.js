import { errorResponse } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  console.error(`❌ [${req.method}] ${req.url} Error:`, err);

  // Multer Errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return errorResponse(res, 'File too large. Maximum file size is 10 MB.', 413, 'FILE_TOO_LARGE');
  }
  if (err.message && err.message.startsWith('INVALID_IMAGE_TYPE')) {
    return errorResponse(res, 'Unsupported image format. Please upload JPG, PNG, or WebP.', 415, 'INVALID_IMAGE_TYPE');
  }
  if (err.message && err.message.startsWith('INVALID_AUDIO_TYPE')) {
    return errorResponse(res, 'Unsupported audio format. Please upload a standard audio recording.', 415, 'INVALID_AUDIO_TYPE');
  }

  // Prisma unique constraint errors
  if (err.code === 'P2002') {
    return errorResponse(res, 'A record with this value already exists.', 409, 'DUPLICATE_RESOURCE');
  }

  // Default server error (protects sensitive stack traces from leak)
  return errorResponse(
    res,
    process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong while processing your request. Please try again.',
    500,
    'INTERNAL_SERVER_ERROR'
  );
};
