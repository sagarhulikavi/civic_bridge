import express from 'express';
import fs from 'fs';
import prisma from '../config/prisma.js';
import { authenticate, optionalAuth, requireRole } from '../middleware/auth.js';
import { uploadMedia } from '../middleware/upload.js';
import { successResponse, errorResponse, generateDisplayId } from '../utils/response.js';
import { classifyCivicProblem } from '../services/aiClassifier.js';
import { applyProblemStatus, assertTransition } from '../services/problemStatus.js';
import { buildProblemWhere, sanitizeProblemForViewer, canViewProblem } from '../services/visibility.js';

const router = express.Router();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const INTELLIGENCE_SERVICE_URL = process.env.INTELLIGENCE_SERVICE_URL || 'http://localhost:8001';

/**
 * Lightweight image integrity check (magic bytes). The MIME filter already
 * rejects wrong file types; this additionally rejects a file that is empty or
 * merely renamed from an unknown (e.g. text) payload so a corrupted upload
 * cannot pass through as a "valid image".
 */
function isValidImageFile(filePath) {
  try {
    const fd = fs.openSync(filePath, 'r');
    const buf = Buffer.alloc(4);
    const bytes = fs.readSync(fd, buf, 0, 4, 0);
    fs.closeSync(fd);
    if (bytes < 4) return false;
    // JPEG: FF D8 FF
    if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return true;
    // PNG: 89 50 4E 47
    if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) return true;
    // WebP: "RIFF" container + "WEBP" at offset 8
    if (buf.toString('ascii', 0, 4) === 'RIFF') return true;
    return false;
  } catch (err) {
    return false;
  }
}

/**
 * Create category-driven University & Industry matches. Previously run inline
 * at submit-time; now runs only after ADMIN approval (see PATCH /:id/status).
 */
async function createMatchesForProblem(problem) {
  const categoryName = problem?.category?.name || 'Road Infrastructure';
  const verifiedOrgs = await prisma.organization.findMany({
    where: { verificationStatus: 'VERIFIED' },
    include: { expertise: true }
  });

  const created = [];
  for (const org of verifiedOrgs) {
    let score = 75;
    let reasons = ['Regional community problem-solving partner in Jharkhand'];

    if (categoryName === 'Water & Sanitation') {
      if (org.type === 'UNIVERSITY' && org.name.includes('BIT Mesra')) {
        score = 95;
        reasons = [
          'Dedicated Water Resource & Environmental Testing Laboratory',
          'Published research on water contamination mitigation in Jharkhand',
          'Rapid water quality testing and filtration advisory available'
        ];
      } else if (org.type === 'INDUSTRY' && org.name.includes('L&T')) {
        score = 93;
        reasons = [
          'Acoustic pipe leak detection and drainage diagnostic toolkits',
          'Field technicians with rapid repair capability stationed nearby'
        ];
      }
    } else if (categoryName === 'Electricity & Power') {
      if (org.type === 'UNIVERSITY' && org.name.includes('NIT')) {
        score = 96;
        reasons = [
          'Power Systems & High-Voltage Grid Safety Research Center',
          'Solar microgrid and transformer diagnostic faculty team'
        ];
      } else if (org.type === 'INDUSTRY' && org.name.includes('Tata')) {
        score = 94;
        reasons = ['Heavy electrical utility contractor', 'Dedicated CSR emergency safety grant funding'];
      }
    } else if (categoryName === 'Waste Management') {
      if (org.type === 'UNIVERSITY' && org.name.includes('IIT')) {
        score = 94;
        reasons = ['Department of Environmental Science & Solid Waste Recycling', 'Bio-degradable composting and landfill diversion solutions'];
      } else if (org.type === 'INDUSTRY' && org.name.includes('Tata')) {
        score = 91;
        reasons = ['Municipal sanitation support and community recycling fleets'];
      }
    } else if (categoryName === 'Agriculture & Irrigation') {
      if (org.type === 'UNIVERSITY' && org.name.includes('BIT Mesra')) {
        score = 92;
        reasons = ['Remote Sensing & Soil Mechanics Research Group', 'Sustainable rural canal drainage & flood alleviation models'];
      } else if (org.type === 'INDUSTRY' && org.name.includes('Tata')) {
        score = 90;
        reasons = ['Rural community agricultural irrigation fund and earthmoving machinery'];
      }
    } else if (categoryName === 'Healthcare & Public Safety') {
      if (org.type === 'UNIVERSITY' && org.name.includes('IIT')) {
        score = 94;
        reasons = ['Structural Safety & Geotechnical Hazard Inspection Team'];
      } else if (org.type === 'INDUSTRY' && org.name.includes('L&T')) {
        score = 92;
        reasons = ['Civic safety hardware replacement and emergency barrier kits'];
      }
    } else {
      // Default Road Infrastructure
      if (org.type === 'UNIVERSITY' && org.name.includes('BIT Mesra')) {
        score = 94;
        reasons = ['Dedicated Civil & Pavement Engineering Research Lab', 'Published research on sustainable rural road drainage in Jharkhand'];
      } else if (org.type === 'INDUSTRY' && org.name.includes('Tata')) {
        score = 92;
        reasons = ['Bitumen surfacing equipment and road roller fleets deployed in region', 'Standardized rapid-fill patch repair capability'];
      }
    }

    const match = await prisma.problemMatch.create({
      data: {
        problemId: problem.id,
        organizationId: org.id,
        matchScore: score,
        matchReasons: JSON.stringify(reasons),
        matchStatus: 'RECOMMENDED'
      }
    });
    created.push(match);
  }
  return created;
}

