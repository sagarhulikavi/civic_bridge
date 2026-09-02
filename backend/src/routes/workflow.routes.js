import express from 'express';
import prisma from '../config/prisma.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { applyProblemStatus, assertTransition } from '../services/problemStatus.js';

const router = express.Router();

/**
 * Load a problem by id/displayId and verify the acting user's organization is
 * matched to it. Enforces the "universities/industry act only on matched
 * problems" rule server-side.
 */
async function getMatchedProblem(user, problemId) {
  if (!user.organizationId) {
    const err = new Error('Your account has no linked organization.');
    err.statusCode = 403;
    err.errorCode = 'NO_ORGANIZATION';
    throw err;
  }

  const problem = await prisma.problem.findFirst({
    where: { OR: [{ id: problemId }, { displayId: problemId }] }
  });
  if (!problem) {
    const err = new Error('Problem record not found.');
    err.statusCode = 404;
    err.errorCode = 'NOT_FOUND';
    throw err;
  }

  const match = await prisma.problemMatch.findFirst({
    where: {
      problemId: problem.id,
      organizationId: user.organizationId
    }
  });
  if (!match) {
    const err = new Error('This problem is not matched to your organization.');
    err.statusCode = 403;
    err.errorCode = 'NOT_MATCHED';
    throw err;
  }

  return { problem, match };
}

/**
 * Find the acting user's active collaboration for a problem, or create one.
 * Solution records require a collaboration, so we lazily create it.
 */
async function ensureCollaboration(problemId, userId) {
  let collab = await prisma.collaboration.findFirst({
    where: { problemId, createdById: userId }
  });
  if (!collab) {
    collab = await prisma.collaboration.create({
      data: { problemId, createdById: userId, status: 'PROPOSED' }
    });
    await prisma.collaborationMember.create({
      data: { collaborationId: collab.id, userId, role: 'LEAD' }
    });
  }
  return collab;
}

/**
 * Wrap a status transition with common error handling, audit + notification.
 */
async function transition(req, res, problem, to, notifyExtra = {}, metadata = {}) {
  const actor = { id: req.user.id, role: req.user.role, ip: req.ip };
  const updated = await applyProblemStatus({
    problemId: problem.id,
    from: problem.status,
    to,
    actor,
    metadata,
    notify: notifyExtra.userId
      ? {
          userId: notifyExtra.userId,
          type: 'PROBLEM_UPDATE',
          title: `Problem ${to.replace(/_/g, ' ').toLowerCase()}`,
          message: notifyExtra.message || `The reported problem has advanced to: ${to.replace(/_/g, ' ').toLowerCase()}.`
        }
      : null
  });
  return updated;
}

/**
 * Handle expected workflow errors uniformly.
 */
function workflowError(res, err) {
  if (err.statusCode) return errorResponse(res, err.message, err.statusCode, err.errorCode || 'ERROR');
  return errorResponse(res, err.message, 500, 'SERVER_ERROR');
}

// ---------------------------------------------------------------------------
// UNIVERSITY ACTIONS
// ---------------------------------------------------------------------------

/**
 * POST /api/workflow/:problemId/interest  (UNIVERSITY)
 * Express interest -> UNIVERSITY_INTERESTED
 */
router.post('/:problemId/interest', authenticate, requireRole('UNIVERSITY'), async (req, res, next) => {
  try {
    const { problem, match } = await getMatchedProblem(req.user, req.params.problemId);
    assertTransition(problem.status, 'UNIVERSITY_INTERESTED');

    await transition(req, res, problem, 'UNIVERSITY_INTERESTED', {
      userId: problem.reporterId,
      message: 'A university has expressed interest in your reported problem.'
    });

    await prisma.problemMatch.update({
      where: { id: match.id },
      data: { matchStatus: 'INTERESTED' }
    });

    const populated = await prisma.problem.findUnique({
      where: { id: problem.id },
      include: { category: true, matches: { include: { organization: true } } }
    });
    return successResponse(res, { problem: populated }, 'University interest registered.');
  } catch (err) {
    workflowError(res, err);
  }
});

/**
 * POST /api/workflow/:problemId/idea  (UNIVERSITY)
 * Submit idea -> IDEA_SUBMITTED
 */
router.post('/:problemId/idea', authenticate, requireRole('UNIVERSITY'), async (req, res, next) => {
  try {
    const { problem } = await getMatchedProblem(req.user, req.params.problemId);
    assertTransition(problem.status, 'IDEA_SUBMITTED');

    const { title, description, solutionType } = req.body;
    const ideaTitle = title && title.trim() ? title.trim() : `Proposed solution for ${problem.displayId}`;

    const collab = await ensureCollaboration(problem.id, req.user.id);
    await prisma.solution.create({
      data: {
        problemId: problem.id,
        collaborationId: collab.id,
        title: ideaTitle,
        description: description ? String(description).trim() : null,
        solutionType: solutionType || 'ENGINEERING',
        status: 'PROPOSED',
        progressPercentage: 0
      }
    });

    await transition(req, res, problem, 'IDEA_SUBMITTED', {
      userId: problem.reporterId,
      message: 'A university has submitted a solution idea for your reported problem.'
    });

    const populated = await prisma.problem.findUnique({
      where: { id: problem.id },
      include: { category: true, solutions: { include: { updates: true } }, matches: { include: { organization: true } } }
    });
    return successResponse(res, { problem: populated }, 'Solution idea submitted.');
  } catch (err) {
    workflowError(res, err);
  }
});

/**
 * POST /api/workflow/:problemId/prototype  (UNIVERSITY)
 * Submit prototype -> INDUSTRY_REVIEW
 */
