import express from 'express';
import prisma from '../config/prisma.js';
import { successResponse } from '../utils/response.js';

const router = express.Router();

/**
 * GET /api/categories
 * List active problem categories with multilingual metadata
 */
router.get('/', async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    return successResponse(res, { categories }, 'Categories retrieved.');
  } catch (err) {
    next(err);
  }
});

export default router;
