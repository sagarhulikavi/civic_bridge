import express from 'express';
import prisma from '../config/prisma.js';
import { successResponse } from '../utils/response.js';

const router = express.Router();

/**
 * GET /api/organizations
 * List verified universities and industries with their expertise profiles
 */
router.get('/', async (req, res, next) => {
  try {
    const { type, search, district } = req.query;

    const where = {
      verificationStatus: 'VERIFIED'
    };

    if (type) {
      where.type = type.toUpperCase();
    }
    if (district) {
      where.district = { contains: district };
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const organizations = await prisma.organization.findMany({
      where,
      include: { expertise: true },
      orderBy: { name: 'asc' }
    });

    return successResponse(res, { organizations }, 'Organizations retrieved.');
  } catch (err) {
    next(err);
  }
});

export default router;