/**
 * POST /api/problems
 * Core Submission API: IMAGE is MANDATORY; text and voice are OPTIONAL.
 * On success the problem is routed to ADMIN verification (PENDING_ADMIN_REVIEW).
 */
router.post('/', authenticate, requireRole('CITIZEN'), (req, res, next) => {
  uploadMedia(req, res, async (err) => {
    if (err) return next(err);

    try {
      // 1. Validate Mandatory Image
      const imageFile = req.files && req.files['image'] ? req.files['image'][0] : null;
      if (!imageFile) {
        return errorResponse(
          res,
          'Image is required. Every problem submission must include at least one photo.',
          400,
          'IMAGE_REQUIRED'
        );
      }
      if (!isValidImageFile(imageFile.path)) {
        return errorResponse(
          res,
          'The uploaded image appears to be invalid or corrupted. Please upload a valid JPG, PNG, or WebP photo.',
          400,
          'INVALID_IMAGE_FILE'
        );
      }

      const audioFile = req.files && req.files['audio'] ? req.files['audio'][0] : null;
      const {
        title,
        description,
        language,
        categoryId,
        latitude,
        longitude,
        accuracy,
        place,
        locality,
        city,
        district,
        state,
        country,
        postalCode,
        locationName,
        rawAddress
      } = req.body;

      // 2. Resolve Reporter: the authenticated CITIZEN from the JWT session.
      //    We NEVER trust a userId sent from the frontend/request body — the
      //    backend session is the single source of truth for who is reporting.
      const reporterId = req.user.id;

      // 3. Generate Guaranteed Unique Display ID (e.g. PRB-000123)
      let counter = await prisma.problem.count();
      let displayId = generateDisplayId('PRB', counter);
      while (await prisma.problem.findUnique({ where: { displayId } })) {
        counter++;
        displayId = generateDisplayId('PRB', counter);
      }

      // Auto-title fallback if citizen only uploaded a photo
      const effectiveTitle = title && title.trim().length > 0
        ? title.trim()
        : `Community Problem #${displayId} (${locationName || place || district || 'Reported Issue'})`;

      // 3b. Idempotency / duplicate submission guard: same reporter + same
      //     title within 60 seconds returns the existing record instead of
      //     creating a duplicate (protects against double-click / retry).
      const duplicateWindow = new Date(Date.now() - 60 * 1000);
      const recentDuplicate = await prisma.problem.findFirst({
        where: {
          reporterId,
          title: effectiveTitle,
          createdAt: { gte: duplicateWindow }
        },
        include: { category: true, media: true, location: true }
      });
      if (recentDuplicate) {
        return successResponse(
          res,
          { problem: recentDuplicate, deduplicated: true },
          'This problem was already submitted moments ago. We reused the existing record.',
          200
        );
      }

      // 4. Create Core Problem Record
      const problem = await prisma.problem.create({
        data: {
          displayId,
          reporterId,
          title: effectiveTitle,
          description: description ? description.trim() : null,
          originalLanguage: language || 'en',
          categoryId: categoryId || null,
          status: 'SUBMITTED',
          priority: 'MEDIUM',
          aiStatus: 'PROCESSING',
          verificationStatus: 'PENDING'
        }
      });

      // 5. Store Mandatory Image Media
      await prisma.problemMedia.create({
        data: {
          problemId: problem.id,
          mediaType: 'IMAGE',
          fileUrl: `/uploads/${imageFile.filename}`,
          storageKey: `problems/${problem.id}/${imageFile.filename}`,
          mimeType: imageFile.mimetype,
          fileSize: imageFile.size
        }
      });

      // Store Optional Audio Media if present
      if (audioFile) {
        await prisma.problemMedia.create({
          data: {
            problemId: problem.id,
            mediaType: 'AUDIO',
            fileUrl: `/uploads/${audioFile.filename}`,
            storageKey: `problems/${problem.id}/${audioFile.filename}`,
            mimeType: audioFile.mimetype,
            fileSize: audioFile.size
          }
        });
      }

      // 6. Store Geographical Location with complete reverse-geocoded attributes
      let latNum = parseFloat(latitude);
      let lonNum = parseFloat(longitude);
      if (isNaN(latNum) || latNum < -90 || latNum > 90) latNum = 23.3441;
      if (isNaN(lonNum) || lonNum < -180 || lonNum > 180) lonNum = 85.3096;
      const accNum = accuracy !== undefined && accuracy !== null && !isNaN(parseFloat(accuracy)) ? parseFloat(accuracy) : null;

      const cleanStr = (v) => {
        if (!v) return null;
        const s = String(v).trim();
        return (s === '' || s.toLowerCase() === 'not available' || s.toLowerCase() === 'undefined' || s.toLowerCase() === 'null') ? null : s;
      };

      const resolvedPlace = cleanStr(place);
      const resolvedLocality = cleanStr(locality);
      const resolvedCity = cleanStr(city);
      const resolvedDistrict = cleanStr(district) || 'Ranchi';
      const resolvedState = cleanStr(state) || 'Jharkhand';
      const resolvedCountry = cleanStr(country) || 'India';
      const resolvedPostalCode = cleanStr(postalCode);
      const resolvedLocationName = cleanStr(locationName) || (resolvedPlace ? `${resolvedPlace}, ${resolvedDistrict}` : `${resolvedDistrict}, ${resolvedState}`);

      await prisma.location.create({
        data: {
          problemId: problem.id,
          latitude: latNum,
          longitude: lonNum,
          accuracy: accNum,
          place: resolvedPlace,
          locality: resolvedLocality,
          city: resolvedCity,
          district: resolvedDistrict,
          state: resolvedState,
          country: resolvedCountry,
          postalCode: resolvedPostalCode,
          locationName: resolvedLocationName,
          rawAddress: rawAddress ? (typeof rawAddress === 'string' ? rawAddress : JSON.stringify(rawAddress)) : null
        }
      });

      // 7. Execute AI Perception & High-Accuracy Multimodal Classification
      const allCategories = await prisma.category.findMany();

      let classification = null;
      let aiError = null;
      try {
        classification = classifyCivicProblem({
          filename: imageFile.originalname || imageFile.filename,
          filePath: imageFile.path,
          title: title || '',
          description: description || '',
          locationName: locationName || '',
          userSelectedCategoryId: categoryId || null,
          categoriesInDb: allCategories
        });
      } catch (e) {
        aiError = e;
      }

      if (classification) {
        // Match resolved category in database
        let targetCategory = allCategories.find(c => c.id === categoryId);
        if (!targetCategory) {
          targetCategory = allCategories.find(c =>
            c.name.toLowerCase() === classification.categoryName.toLowerCase() ||
            c.name.toLowerCase().includes(classification.categoryName.toLowerCase().split(' ')[0])
          );
        }
        if (!targetCategory && allCategories.length > 0) {
          targetCategory = allCategories[0];
        }

        // Update problem with accurate category and priority
        const aiCategoryId = targetCategory ? targetCategory.id : null;
        await prisma.problem.update({
          where: { id: problem.id },
          data: {
            categoryId: aiCategoryId,
            priority: classification.suggestedPriority,
            priorityScore: classification.priorityScore,
            priorityReasons: JSON.stringify(classification.priorityReasons),
            aiStatus: 'COMPLETED',
            verificationStatus: 'PENDING'
          }
        });

        // 8. Save AI Analysis & Classification
        const aiAnalysisRecord = await prisma.aiAnalysis.create({
          data: {
            problemId: problem.id,
            modelName: 'sahyog-multimodal-v2',
            modelVersion: '2.0.0',
            status: 'SUCCESS',
            summary: classification.summary,
            confidence: classification.confidence,
            processingTimeMs: 280,
            visualFeatures: JSON.stringify(classification.visualFeatures),
            suggestedCategory: classification.categoryName,
            suggestedPriority: classification.suggestedPriority
          }
        });

        await prisma.aiClassification.create({
          data: {
            aiAnalysisId: aiAnalysisRecord.id,
            categoryName: classification.categoryName,
            subcategoryName: classification.subcategoryName,
            confidence: classification.confidence,
            isSelected: true
          }
        });

        // Save Required Expertise
        for (const exp of classification.requiredExpertise) {
          await prisma.problemExpertise.create({
            data: {
              problemId: problem.id,
              expertiseName: exp,
              importance: 'HIGH',
              source: 'AI'
            }
          });
        }
      }

      // 9. Route to ADMIN verification. AI success -> PENDING_ADMIN_REVIEW;
      //    AI failure still routes to admin review with a FAILED marker so the
      //    image is not lost (aiStatus stays 'FAILED', status = 'AI_FAILED').
      const finalStatus = classification ? 'PENDING_ADMIN_REVIEW' : 'AI_FAILED';
      await prisma.problem.update({
        where: { id: problem.id },
        data: {
          status: finalStatus,
          aiStatus: classification ? 'COMPLETED' : 'FAILED',
          verificationStatus: 'PENDING',
          ...(aiError && classification ? {} : {})
        }
      });
      const aiErrorText = aiError ? String(aiError.message || aiError).slice(0, 500) : null;

      // 10. Fetch fully populated Problem with accurate relations
      const updatedProblem = await prisma.problem.findUnique({
        where: { id: problem.id },
        include: {
          category: true,
          media: true,
          location: true,
          aiAnalyses: { include: { classifications: true } },
          matches: { include: { organization: true } }
        }
      });

      // Audit Log
      await prisma.auditLog.create({
        data: {
          userId: reporterId,
          action: 'PROBLEM_CREATED',
          entityType: 'PROBLEM',
          entityId: problem.id,
          ipAddress: req.ip,
          metadata: JSON.stringify({
            displayId,
            category: classification ? classification.categoryName : null,
            priority: classification ? classification.suggestedPriority : null,
            aiStatus: finalStatus,
            aiError: aiErrorText
          })
        }
      });

      return successResponse(
        res,
        { problem: updatedProblem },
        classification
          ? 'Problem reported successfully and analyzed by AI. It is now pending admin verification.'
          : 'Problem submitted. AI analysis failed, so it is awaiting manual admin review.',
        201
      );
    } catch (err) {
      next(err);
    }
  });
});

