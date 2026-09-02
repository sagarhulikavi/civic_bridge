import express from 'express';
import prisma from '../config/prisma.js';
import { authenticate } from '../middleware/auth.js';
import { successResponse, errorResponse } from '../utils/response.js';

const router = express.Router();

/**
 * POST /api/collaborations
 * Initiate collaboration on a problem
 */
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { problemId, organizationId, title, description } = req.body;

    if (!problemId) {
      return errorResponse(res, 'Problem ID is required.', 400, 'VALIDATION_ERROR');
    }

    // Check if collaboration already exists
    let collab = await prisma.collaboration.findFirst({
      where: { problemId },
      include: { members: true, solutions: true }
    });

    if (!collab) {
      collab = await prisma.collaboration.create({
        data: {
          problemId,
          createdById: req.user.id,
          status: 'ACTIVE'
        }
      });

      // Add creator as leader
      await prisma.collaborationMember.create({
        data: {
          collaborationId: collab.id,
          userId: req.user.id,
          organizationId: req.user.organizationId || organizationId || null,
          role: 'LEAD'
        }
      });

      // Create initial Solution record
      const solution = await prisma.solution.create({
        data: {
          problemId,
          collaborationId: collab.id,
          title: title || 'Field Investigation & Joint Action Plan',
          description: description || 'Multi-stakeholder repair and engineering remediation.',
          solutionType: 'ENGINEERING',
          status: 'DESIGN',
          progressPercentage: 20
        }
      });

      await prisma.solutionUpdate.create({
        data: {
          solutionId: solution.id,
          updatedById: req.user.id,
          title: 'Initial Assessment & Scope Definition',
          description: 'Team formed with civic partners to inspect problem on-site.',
          progressPercentage: 20,
          stage: 'DESIGN'
        }
      });

      // Update Problem Status to COLLABORATION / IN_PROGRESS
      await prisma.problem.update({
        where: { id: problemId },
        data: { status: 'COLLABORATION' }
      });
    } else {
      // Add member if not already joined
      const isMember = collab.members.some(m => m.userId === req.user.id || (m.organizationId && m.organizationId === req.user.organizationId));
      if (!isMember) {
        await prisma.collaborationMember.create({
          data: {
            collaborationId: collab.id,
            userId: req.user.id,
            organizationId: req.user.organizationId || organizationId || null,
            role: req.user.role === 'UNIVERSITY' ? 'RESEARCHER' : 'INDUSTRY_PARTNER'
          }
        });
      }
    }

    const fullCollab = await prisma.collaboration.findUnique({
      where: { id: collab.id },
      include: {
        problem: { include: { location: true, media: true } },
        members: { include: { user: true, organization: true } },
        solutions: { include: { updates: { include: { updatedBy: true } } } },
        comments: { include: { user: true } }
      }
    });

    return successResponse(res, { collaboration: fullCollab }, 'Collaboration active.', 201);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/collaborations/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const collab = await prisma.collaboration.findFirst({
      where: {
        OR: [{ id }, { problemId: id }]
      },
      include: {
        problem: {
          include: { location: true, media: true, category: true, reporter: true }
        },
        members: {
          include: { user: true, organization: true }
        },
        solutions: {
          include: {
            updates: {
              include: { updatedBy: { select: { id: true, name: true, role: true } } },
              orderBy: { createdAt: 'desc' }
            }
          }
        },
        comments: {
          include: { user: { select: { id: true, name: true, role: true } } },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!collab) {
      return errorResponse(res, 'Collaboration workspace not found.', 404, 'NOT_FOUND');
    }

    return successResponse(res, { collaboration: collab }, 'Collaboration workspace details retrieved.');
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/collaborations/:id/solutions/:solutionId/updates
 * Update solution milestone progress (20% -> 50% -> 80% -> 100% -> RESOLVED)
 */
router.post('/:id/solutions/:solutionId/updates', authenticate, async (req, res, next) => {
  try {
    const { id, solutionId } = req.params;
    const { title, description, progressPercentage, stage } = req.body;

    const progress = parseInt(progressPercentage, 10);
    const newStage = stage || (progress >= 100 ? 'COMPLETED' : progress >= 75 ? 'IMPLEMENTATION' : progress >= 50 ? 'TESTING' : 'DESIGN');

    // Create Update record
    const update = await prisma.solutionUpdate.create({
      data: {
        solutionId,
        updatedById: req.user.id,
        title: title || `Milestone Update: ${progress}% reached`,
        description: description || 'Progress logged on the collaborative remediation.',
        progressPercentage: progress,
        stage: newStage
      },
      include: {
        updatedBy: { select: { id: true, name: true, role: true } }
      }
    });

    // Update Solution
    const updatedSolution = await prisma.solution.update({
      where: { id: solutionId },
      data: {
        progressPercentage: progress,
        status: newStage
      }
    });

    // If 100% complete, transition problem status to RESOLVED
    if (progress >= 100) {
      const collab = await prisma.collaboration.findUnique({ where: { id } });
      if (collab) {
        await prisma.problem.update({
          where: { id: collab.problemId },
          data: { status: 'RESOLVED' }
        });
      }
    } else {
      const collab = await prisma.collaboration.findUnique({ where: { id } });
      if (collab) {
        await prisma.problem.update({
          where: { id: collab.problemId },
          data: { status: 'IN_PROGRESS' }
        });
      }
    }

    return successResponse(
      res,
      { update, solution: updatedSolution },
      'Milestone progress recorded successfully.',
      201
    );
  } catch (err) {
    next(err);
  }
});

export default router;
