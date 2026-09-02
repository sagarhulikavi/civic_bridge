import express from 'express';
import prisma from '../config/prisma.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { successResponse, errorResponse } from '../utils/response.js';

const router = express.Router();

// Enforce ADMIN role for all routes in this file
router.use(authenticate, requireRole('ADMIN'));

/**
 * GET /api/admin/dashboard
 * Aggregated analytics and stats for administrator triage
 */
router.get('/dashboard', async (req, res, next) => {
  try {
    const [
      totalProblems,
      pendingProblems,
      resolvedProblems,
      criticalProblems,
      totalUsers,
      totalOrganizations,
      totalCollaborations,
      recentAuditLogs
    ] = await Promise.all([
      prisma.problem.count(),
      prisma.problem.count({ where: { status: { in: ['SUBMITTED', 'AI_PROCESSING', 'UNDER_REVIEW'] } } }),
      prisma.problem.count({ where: { status: 'RESOLVED' } }),
      prisma.problem.count({ where: { priority: 'CRITICAL' } }),
      prisma.user.count(),
      prisma.organization.count(),
      prisma.collaboration.count(),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { id: true, name: true, role: true } } }
      })
    ]);

    return successResponse(res, {
      stats: {
        totalProblems,
        pendingProblems,
        resolvedProblems,
        criticalProblems,
        totalUsers,
        totalOrganizations,
        totalCollaborations
      },
      recentAuditLogs
    }, 'Admin dashboard metrics retrieved.');
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/problems/:id/override
 * Admin override for category, priority, or verification status
 */
router.post('/problems/:id/override', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { categoryId, priority, status, notes } = req.body;

    const updated = await prisma.problem.update({
      where: { id },
      data: {
        ...(categoryId ? { categoryId } : {}),
        ...(priority ? { priority } : {}),
        ...(status ? { status } : {}),
        verificationStatus: 'APPROVED'
      },
      include: { category: true, location: true }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'AI_REVIEW_OVERRIDE',
        entityType: 'PROBLEM',
        entityId: id,
        metadata: JSON.stringify({ categoryId, priority, status, notes })
      }
    });

    return successResponse(res, { problem: updated }, 'Problem classification verified and updated.');
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/admin/problems/merge
 * Merge two duplicate problems
 */
router.post('/problems/merge', async (req, res, next) => {
  try {
    const { primaryId, duplicateId } = req.body;
    if (!primaryId || !duplicateId) {
      return errorResponse(res, 'Primary and Duplicate Problem IDs are required.', 400, 'VALIDATION_ERROR');
    }

    await prisma.problem.update({
      where: { id: duplicateId },
      data: {
        status: 'DUPLICATE',
        isDuplicate: true,
        duplicateOfId: primaryId
      }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'DUPLICATE_MERGE',
        entityType: 'PROBLEM',
        entityId: duplicateId,
        metadata: JSON.stringify({ primaryId, duplicateId })
      }
    });

    return successResponse(res, {}, 'Duplicate reports merged successfully.');
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/admin/problems/:id
 * Admin permanent delete problem endpoint
 */
router.delete('/problems/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await prisma.problem.findUnique({
      where: { id }
    });

    if (!existing) {
      return errorResponse(res, 'Problem not found.', 404, 'NOT_FOUND');
    }

    // Clean up similarity references
    await prisma.problemSimilarity.deleteMany({
      where: {
        OR: [
          { problemId1: id },
          { problemId2: id }
        ]
      }
    });

    // Unset duplicateOfId on any dependent problems
    await prisma.problem.updateMany({
      where: { duplicateOfId: id },
      data: { duplicateOfId: null, isDuplicate: false }
    });

    // Cascade delete problem from database
    await prisma.problem.delete({
      where: { id }
    });

    // Create Audit Log entry
    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'PROBLEM_DELETED',
        entityType: 'PROBLEM',
        entityId: id,
        metadata: JSON.stringify({
          displayId: existing.displayId,
          title: existing.title,
          deletedBy: req.user.email
        })
      }
    });

    return successResponse(res, { deletedId: id, displayId: existing.displayId }, `Problem ${existing.displayId} has been successfully deleted.`);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/admin/audit-logs
 */
router.get('/audit-logs', async (req, res, next) => {
  try {
    const logs = await prisma.auditLog.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, displayId: true, name: true, role: true } } }
    });
    return successResponse(res, { logs }, 'Audit logs retrieved.');
  } catch (err) {
    next(err);
  }
});

export default router;