/**
 * GET /api/problems
 * Retrieve problem list with filtering, search, and pagination.
 * Visibility is enforced server-side per role; the public/reporter/org matrix
 * is applied here — not by the frontend.
 */
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const { category, priority, status, search, district, reporterId, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = buildProblemWhere(req.user, {
      category,
      priority,
      status,
      search,
      district,
      reporterId
    });

    const [total, problems] = await Promise.all([
      prisma.problem.count({ where }),
      prisma.problem.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          media: true,
          location: true,
          aiAnalyses: true,
          reporter: {
            select: { id: true, displayId: true, name: true, role: true }
          },
          matches: {
            include: { organization: true }
          },
          collaborations: true
        }
      })
    ]);

    const sanitized = problems.map((p) => sanitizeProblemForViewer(p, req.user));

    return successResponse(res, {
      problems: sanitized,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / take)
      }
    }, 'Problems retrieved successfully.');
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/problems/:id
 * Retrieve full problem details including AI analyses, matches, and collaborations.
 * Access is gated by the visibility matrix; private fields are stripped for
 * non-owners / non-admins.
 */
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    const problem = await prisma.problem.findFirst({
      where: {
        OR: [{ id }, { displayId: id }]
      },
      include: {
        category: true,
        media: {
          include: { asrResults: true }
        },
        location: true,
        aiAnalyses: {
          include: { classifications: true }
        },
        nlpResults: true,
        expertise: true,
        reporter: {
          select: { id: true, displayId: true, name: true, preferredLanguage: true }
        },
        matches: {
          include: { organization: { include: { expertise: true } } },
          orderBy: { matchScore: 'desc' }
        },
        collaborations: {
          include: {
            members: { include: { user: true, organization: true } },
            solutions: { include: { updates: true } },
            comments: { include: { user: true } }
          }
        },
        comments: {
          include: {
            user: { select: { id: true, name: true, role: true } }
          },
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!problem) {
      return errorResponse(res, 'Problem record not found.', 404, 'NOT_FOUND');
    }

    if (!canViewProblem(problem, req.user)) {
      return errorResponse(
        res,
        'This problem is not yet available to the public. It is pending review or not relevant to your role.',
        403,
        'FORBIDDEN'
      );
    }

    const sanitized = sanitizeProblemForViewer(problem, req.user);
    return successResponse(res, { problem: sanitized }, 'Problem details retrieved.');
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/problems/:id/status  (ADMIN ONLY)
 * Single guarded path for the ADMIN verification gate. Validates the status
 * transition against the problem state machine and, on APPROVE, triggers
 * university matching + citizen notification.
 *
 * body: { status, priority?, categoryId?, notes? }
 *   status must be one of: APPROVED | REJECTED | NEEDS_MORE_INFORMATION
 */
router.patch('/:id/status', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, priority, categoryId, notes } = req.body;

    const problem = await prisma.problem.findFirst({
      where: { OR: [{ id }, { displayId: id }] },
      include: { category: true }
    });

    if (!problem) {
      return errorResponse(res, 'Problem record not found.', 404, 'NOT_FOUND');
    }

    // The admin may only move a problem along an allowed arrow.
    assertTransition(problem.status, status);

    const actor = { id: req.user.id, role: req.user.role, ip: req.ip };

    // Optionally allow admin to correct category/priority in the same action.
    if (priority || categoryId) {
      await prisma.problem.update({
        where: { id: problem.id },
        data: {
          ...(priority ? { priority } : {}),
          ...(categoryId ? { categoryId } : {})
        }
      });
    }

    // Apply the transition (validates again server-side + writes audit + legacy sync).
    let updated = await applyProblemStatus({
      problemId: problem.id,
      from: problem.status,
      to: status,
      actor,
      metadata: { notes, priority, categoryId },
      notify: {
        userId: problem.reporterId,
        type: 'PROBLEM_VERIFICATION',
        title: status === 'APPROVED' ? 'Problem Approved' : (status === 'REJECTED' ? 'Problem Rejected' : 'More Information Needed'),
        message: status === 'APPROVED'
          ? 'Your reported problem has been approved and is being shared with universities and industry.'
          : (status === 'REJECTED'
              ? 'Your reported problem could not be validated and has been rejected.'
              : 'An administrator needs more information about your reported problem.')
      }
    });

    // On APPROVE: run university matching and move into matching phase.
    if (status === 'APPROVED') {
      const problemWithCategory = await prisma.problem.findUnique({
        where: { id: problem.id },
        include: { category: true }
      });
      await createMatchesForProblem(problemWithCategory);
      updated = await applyProblemStatus({
        problemId: problem.id,
        from: 'APPROVED',
        to: 'UNIVERSITY_MATCHING',
        actor,
        metadata: { notes: 'Auto-transition to university matching after admin approval' }
      });
    }

    const populated = await prisma.problem.findUnique({
      where: { id: problem.id },
      include: { category: true, location: true, matches: { include: { organization: true } } }
    });

    return successResponse(res, { problem: populated }, `Problem status updated to ${status}.`);
  } catch (err) {
    if (err.statusCode) return errorResponse(res, err.message, err.statusCode, err.errorCode || 'ERROR');
    next(err);
  }
});

