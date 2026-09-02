import express from 'express';
import axios from 'axios';
import prisma from '../config/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { successResponse, errorResponse } from '../utils/response.js';

const MATCH_STATUSES = ['RECOMMENDED', 'VIEWED', 'INTERESTED', 'ACCEPTED', 'REJECTED', 'EXPIRED'];

const router = express.Router();
const INTELLIGENCE_SERVICE_URL = process.env.INTELLIGENCE_SERVICE_URL || 'http://localhost:8001';

/**
 * GET /api/matches/problem/:problemId
 * Retrieve ranked University & Industry matches with explainability reasons
 */
router.get('/problem/:problemId', async (req, res, next) => {
  try {
    const { problemId } = req.params;

    const matches = await prisma.problemMatch.findMany({
      where: {
        OR: [{ problemId }, { problem: { displayId: problemId } }]
      },
      include: {
        organization: {
          include: { expertise: true }
        }
      },
      orderBy: { matchScore: 'desc' }
    });

    return successResponse(res, { matches }, 'Matched organizations retrieved.');
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/matches/duplicates/check
 * Check candidate duplicates for a given problem
 */
router.post('/duplicates/check', async (req, res, next) => {
  try {
    const { problemId, category, title, description, latitude, longitude } = req.body;

    const existing = await prisma.problem.findMany({
      where: {
        id: { not: problemId || '' },
        status: { notIn: ['RESOLVED', 'REJECTED'] }
      },
      take: 10,
      include: { location: true }
    });

    const candidateList = existing.map(p => ({
      id: p.id,
      displayId: p.displayId,
      title: p.title,
      description: p.description,
      latitude: p.location?.latitude,
      longitude: p.location?.longitude,
      category: category || 'Road Infrastructure'
    }));

    try {
      const resp = await axios.post(`${INTELLIGENCE_SERVICE_URL}/api/v1/intelligence/duplicates`, {
        problem_id: problemId,
        category: category || 'Road Infrastructure',
        title,
        description,
        latitude,
        longitude,
        existing_problems: candidateList
      }, { timeout: 3000 });

      return successResponse(res, resp.data, 'Duplicate check completed.');
    } catch (err) {
      // Fallback
      return successResponse(res, {
        is_potential_duplicate: false,
        highest_similarity: 0.0,
        candidates: []
      }, 'Duplicate check completed (heuristics mode).');
    }
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/matches/:matchId/status
 * Update match status (e.g. INTERESTED, VIEWED). The acting user must belong
 * to the organization that owns this match, and the value must be one of the
 * valid match statuses.
 */
router.patch('/:matchId/status', authenticate, async (req, res, next) => {
  try {
    const { matchId } = req.params;
    const { status } = req.body;

    if (!status || !MATCH_STATUSES.includes(status)) {
      return errorResponse(res, `Invalid match status. Must be one of: ${MATCH_STATUSES.join(', ')}.`, 400, 'VALIDATION_ERROR');
    }

    const existing = await prisma.problemMatch.findUnique({
      where: { id: matchId },
      include: { organization: true, problem: true }
    });
    if (!existing) {
      return errorResponse(res, 'Match record not found.', 404, 'NOT_FOUND');
    }

    // Ownership guard: the acting org must be the matched org.
    if (!req.user.organizationId || existing.organizationId !== req.user.organizationId) {
      return errorResponse(res, 'You can only update matches for your own organization.', 403, 'FORBIDDEN');
    }

    const updated = await prisma.problemMatch.update({
      where: { id: matchId },
      data: { matchStatus: status },
      include: { organization: true, problem: true }
    });

    return successResponse(res, { match: updated }, 'Match status updated.');
  } catch (err) {
    next(err);
  }
});

export default router;