router.post('/:problemId/prototype', authenticate, requireRole('UNIVERSITY'), async (req, res, next) => {
  try {
    const { problem } = await getMatchedProblem(req.user, req.params.problemId);
    assertTransition(problem.status, 'INDUSTRY_REVIEW');

    const { title, description } = req.body;
    const protoTitle = title && title.trim() ? title.trim() : `Prototype for ${problem.displayId}`;

    const collab = await ensureCollaboration(problem.id, req.user.id);
    await prisma.solution.create({
      data: {
        problemId: problem.id,
        collaborationId: collab.id,
        title: protoTitle,
        description: description ? String(description).trim() : null,
        solutionType: 'ENGINEERING',
        status: 'PROTOTYPE',
        progressPercentage: 60
      }
    });

    await transition(req, res, problem, 'INDUSTRY_REVIEW', {
      userId: problem.reporterId,
      message: 'A university has submitted a prototype. It is now with industry for review.'
    });

    const populated = await prisma.problem.findUnique({
      where: { id: problem.id },
      include: { category: true, solutions: { include: { updates: true } }, matches: { include: { organization: true } } }
    });
    return successResponse(res, { problem: populated }, 'Prototype submitted. Awaiting industry review.');
  } catch (err) {
    workflowError(res, err);
  }
});

// ---------------------------------------------------------------------------
// INDUSTRY ACTIONS
// ---------------------------------------------------------------------------

/**
 * POST /api/workflow/:problemId/review  (INDUSTRY)
 * Review prototype -> ACCEPTED | DECLINED
 */
router.post('/:problemId/review', authenticate, requireRole('INDUSTRY'), async (req, res, next) => {
  try {
    const { problem, match } = await getMatchedProblem(req.user, req.params.problemId);
    const decision = String(req.body.decision || '').toUpperCase();
    const target = decision === 'ACCEPT' ? 'ACCEPTED' : (decision === 'DECLINE' ? 'DECLINED' : null);
    if (!target) {
      return errorResponse(res, "decision must be 'ACCEPT' or 'DECLINE'.", 400, 'VALIDATION_ERROR');
    }
    assertTransition(problem.status, target);

    await transition(req, res, problem, target, {
      userId: problem.reporterId,
      message: target === 'ACCEPTED' ? 'Industry has accepted and agreed to support the prototype.' : 'Industry has declined this proposal.'
    });

    if (target === 'ACCEPTED') {
      await prisma.problemMatch.update({
        where: { id: match.id },
        data: { matchStatus: 'ACCEPTED' }
      });
    } else {
      await prisma.problemMatch.update({
        where: { id: match.id },
        data: { matchStatus: 'REJECTED' }
      });
    }

    const populated = await prisma.problem.findUnique({
      where: { id: problem.id },
      include: { category: true, solutions: { include: { updates: true } }, matches: { include: { organization: true } } }
    });
    return successResponse(res, { problem: populated }, `Industry decision recorded: ${target}.`);
  } catch (err) {
    workflowError(res, err);
  }
});

/**
 * POST /api/workflow/:problemId/support  (INDUSTRY)
 * Commit to prototype development support -> PROTOTYPE_DEVELOPMENT
 */
router.post('/:problemId/support', authenticate, requireRole('INDUSTRY'), async (req, res, next) => {
  try {
    const { problem } = await getMatchedProblem(req.user, req.params.problemId);
    assertTransition(problem.status, 'PROTOTYPE_DEVELOPMENT');

    await transition(req, res, problem, 'PROTOTYPE_DEVELOPMENT', {
      userId: problem.reporterId,
      message: 'Industry has committed resources to prototype development for your problem.'
    });

    const populated = await prisma.problem.findUnique({
      where: { id: problem.id },
      include: { category: true, matches: { include: { organization: true } } }
    });
    return successResponse(res, { problem: populated }, 'Prototype development started.');
  } catch (err) {
    workflowError(res, err);
  }
});

/**
 * POST /api/workflow/:problemId/implement  (INDUSTRY)
 * Mark implementation done -> IMPLEMENTED
 */
router.post('/:problemId/implement', authenticate, requireRole('INDUSTRY'), async (req, res, next) => {
  try {
    const { problem } = await getMatchedProblem(req.user, req.params.problemId);
    assertTransition(problem.status, 'IMPLEMENTED');

    await transition(req, res, problem, 'IMPLEMENTED', {
      userId: problem.reporterId,
      message: 'Your reported problem has been implemented on the ground. Final confirmation pending.'
    });

    const populated = await prisma.problem.findUnique({
      where: { id: problem.id },
      include: { category: true, matches: { include: { organization: true } } }
    });
    return successResponse(res, { problem: populated }, 'Implementation marked complete.');
  } catch (err) {
    workflowError(res, err);
  }
});

/**
 * POST /api/workflow/:problemId/resolve  (INDUSTRY)
 * Final confirmation -> RESOLVED
 */
router.post('/:problemId/resolve', authenticate, requireRole('INDUSTRY'), async (req, res, next) => {
  try {
    const { problem } = await getMatchedProblem(req.user, req.params.problemId);
    assertTransition(problem.status, 'RESOLVED');

    await transition(req, res, problem, 'RESOLVED', {
      userId: problem.reporterId,
      message: 'Your reported problem has been resolved. Thank you for helping improve your community.'
    });

    const populated = await prisma.problem.findUnique({
      where: { id: problem.id },
      include: { category: true, matches: { include: { organization: true } } }
    });
    return successResponse(res, { problem: populated }, 'Problem resolved.');
  } catch (err) {
    workflowError(res, err);
  }
});

export default router;
