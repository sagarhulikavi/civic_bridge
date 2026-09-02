import prisma from '../config/prisma.js';

/**
 * Unified problem status state machine.
 *
 * `Problem.status` is the single source of truth for workflow position and
 * authorization. `Problem.aiStatus` and `Problem.verificationStatus` are kept
 * in lockstep below so that any existing UI/query that reads them remains
 * compatible, but ALL authorization & visibility decisions read `status`.
 */

export const PROBLEM_STATUSES = [
  // Pre-public lifecycle
  'SUBMITTED',
  'AI_ANALYZING',
  'AI_FAILED',
  'PENDING_ADMIN_REVIEW',
  'NEEDS_MORE_INFORMATION',
  'APPROVED',
  'REJECTED',
  // Post-approval lifecycle
  'UNIVERSITY_MATCHING',
  'UNIVERSITY_INTERESTED',
  'IDEA_SUBMITTED',
  'INDUSTRY_REVIEW',
  'ACCEPTED',
  'DECLINED',
  'PROTOTYPE_DEVELOPMENT',
  'IMPLEMENTED',
  'RESOLVED',
  'CANCELLED'
];

/**
 * Statuses that are visible to the general public (problem portal, map,
 * statistics, public search). Only APPROVED and beyond.
 */
export const PUBLIC_VISIBLE_STATUSES = [
  'APPROVED',
  'UNIVERSITY_MATCHING',
  'UNIVERSITY_INTERESTED',
  'IDEA_SUBMITTED',
  'INDUSTRY_REVIEW',
  'ACCEPTED',
  'PROTOTYPE_DEVELOPMENT',
  'IMPLEMENTED',
  'RESOLVED'
];

/**
 * Statuses that count as "in the public / approved pipeline" for role filters.
 */
export const APPROVED_PIPELINE_STATUSES = [
  'APPROVED',
  'UNIVERSITY_MATCHING',
  'UNIVERSITY_INTERESTED',
  'IDEA_SUBMITTED',
  'INDUSTRY_REVIEW',
  'ACCEPTED',
  'PROTOTYPE_DEVELOPMENT',
  'IMPLEMENTED',
  'RESOLVED'
];

// Allowed transitions: the ONLY arrows permitted by the workflow.
const ALLOWED_TRANSITIONS = {
  SUBMITTED: ['AI_ANALYZING', 'AI_FAILED'],
  AI_ANALYZING: ['PENDING_ADMIN_REVIEW', 'AI_FAILED'],
  AI_FAILED: ['PENDING_ADMIN_REVIEW'],
  PENDING_ADMIN_REVIEW: ['APPROVED', 'REJECTED', 'NEEDS_MORE_INFORMATION'],
  NEEDS_MORE_INFORMATION: ['PENDING_ADMIN_REVIEW', 'REJECTED'],
  APPROVED: ['UNIVERSITY_MATCHING'],
  UNIVERSITY_MATCHING: ['UNIVERSITY_INTERESTED', 'DECLINED'],
  UNIVERSITY_INTERESTED: ['IDEA_SUBMITTED', 'DECLINED'],
  IDEA_SUBMITTED: ['INDUSTRY_REVIEW', 'DECLINED'],
  INDUSTRY_REVIEW: ['ACCEPTED', 'DECLINED'],
  ACCEPTED: ['PROTOTYPE_DEVELOPMENT'],
  PROTOTYPE_DEVELOPMENT: ['IMPLEMENTED', 'DECLINED'],
  IMPLEMENTED: ['RESOLVED'],
  // Terminal states
  REJECTED: [],
  DECLINED: [],
  RESOLVED: [],
  CANCELLED: []
};

export class InvalidStatusTransitionError extends Error {
  constructor(from, to) {
    super(`Invalid status transition: ${from} -> ${to}`);
    this.name = 'InvalidStatusTransitionError';
    this.statusCode = 409;
    this.errorCode = 'INVALID_STATUS_TRANSITION';
  }
}

export function isValidStatus(status) {
  return PROBLEM_STATUSES.includes(status);
}

export function isPubliclyVisible(status) {
  return PUBLIC_VISIBLE_STATUSES.includes(status);
}

export function isApprovedPipeline(status) {
  return APPROVED_PIPELINE_STATUSES.includes(status);
}

export function canTransition(from, to) {
  if (!from || !to) return false;
  const allowed = ALLOWED_TRANSITIONS[from];
  return Array.isArray(allowed) && allowed.includes(to);
}

export function assertTransition(from, to) {
  if (!canTransition(from, to)) {
    throw new InvalidStatusTransitionError(from, to);
  }
}

/**
 * Sync the legacy side-channel statuses so existing consumers stay consistent.
 */
function syncLegacyStatuses(status) {
  switch (status) {
    case 'AI_ANALYZING':
      return { aiStatus: 'PROCESSING', verificationStatus: 'PENDING' };
    case 'AI_FAILED':
      return { aiStatus: 'FAILED', verificationStatus: 'PENDING' };
    case 'PENDING_ADMIN_REVIEW':
    case 'NEEDS_MORE_INFORMATION':
    case 'SUBMITTED':
      return { aiStatus: 'COMPLETED', verificationStatus: 'PENDING' };
    case 'APPROVED':
      return { aiStatus: 'COMPLETED', verificationStatus: 'APPROVED' };
    case 'REJECTED':
      return { aiStatus: 'COMPLETED', verificationStatus: 'REJECTED' };
    default:
      // Post-approval lifecycle statuses keep the verified/approved lineage.
      return { aiStatus: 'COMPLETED', verificationStatus: 'APPROVED' };
  }
}

/**
 * Validate a transition and, if valid, persist it.
 * Sets status + legacy sync fields, writes an AuditLog, and optionally a Notification.
 */
export async function applyProblemStatus({ problemId, from, to, actor, metadata = null, notify = null }) {
  assertTransition(from, to);

  const updated = await prisma.$transaction(async (tx) => {
    const problem = await tx.problem.findUnique({ where: { id: problemId } });
    if (!problem) {
      const err = new Error('Problem not found.');
      err.statusCode = 404;
      err.errorCode = 'NOT_FOUND';
      throw err;
    }
    if (problem.status !== from) {
      // Guard against concurrent/stale writes: transition is relative to the row's current state.
      throw new InvalidStatusTransitionError(problem.status, to);
    }

    const legacy = syncLegacyStatuses(to);
    const updated = await tx.problem.update({
      where: { id: problemId },
      data: { status: to, ...legacy }
    });

    await tx.auditLog.create({
      data: {
        userId: actor?.id || problem.reporterId,
        action: 'PROBLEM_STATUS_UPDATE',
        entityType: 'PROBLEM',
        entityId: problemId,
        ipAddress: actor?.ip || null,
        metadata: JSON.stringify({
          from,
          to,
          actorRole: actor?.role || null,
          ...(metadata ? metadata : {})
        })
      }
    });

    if (notify && notify.userId) {
      await tx.notification.create({
        data: {
          userId: notify.userId,
          type: notify.type || 'PROBLEM_UPDATE',
          title: notify.title || `Problem ${to.replace(/_/g, ' ').toLowerCase()}`,
          message: notify.message || `Your reported problem has been updated to: ${to}.`,
          referenceType: 'PROBLEM',
          referenceId: problemId
        }
      });
    }

    return updated;
  });

  return updated;
}

/**
 * Convenience: fetch a problem's current status.
 */
export async function getProblemStatus(problemId) {
  const problem = await prisma.problem.findUnique({
    where: { id: problemId },
    select: { id: true, status: true }
  });
  return problem ? problem.status : null;
}
