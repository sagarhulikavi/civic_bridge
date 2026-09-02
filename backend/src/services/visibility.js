import { PUBLIC_VISIBLE_STATUSES, APPROVED_PIPELINE_STATUSES } from './problemStatus.js';

/**
 * Role-based visibility restrictions.
 *
 * These helpers are used to build Prisma `where` clauses and to sanitize
 * problem payloads BEFORE they leave the backend, so that authorization is
 * enforced by the API itself rather than by the frontend.
 */

/**
 * Build the base status predicate for a viewer.
 * @param {object|null|undefined} user  The authenticated user (or null for public).
 * @returns {object} A Prisma filter object for `Problem.status`.
 */
export function statusFilterFor(user) {
  // Admin can see everything (moderation).
  if (user && user.role === 'ADMIN') {
    return {};
  }

  // Citizen: public-visible problems PLUS their own submissions in any state.
  if (user && user.role === 'CITIZEN') {
    return {
      OR: [
        { status: { in: PUBLIC_VISIBLE_STATUSES } },
        { reporterId: user.id }
      ]
    };
  }

  if (user && user.role === 'UNIVERSITY') {
    // Universities see approved-pipeline problems that are matched to their org.
    return {
      AND: [
        { status: { in: APPROVED_PIPELINE_STATUSES } },
        user.organizationId
          ? { matches: { some: { organizationId: user.organizationId } } }
          : {}
      ]
    };
  }

  if (user && user.role === 'INDUSTRY') {
    // Industry sees approved-pipeline problems matched to their org.
    return {
      AND: [
        { status: { in: APPROVED_PIPELINE_STATUSES } },
        user.organizationId
          ? { matches: { some: { organizationId: user.organizationId } } }
          : {}
      ]
    };
  }

  // Public / unauthenticated.
  return { status: { in: PUBLIC_VISIBLE_STATUSES } };
}

/**
 * Build a full Prisma `where` object from a viewer + query filters.
 * `filters` follows the existing GET /api/problems query shape.
 */
export function buildProblemWhere(user, filters = {}) {
  const clauses = [];

  // Role-based visibility predicate is always the outer bound (never bypassed).
  const statusPredicate = statusFilterFor(user);
  if (Object.keys(statusPredicate).length > 0) {
    clauses.push(statusPredicate);
  }

  // Explicit filters are AND'ed on top of the visibility bound.
  if (filters.status) clauses.push({ status: { equals: filters.status.toUpperCase() } });
  if (filters.category) clauses.push({ category: { name: { equals: filters.category } } });
  if (filters.priority) clauses.push({ priority: { equals: filters.priority.toUpperCase() } });
  if (filters.district) clauses.push({ location: { district: { contains: filters.district } } });
  if (filters.reporterId) clauses.push({ reporterId: filters.reporterId });
  if (filters.search) {
    clauses.push({
      OR: [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
        { displayId: { contains: filters.search } }
      ]
    });
  }

  if (clauses.length === 0) return {};
  if (clauses.length === 1) return clauses[0];
  return { AND: clauses };
}

/**
 * Decide whether a single (already loaded, with `matches` included) problem
 * is viewable by a given user. Used by the detail endpoint where combining the
 * role predicate with an id/displayId OR-clause would conflict in Prisma.
 */
export function canViewProblem(problem, user) {
  if (!problem) return false;
  if (user && user.role === 'ADMIN') return true;

  const status = problem.status;

  if (user && user.role === 'CITIZEN') {
    return PUBLIC_VISIBLE_STATUSES.includes(status) || problem.reporterId === user.id;
  }

  if (user && (user.role === 'UNIVERSITY' || user.role === 'INDUSTRY')) {
    if (!user.organizationId) return false;
    if (!APPROVED_PIPELINE_STATUSES.includes(status)) return false;
    // Universities/Industry see only problems matched to their org.
    const isMatched = Array.isArray(problem.matches)
      ? problem.matches.some((m) => m.organizationId === user.organizationId)
      : false;
    return isMatched;
  }

  // Public / unauthenticated.
  return PUBLIC_VISIBLE_STATUSES.includes(status);
}

/**
 * Strip personally-identifying / private fields from a problem before sending
 * to a viewer who is not the owner. Always removes email/phone; removes exact
 * coordinates only from non-owners/public. Returns a sanitized clone.
 */
export function sanitizeProblemForViewer(problem, user) {
  if (!problem) return problem;

  const isOwner = user && problem.reporterId === user.id;
  const isAdmin = user && user.role === 'ADMIN';

  const sanitized = { ...problem, reporter: undefined };

  if (problem.reporter) {
    if (isOwner || isAdmin) {
      sanitized.reporter = {
        id: problem.reporter.id,
        displayId: problem.reporter.displayId,
        name: problem.reporter.name,
        role: problem.reporter.role,
        preferredLanguage: problem.reporter.preferredLanguage,
        // Keep email/phone only for owners/admins.
        email: problem.reporter.email,
        phone: problem.reporter.phone
      };
    } else {
      sanitized.reporter = {
        id: problem.reporter.id,
        displayId: problem.reporter.displayId,
        name: problem.reporter.name,
        role: problem.reporter.role
      };
    }
  }

  // Exact coordinates are sensitive; keep only general location publicly.
  if (problem.location && !isOwner && !isAdmin) {
    sanitized.location = {
      ...problem.location,
      latitude: undefined,
      longitude: undefined,
      accuracy: undefined,
      rawAddress: undefined,
      postalCode: undefined
    };
  }

  return sanitized;
}
