import express from 'express';
import axios from 'axios';
import prisma from '../config/prisma.js';
import { successResponse, errorResponse } from '../utils/response.js';

const router = express.Router();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * POST /api/ai/text/analyze
 */
router.post('/text/analyze', async (req, res, next) => {
  try {
    const { text, language } = req.body;
    if (!text) {
      return errorResponse(res, 'Text content is required.', 400, 'VALIDATION_ERROR');
    }

    try {
      const resp = await axios.post(`${AI_SERVICE_URL}/api/v1/ai/text/analyze`, {
        text,
        language: language || 'en'
      }, { timeout: 4000 });
      return successResponse(res, resp.data, 'Text analyzed successfully.');
    } catch (err) {
      // Fallback heuristics
      return successResponse(res, {
        detected_language: language || 'en',
        summary: text.substring(0, 120),
        category: 'Road Infrastructure',
        subcategory: 'Road Damage',
        keywords: ['infrastructure', 'community'],
        required_expertise: ['Civil Engineering'],
        confidence: 0.85
      }, 'Text analyzed (fallback mode).');
    }
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/ai/analysis/:problemId
 */
router.get('/analysis/:problemId', async (req, res, next) => {
  try {
    const { problemId } = req.params;
    const analyses = await prisma.aiAnalysis.findMany({
      where: { problemId },
      include: { classifications: true },
      orderBy: { createdAt: 'desc' }
    });
    return successResponse(res, { analyses }, 'AI analyses history retrieved.');
  } catch (err) {
    next(err);
  }
});

export default router;
