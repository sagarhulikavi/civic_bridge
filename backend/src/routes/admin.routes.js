import express from 'express';
import prisma from '../config/prisma.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { applyProblemStatus } from '../services/problemStatus.js';

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
      prisma.problem.count({ where: { status: { in: ['PENDING_ADMIN_REVIEW', 'AI_FAILED', 'NEEDS_MORE_INFORMATION'] } } }),
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

    if (status) {
      // Route status changes through the state machine so invalid arrows and
      // the "APPROVED is granted only by admin" rule are enforced. This
      // mirrors the guarded PATCH /:id/status path.
      const problem = await prisma.problem.findFirst({
        where: { OR: [{ id }, { displayId: id }] }
      });
      if (!problem) {
        return errorResponse(res, 'Problem record not found.', 404, 'NOT_FOUND');
      }

      await prisma.problem.update({
        where: { id: problem.id },
        data: {
          ...(categoryId ? { categoryId } : {}),
          ...(priority ? { priority } : {})
        }
      });

      const updated = await applyProblemStatus({
        problemId: problem.id,
        from: problem.status,
        to: status,
        actor: { id: req.user.id, role: req.user.role, ip: req.ip },
        metadata: { categoryId, priority, notes }
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

      const populated = await prisma.problem.findUnique({
        where: { id: problem.id },
        include: { category: true, location: true, matches: { include: { organization: true } } }
      });
      return successResponse(res, { problem: populated }, 'Problem classification verified and updated.');
    }

    // No status change: just correct category/priority.
    const updated = await prisma.problem.update({
      where: { id },
      data: {
        ...(categoryId ? { categoryId } : {}),
        ...(priority ? { priority } : {})
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
    if (err.statusCode) return errorResponse(res, err.message, err.statusCode, err.errorCode || 'ERROR');
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