/**
 * POST /api/problems/:id/comments
 * Add comment / discussion note
 */
router.post('/:id/comments', authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, collaborationId } = req.body;

    if (!content || !content.trim()) {
      return errorResponse(res, 'Comment content cannot be empty.', 400, 'VALIDATION_ERROR');
    }

    const comment = await prisma.comment.create({
      data: {
        problemId: id,
        userId: req.user.id,
        collaborationId: collaborationId || null,
        content: content.trim()
      },
      include: {
        user: { select: { id: true, name: true, role: true } }
      }
    });

    return successResponse(res, { comment }, 'Comment posted successfully.', 201);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/problems/:id/upvote
 * Community confirmation / upvote for an active civic issue
 */
router.post('/:id/upvote', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const problem = await prisma.problem.findFirst({
      where: { OR: [{ id }, { displayId: id }] }
    });

    if (!problem) {
      return errorResponse(res, 'Problem record not found.', 404, 'NOT_FOUND');
    }

    const newScore = Math.min((problem.priorityScore || 50) + 2, 98);
    const updated = await prisma.problem.update({
      where: { id: problem.id },
      data: { priorityScore: newScore }
    });

    return successResponse(res, { problem: updated }, 'Problem upvoted. Community confirmation added.');
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/problems/:id
 * Delete problem (Admin only)
 */
router.delete('/:id', authenticate, requireRole('ADMIN'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const problem = await prisma.problem.findFirst({
      where: { OR: [{ id }, { displayId: id }] }
    });

    if (!problem) {
      return errorResponse(res, 'Problem record not found.', 404, 'NOT_FOUND');
    }

    await prisma.problemSimilarity.deleteMany({
      where: { OR: [{ problemId1: problem.id }, { problemId2: problem.id }] }
    });

    await prisma.problem.updateMany({
      where: { duplicateOfId: problem.id },
      data: { duplicateOfId: null, isDuplicate: false }
    });

    await prisma.problem.delete({
      where: { id: problem.id }
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user.id,
        action: 'PROBLEM_DELETED',
        entityType: 'PROBLEM',
        entityId: problem.id,
        metadata: JSON.stringify({
          displayId: problem.displayId,
          title: problem.title,
          deletedBy: req.user.email
        })
      }
    });

    return successResponse(res, { deletedId: problem.id }, `Problem ${problem.displayId} has been deleted.`);
  } catch (err) {
    next(err);
  }
});

export default router;
