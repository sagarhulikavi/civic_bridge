import express from 'express';
import prisma from '../config/prisma.js';
import { optionalAuth, authenticate } from '../middleware/auth.js';
import { successResponse, errorResponse, generateDisplayId } from '../utils/response.js';

const router = express.Router();

/**
 * POST /api/support
 * Submit support ticket
 */
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const { email, category, subject, description } = req.body;

    const userEmail = req.user?.email || email;
    if (!userEmail || !subject || !description) {
      return errorResponse(res, 'Email, subject, and description are required.', 400, 'VALIDATION_ERROR');
    }

    const count = await prisma.supportTicket.count();
    const displayId = generateDisplayId('SUP', count);

    const ticket = await prisma.supportTicket.create({
      data: {
        displayId,
        userId: req.user?.id || null,
        userEmail: userEmail.trim().toLowerCase(),
        category: category || 'General',
        subject: subject.trim(),
        description: description.trim(),
        status: 'OPEN'
      }
    });

    return successResponse(res, { ticket }, 'Support request submitted. Ticket ID: ' + displayId, 201);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/support
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      where: req.user.role === 'ADMIN' ? {} : { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    return successResponse(res, { tickets }, 'Support tickets retrieved.');
  } catch (err) {
    next(err);
  }
});

export default router;
