# 🏛️ SAHYOG — Production-Grade Technical Architecture & Project Context Report
**Document Version:** 1.0.0  
**Target Purpose:** Complete Technical Specification, Codebase Blueprint & AI Context Handover Document  
**Platform:** Sahyog (AI-Powered Multilingual Societal Problem Crowdsourcing & Collaborative Resolution)

---

## 📑 Table of Contents
1. [Executive Summary & Core Objective](#1-executive-summary--core-objective)
2. [Complete Tech Stack & Dependencies](#2-complete-tech-stack--dependencies)
3. [Repository Directory Structure & File Map](#3-repository-directory-structure--file-map)
4. [Frontend Architecture & Flow](#4-frontend-architecture--flow)
5. [Backend Architecture & API Specifications](#5-backend-architecture--api-specifications)
6. [Data Flow & Interconnections ("What Connects to What")](#6-data-flow--interconnections-what-connects-to-what)
7. [Environment Variables, Secrets & External Integrations](#7-environment-variables-secrets--external-integrations)
8. [Database Schema & Seed Accounts](#8-database-schema--seed-accounts)
9. [AI Vision, Speech & Perception Engine](#9-ai-vision-speech--perception-engine)
10. [Setup, Seeding & End-to-End Test Guide](#10-setup-seeding--end-to-end-test-guide)
11. [Current Limitations & Future Recommendations](#11-current-limitations--future-recommendations)
12. [AI Assistant Handover Instructions & Constraints](#12-ai-assistant-handover-instructions--constraints)

---

## 1. Executive Summary & Core Objective

### 1.1 Platform Overview & Problem Statement
**Sahyog** is an AI-powered, multilingual civic crowdsourcing and collaborative problem-solving platform. It addresses the systemic friction in public infrastructure maintenance and municipal service delivery across Indian states and rural/semi-urban districts (with specific linguistic optimizations for **Hindi**, **Khortha**, and **Indian English**).

Traditional grievance portals often fail due to:
1. **High entry barriers for non-literate or vernacular citizens** (complex text-heavy forms, lack of vernacular voice support).
2. **Inaccurate civic problem classification and priority scoring**, causing critical hazards (e.g., live hanging electric wires or open deep manholes) to languish in backlogs behind cosmetic complaints.
3. **Siloed municipal operations without academic or industrial synergy**, missing out on regional university technical labs (e.g., pavement testing at BIT Mesra, structural geology at IIT ISM Dhanbad) and corporate CSR/engineering fleets (e.g., Tata Steel, L&T Infrastructure).

Sahyog transforms citizen reporting by enforcing **mandatory image capture** (reducing spam and enabling computer vision validation) while making **text and voice notes optional**. It uses multimodal AI perception, automated reverse-geocoding, multi-signal duplicate detection, deterministic risk scoring, and explainable organization matching to route issues directly into multi-stakeholder **Collaboration Workspaces** where progress is tracked up to 100% completion and civic resolution.

```
       ┌───────────────────────────────┐
       │   CITIZEN REPORTING CLIENT    │
       │  (Vite + React 18, Leaflet,   │
       │  Audio Recorder, Multi-Lang)  │
       └──────────────┬────────────────┘
                      │ HTTP Multipart Form / JWT
                      ▼
       ┌───────────────────────────────┐
       │   EXPRESS API GATEWAY (5000)  │
       │   (Routing, Auth, Validation, │
       │    Rate Limit, Reverse-Geo)   │
       └──────┬──────────────┬─────────┘
              │              │
    Prisma ORM│              │ Subprocess / HTTP Bridge
              ▼              ▼
 ┌──────────────────────┐  ┌──────────────────────────────────────┐
 │   SQLITE / POSTGRES  │  │         AI & PERCEPTION HUB          │
 │    (18 Relational    │  │ • MobileNetV3 (PyTorch) Image Model  │
 │     Prisma Models)   │  │ • OpenCV Spatial & HSV Edge Analysis │
 └──────────────────────┘  │ • Multilingual NLP & Dialect ASR     │
                           │ • Decision Engine & Duplicate Triage │
                           └──────────────────────────────────────┘
```

---

## 2. Complete Tech Stack & Dependencies

### 2.1 Frontend Stack
* **Core Framework:** React 18.3.1 (Single Page Application via `vite.config.js`)
* **Routing:** `react-router-dom` (v6.26.2) with declarative route guards (`ProtectedRoute`)
* **Styling & Design System:** Vanilla CSS + Tailwind CSS (v3.4.11) with customized civic color palette (`brand-50` to `brand-900`), custom shadows, and `@tailwindcss/forms`
* **Icons & UI Components:** `lucide-react` (v0.441.0)
* **GIS & Mapping:** `leaflet` (v1.9.4) interactive map picker with custom SVG markers, draggable pins, and OpenStreetMap tile layers
* **State Management:** React Context API (`AuthContext.jsx`, `LanguageContext.jsx`)
* **Client-side HTTP:** `axios` (v1.7.7) with request/response interceptors for Bearer token injection and error unwrapping
* **Vernacular Audio:** Native HTML5 `MediaRecorder` API producing WebM audio blobs for speech-to-text processing

### 2.2 Backend Gateway Stack
* **Runtime & Server:** Node.js (ES Module syntax: `"type": "module"`), Express.js (v4.21.0)
* **ORM & Database Client:** Prisma ORM (`@prisma/client` v5.19.1, `prisma` CLI v5.19.1)
* **Authentication & Security:** `jsonwebtoken` (v9.0.2), `bcryptjs` (v2.4.3), `express-rate-limit` (v7.4.0), `cors` (v2.8.5)
* **File Upload Handling:** `multer` (v1.4.5-lts.1) with disk storage, UUID naming, and strict MIME-type guards
* **Logging & Telemetry:** `morgan` (v1.10.0)
* **HTTP Client:** `axios` (v1.7.7) for reverse-geocoding via OpenStreetMap Nominatim and microservice federation

### 2.3 AI & Intelligence Services (Python)
* **Web Framework:** FastAPI (v0.115.0+), Uvicorn (v0.30.0+) ASGI server
* **Data Validation:** Pydantic (v2.9.0+)
* **Computer Vision & Deep Learning:** PyTorch (`torch`, `torchvision` with pretrained MobileNetV3 Small weights), OpenCV (`cv2`), Pillow (`PIL`), NumPy
* **NLP & Regex Engine:** Multi-dialect regex keyword matching (Hindi Devanagari, Khortha vernacular lexical patterns, and Indian English)

### 2.4 Persistence & Data Storage
* **Primary Database:** SQLite (`file:./dev.db` configured via `schema.prisma`, direct drop-in PostgreSQL support)
* **Media Storage:** Local disk filesystem storage under `backend/uploads/` with public static serving via `/uploads`

---

## 3. Repository Directory Structure & File Map

```
sahyog/
├── .env.example                               # Root environment configuration template
├── package.json                               # Root workspace scripts (concurrently runner)
├── Sahyog_PRD.md                              # Product Requirements Document
├── Sahyog_Technical_Requirements_Document.md  # Technical Requirements Document
├── test_flow.py                               # Comprehensive end-to-end integration test runner
├── ai-service/                                # Python AI Vision & Perception Microservice
│   ├── requirements.txt                       # Python dependencies (FastAPI, Torch, OpenCV, Pillow)
│   ├── classify_cli.py                        # Standalone CLI bridge for Node.js image classification
│   └── app/
│       ├── main.py                            # FastAPI perception endpoints (Vision, ASR, NLP)
│       └── cv_classifier.py                   # Deep Learning (MobileNetV3) + OpenCV Spatial Analyzer
├── intelligence-service/                      # Python Decision & Matching Microservice
│   ├── requirements.txt                       # Python dependencies (FastAPI, NumPy, Pydantic)
│   └── app/
│       └── main.py                            # Priority scoring, duplicate check, and matching engine
├── backend/                                   # Express.js REST API Gateway & Business Engine
│   ├── package.json                           # Backend dependencies and Prisma scripts
│   ├── prisma/
│   │   ├── schema.prisma                      # Complete 18-model relational schema
│   │   ├── seed.js                            # Seed script with verified orgs, categories & demo users
│   │   └── dev.db                             # SQLite database file
│   ├── uploads/                               # Static storage directory for submitted media
│   └── src/
│       ├── server.js                          # HTTP server bootstrapper (Port 5000)
│       ├── app.js                             # Express application configuration, middleware & router
│       ├── config/
│       │   └── prisma.js                      # Singleton Prisma Client instance
│       ├── middleware/
│       │   ├── auth.js                        # JWT verification & RBAC middleware (requireRole)
│       │   ├── error.js                       # Centralized global error handler
│       │   └── upload.js                      # Multer configuration for image & audio multipart fields
│       ├── routes/
│       │   ├── admin.routes.js                # Administrator triage, analytics, and override routes
│       │   ├── ai.routes.js                   # AI proxy and history endpoints
│       │   ├── auth.routes.js                 # Authentication, registration, password recovery
│       │   ├── category.routes.js             # Multilingual category listing
│       │   ├── collaboration.routes.js        # Multi-stakeholder workspace & solution milestones
│       │   ├── location.routes.js             # Forward and reverse-geocoding endpoints
│       │   ├── match.routes.js                # Organization recommendation & duplicate lookup
│       │   ├── organization.routes.js         # Verified institutions and expertise lookup
│       │   ├── problem.routes.js              # Problem submission, listing, details, and lifecycle
│       │   └── support.routes.js              # Support ticketing system
│       ├── services/
│       │   ├── aiClassifier.js                # AI classification taxonomy & Python CV subprocess bridge
│       │   └── geocodingService.js            # OpenStreetMap Nominatim reverse & forward geocoding
│       └── utils/
│           └── response.js                    # Standardized API response envelopes & display ID generator
└── frontend/                                  # React 18 Single Page Application
    ├── package.json                           # Frontend dependencies (React, Vite, Leaflet, Tailwind)
    ├── vite.config.js                         # Vite dev server configuration with /api & /uploads proxy
    ├── tailwind.config.js                     # Tailwind theme extensions & typography tokens
    ├── index.html                             # HTML5 root template
    └── src/
        ├── main.jsx                           # React DOM root mounting
        ├── App.jsx                            # Router configuration & role-based ProtectedRoute guards
        ├── index.css                          # Global styling, Leaflet overrides, and animations
        ├── context/
        │   ├── AuthContext.jsx                # User session, JWT persistence, login/logout functions
        │   └── LanguageContext.jsx            # Localization provider (English, Hindi, Khortha)
        ├── locales/
        │   ├── en.json                        # English UI translation strings
        │   ├── hi.json                        # Hindi UI translation strings
        │   └── kh.json                        # Khortha UI translation strings
        ├── services/
        │   └── api.js                         # Configured Axios instance with auth interceptors
        ├── components/
        │   ├── common/
        │   │   ├── AIAnalysisCard.jsx         # Card displaying confidence, tags, and priority rationale
        │   │   ├── InteractiveMapPicker.jsx   # OpenStreetMap Leaflet component with draggable pin
        │   │   ├── StatusTimeline.jsx         # Lifecycle visualization (Submitted -> Resolved)
        │   │   └── VoiceRecorder.jsx          # Vernacular audio recording widget
        │   └── layout/
        │       ├── CookieBanner.jsx           # GDPR/DPDP compliant consent banner
        │       ├── Footer.jsx                 # Global civic footer with quick links and hotlines
        │       └── Navbar.jsx                 # Multilingual navbar with role badge & navigation
        └── pages/
            ├── Home.jsx                       # Landing page with hero, statistics, and domain showcase
            ├── ReportProblem.jsx              # Problem submission wizard (Photo, Voice, GPS, AI preview)
            ├── ProblemDetails.jsx             # Comprehensive problem view, AI breakdown & match ranking
            ├── ExploreProblems.jsx            # Filterable civic issue registry (map & grid views)
            ├── CollaborationWorkspace.jsx     # Shared project management room for Universities & Industry
            ├── Login.jsx                      # User sign-in with quick role-selection demo buttons
            ├── Register.jsx                   # Account registration with organization affiliation
            ├── ForgotPassword.jsx             # Password reset request flow
            ├── Support.jsx                    # Citizen helpdesk and support ticket submission
            ├── PrivacyPolicy.jsx              # DPDP/GDPR compliant privacy policy
            ├── Terms.jsx                      # Terms of service and platform governance
            ├── CookiePreferences.jsx          # Granular cookie preferences manager
            ├── RefundPolicy.jsx               # Civic donation & transaction policy
            ├── Maintenance.jsx                # Emergency maintenance mode page
            ├── AccessDenied403.jsx            # 403 Forbidden unauthorized page
            ├── NotFound404.jsx                # 404 Route not found fallback
            └── dashboards/
                ├── AdminDashboard.jsx         # Governance dashboard with overrides and audit stream
                ├── CitizenDashboard.jsx       # Personal submission tracker and notifications
                ├── UniversityDashboard.jsx    # Matched research problem discovery and collaboration
                └── IndustryDashboard.jsx      # CSR alignment, matched projects, and progress tracker
```

---

## 4. Frontend Architecture & Flow

### 4.1 Routing Architecture
Routing is handled through `react-router-dom` v6 inside `frontend/src/App.jsx`. Routes are divided into Public Core Routes, Authentication Routes, Role-Protected Dashboards, and System/Legal Pages.

```
Browser Request
 ├── "/"                        -> Home.jsx (Public Landing)
 ├── "/report"                  -> ReportProblem.jsx (Public / Citizen Submission)
 ├── "/explore"                 -> ExploreProblems.jsx (Public Filterable Catalog)
 ├── "/problems/:id"            -> ProblemDetails.jsx (Deep Issue View + Match Matrix)
 ├── "/collaborations/:id"      -> CollaborationWorkspace.jsx (Collaborative Resolution Room)
 ├── "/support"                 -> Support.jsx (Public Helpdesk)
 ├── "/login"                   -> Login.jsx (Authentication)
 ├── "/register"                -> Register.jsx (User / Org Registration)
 ├── "/dashboard/citizen"       -> Protected (CITIZEN, ADMIN) -> CitizenDashboard.jsx
 ├── "/dashboard/university"    -> Protected (UNIVERSITY, ADMIN) -> UniversityDashboard.jsx
 ├── "/dashboard/industry"      -> Protected (INDUSTRY, ADMIN) -> IndustryDashboard.jsx
 ├── "/dashboard/admin"         -> Protected (ADMIN) -> AdminDashboard.jsx
 └── "*"                        -> NotFound404.jsx (Fallback)
```

### 4.2 State Management & Client-Side Data Fetching
* **Authentication State:** Managed via `AuthContext`. On application mount, it inspects `localStorage` for `sahyog_token`. If present, it verifies the session against `GET /api/v1/auth/me` and exposes `user`, `login()`, `logout()`, `isAuthenticated`, and role booleans (`isCitizen`, `isUniversity`, `isIndustry`, `isAdmin`).
* **Multilingual Localization State:** Managed via `LanguageContext`. Persists language preference (`sahyog_lang` in `localStorage`) across English (`en`), Hindi (`hi`), and Khortha (`kh`), providing a reactive `t(key)` translation function backed by JSON locale dictionaries.
* **Data Fetching Pattern:** Handled via component-level `useEffect` hooks calling the configured `api` instance (`api.js`). Requests automatically attach the Bearer token in the `Authorization` header. Responses unwrap the standard `data` envelope and handle network/server errors cleanly.

---

## 5. Backend Architecture & API Specifications

### 5.1 Server Entry Point & Middleware Chain
The backend entry point is `backend/src/server.js`, which loads environment variables and starts the Express server from `backend/src/app.js`.

The middleware pipeline executes in the following sequence:
1. **CORS:** Allows requests from `CLIENT_URL` (default `http://localhost:5173`) with credentials enabled.
2. **Body Parsers:** `express.json({ limit: '10mb' })` and `express.urlencoded({ extended: true, limit: '10mb' })`.
3. **HTTP Request Logger:** `morgan('dev')` (active in non-production environments).
4. **Rate Limiting:** `express-rate-limit` restricting IPs to 300 requests per 15-minute window across `/api/*`.
5. **Static File Server:** Serves uploaded problem photos and voice recordings from `/uploads`.
6. **API Versioning Router:** Mounts routes on both `/api/v1/*` and `/api/*`.
7. **404 Catch-All:** Returns standardized JSON 404 response for unknown routes.
8. **Global Error Handler:** `errorHandler` middleware intercepts exceptions, formats Multer/Prisma errors, and prevents sensitive stack leakages.

### 5.2 Complete Route & Endpoint Registry

| HTTP Method | Endpoint Path | Auth / Role Required | Handler / File | Expected Input | Expected Output |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | `auth.routes.js` | `{ name, email, password, phone?, preferredLanguage?, role?, organizationId? }` | `201 Created`: `{ user, token }` |
| `POST` | `/api/v1/auth/login` | Public | `auth.routes.js` | `{ email, password }` | `200 OK`: `{ user, token }` |
| `GET` | `/api/v1/auth/me` | `authenticate` | `auth.routes.js` | Bearer Token in Header | `200 OK`: `{ user }` with Organization details |
| `PATCH` | `/api/v1/auth/me` | `authenticate` | `auth.routes.js` | `{ name?, phone?, preferredLanguage? }` | `200 OK`: `{ user }` updated |
| `POST` | `/api/v1/auth/forgot-password` | Public | `auth.routes.js` | `{ email }` | `200 OK`: Generic safe success message |
| `POST` | `/api/v1/problems` | `optionalAuth` | `problem.routes.js` | Multipart Form (`image` [REQUIRED], `audio`?, `title`?, `description`?, `latitude`, `longitude`, `district`?, `language`?) | `201 Created`: Full problem object with AI classifications, media, and matches |
| `GET` | `/api/v1/problems` | Public | `problem.routes.js` | Query: `category`, `priority`, `status`, `search`, `district`, `page`, `limit` | `200 OK`: `{ problems: [...], pagination: {...} }` |
| `GET` | `/api/v1/problems/:id` | Public | `problem.routes.js` | Param: `id` (UUID or Display ID `PRB-000001`) | `200 OK`: Full relational problem record |
| `PATCH` | `/api/v1/problems/:id/status` | `authenticate` | `problem.routes.js` | `{ status?, priority?, categoryId? }` | `200 OK`: Updated problem object |
| `POST` | `/api/v1/problems/:id/comments` | `authenticate` | `problem.routes.js` | `{ content, collaborationId? }` | `201 Created`: Created comment record |
| `POST` | `/api/v1/problems/:id/upvote` | `optionalAuth` | `problem.routes.js` | Param: `id` | `200 OK`: Increments `priorityScore` and community validation count |
| `DELETE` | `/api/v1/problems/:id` | `authenticate` + `ADMIN` | `problem.routes.js` | Param: `id` | `200 OK`: Problem deleted & audit logged |
| `GET` | `/api/v1/categories` | Public | `category.routes.js` | None | `200 OK`: Active categories with English, Hindi, and Khortha titles |
| `GET` | `/api/v1/organizations` | Public | `organization.routes.js` | Query: `type`, `search`, `district` | `200 OK`: Verified organizations with expertise profiles |
| `GET` | `/api/v1/matches/problem/:problemId` | Public | `match.routes.js` | Param: `problemId` | `200 OK`: Ranked University & Industry matches with match reasons |
| `POST` | `/api/v1/matches/duplicates/check` | Public | `match.routes.js` | `{ problemId?, category, title?, description?, latitude?, longitude? }` | `200 OK`: `{ is_potential_duplicate, candidates }` |
| `POST` | `/api/v1/collaborations` | `authenticate` | `collaboration.routes.js` | `{ problemId, organizationId?, title?, description? }` | `201 Created`: Active workspace & default Solution milestone |
| `GET` | `/api/v1/collaborations/:id` | Public | `collaboration.routes.js` | Param: `id` (or `problemId`) | `200 OK`: Workspace with members, solution milestones, and discussion |
| `POST` | `/api/v1/collaborations/:id/solutions/:solutionId/updates` | `authenticate` | `collaboration.routes.js` | `{ title, description, progressPercentage, stage? }` | `201 Created`: Milestone update logged; auto-resolves problem at 100% |
| `POST` | `/api/v1/location/reverse-geocode` | Public | `location.routes.js` | `{ latitude, longitude, accuracy? }` | `200 OK`: Structured address (place, locality, district, state, postal code) |
| `GET` | `/api/v1/location/search` | Public | `location.routes.js` | Query: `q` (search string) | `200 OK`: Matched locations via forward geocoding |
| `GET` | `/api/v1/admin/dashboard` | `authenticate` + `ADMIN` | `admin.routes.js` | Bearer Token in Header | `200 OK`: Aggregated problem metrics, user counts, and recent audit logs |
| `POST` | `/api/v1/admin/problems/:id/override` | `authenticate` + `ADMIN` | `admin.routes.js` | `{ categoryId?, priority?, status?, notes? }` | `200 OK`: Verified problem status override & audit log |
| `POST` | `/api/v1/admin/problems/merge` | `authenticate` + `ADMIN` | `admin.routes.js` | `{ primaryId, duplicateId }` | `200 OK`: Duplicates linked and merged |
| `GET` | `/api/v1/admin/audit-logs` | `authenticate` + `ADMIN` | `admin.routes.js` | Query: `limit?` | `200 OK`: Immutable audit trail records |
| `POST` | `/api/v1/support` | `optionalAuth` | `support.routes.js` | `{ email, category, subject, description }` | `201 Created`: Support ticket (`SUP-000001`) |

---

## 6. Data Flow & Interconnections ("What Connects to What")

### 6.1 Step-by-Step Request Trace
1. **User Interaction on Frontend:**
   * Citizen opens `/report` (`ReportProblem.jsx`).
   * Browser requests GPS coordinates via `navigator.geolocation.getCurrentPosition`.
   * Request dispatched to `POST /api/v1/location/reverse-geocode`. Backend queries OpenStreetMap Nominatim and returns normalized place, district, and state details.
   * Citizen takes a photo (`image` file input, **mandatory**) and optionally records a voice note (`audio` WebM blob).
2. **Multipart Submission to API Gateway:**
   * `axios` sends `multipart/form-data` payload to `POST /api/v1/problems`.
   * Multer middleware validates `image` is present and within 10MB, saving it to `backend/uploads/`.
3. **Database Entity Initialization:**
   * Unique sequential ID is generated (e.g. `PRB-000012`).
   * `Problem`, `ProblemMedia`, and `Location` records are inserted.
4. **AI Perception & Classification:**
   * `classifyCivicProblem()` in `aiClassifier.js` spawns `classify_cli.py` passing the image file path.
   * MobileNetV3 and OpenCV spatial analysis classify visual features and primary domain.
   * `AiAnalysis`, `AiClassification`, and `ProblemExpertise` records are saved.
5. **Organization Match Generation:**
   * Gateway queries verified universities and industrial CSR bodies matching required expertise.
   * Matches (e.g., BIT Mesra 94%, Tata Steel 92%) are saved as `ProblemMatch` with explainability reasons.
6. **Collaboration & Resolution:**
   * Partner logs in and clicks "Join Collaboration" on `/problems/:id`.
   * `POST /api/v1/collaborations` initializes workspace and default `Solution` in `DESIGN` stage.
   * Partners log milestone progress (`POST /api/v1/collaborations/:id/solutions/:solutionId/updates`).
   * At 100% progress, status automatically transitions to `RESOLVED`.

---

## 7. Environment Variables, Secrets & External Integrations

### 7.1 Environment Variables Table
Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL="file:./dev.db"
JWT_SECRET=sahyog_super_secret_jwt_key_development_only_change_in_production_2026
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=10
AI_SERVICE_URL=http://localhost:8000
INTELLIGENCE_SERVICE_URL=http://localhost:8001
MAINTENANCE_MODE=false
```

### 7.2 External Integrations
1. **OpenStreetMap Nominatim API:**
   * Reverse and forward geocoding in `backend/src/services/geocodingService.js`.
   * Configured with User-Agent `Sahyog-Societal-Portal/1.0`, timeout 6.5s, and fallback coordinates.
2. **OpenStreetMap Tile Server:**
   * Rendered via Leaflet in `frontend/src/components/common/InteractiveMapPicker.jsx`.
3. **PyTorch MobileNetV3 Model:**
   * `MobileNet_V3_Small_Weights.DEFAULT` in `ai-service/app/cv_classifier.py`.

---

## 8. Database Schema & Seed Accounts

### 8.1 Seed Accounts (Password for all: `Password@123`)

| Role | Email | Name / Affiliation | Purpose |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@sahyog.gov.in` | Admin Officer | Access `/dashboard/admin`, triage issues, override AI, view audit logs. |
| **CITIZEN** | `citizen@sahyog.in` | Ramesh Kumar (Citizen) | Access `/dashboard/citizen`, submit problems with photos/audio. |
| **UNIVERSITY**| `prof.sharma@bitmesra.ac.in` | Prof. Anil Sharma (BIT Mesra) | Access `/dashboard/university`, review matched R&D civic problems. |
| **INDUSTRY** | `siddharth@tatasteel.com` | Siddharth Roy (Tata Steel CSR)| Access `/dashboard/industry`, sponsor/log 100% resolution milestones. |

---

## 9. AI Vision, Speech & Perception Engine

### 9.1 The 6 Civic Problem Domains & Visual Classifiers
1. **Road Infrastructure:** Potholes, asphalt cavities, road cracks, broken culverts (`gray_ratio` dominant, road edge textures).
2. **Water & Sanitation:** Pipeline ruptures, drain overflow, sewage leaks (`blue_ratio` dominant, surface liquid pooling).
3. **Waste Management:** Open garbage heaps, plastic accumulation (`color_std` high entropy, quantized palette clutter).
4. **Electricity & Power:** Sagging high-voltage wires, transformer hazards (Hough Line Detector `minLineLength=50`, angle consistency).
5. **Agriculture & Irrigation:** Canal embankment breach, crop inundation (`green_ratio` + `brown_ratio` soil silt index).
6. **Healthcare & Public Safety:** Open subterranean pits, missing manhole covers (Hough Circle Dark Cavity Detector).

---

## 10. Setup, Seeding & End-to-End Test Guide

### 10.1 Quick Start
```bash
# 1. Install all dependencies
npm run install:all

# 2. Setup and seed database
cd backend
npx prisma db push
node prisma/seed.js
cd ..

# 3. Start development servers
npm run dev
```

### 10.2 Run Golden Flow Test
```bash
python test_flow.py
```
*Validates: Authentication &rarr; Mandatory Image Validation &rarr; Multimodal Submission &rarr; Explainable Matches &rarr; Collaboration Room &rarr; 100% Resolution Status.*

---

## 11. Current Limitations & Future Recommendations
1. **Database Concurrency:** SQLite is ideal for local development. For production horizontal scaling, change `DATABASE_URL` in `schema.prisma` to PostgreSQL (`provider = "postgresql"`).
2. **Media Storage:** Currently saves to local disk `./uploads`. For production, configure AWS S3 / Cloudflare R2 bucket with pre-signed upload URLs.
3. **Asynchronous ML Worker:** Currently executes via synchronous CLI bridge. For production bursts, decouple via Redis + BullMQ queue.

---

## 12. AI Assistant Handover Instructions & Constraints

If you are an AI assistant taking over this codebase, **strictly adhere to the following rules**:
1. **Mandatory Image Constraint:** Never remove or make the photo upload optional in `ReportProblem.jsx`, `problem.routes.js`, or `upload.js`.
2. **Standard API Response Envelopes:** Always return responses using `successResponse(res, data, message, statusCode)` or `errorResponse(res, message, statusCode, errorCode)` from `backend/src/utils/response.js`.
3. **Multilingual Consistency:** Ensure any new UI text includes translation keys in `en.json`, `hi.json`, and `kh.json`.
4. **Leaflet & OpenStreetMap:** Do not replace Leaflet with proprietary Google Maps keys. Nominatim and OpenStreetMap tile layers are free and open-source.
5. **Role-Based Access Control:** Use `authenticate` and `requireRole(...)` on all protected endpoints.

---

## 13. Workflow Redesign — Admin-Verified Problem-Solving Pipeline (Implementation Report)

**Goal:** Convert the problem-reporting flow into a controlled, AI-assisted, Admin-verified, University-matched, Industry-supported civic problem-solving workflow with backend-enforced visibility and role-based access.

### Root causes fixed
1. **Public API leaked unreviewed problems** — `GET /api/problems` returned all rows regardless of status.
2. **Status updates were unprivileged & unvalidated** — `PATCH /:id/status` used only `authenticate` (any logged-in role) with no transition validation; a CITIZEN could set `APPROVED`/`RESOLVED` and bypass the workflow.
3. **No guarded admin approve/reject** — the admin override set `verificationStatus:'APPROVED'` unconditionally.
4. **Matching ran at submit-time** to every verified org, not after approval.
5. **University/Industry portals saw all problems** (no approval or match filter).
6. **No duplicate-submission protection.**

### State machine (`backend/src/services/problemStatus.js`)
Unified `Problem.status` as the single source of truth; `aiStatus`/`verificationStatus` synced in lockstep (no new DB columns).
Canonical arrows:
`SUBMITTED → AI_ANALYZING → PENDING_ADMIN_REVIEW → APPROVED → UNIVERSITY_MATCHING → UNIVERSITY_INTERESTED → IDEA_SUBMITTED → INDUSTRY_REVIEW → ACCEPTED → PROTOTYPE_DEVELOPMENT → IMPLEMENTED → RESOLVED`, with `REJECTED`, `DECLINED`, `NEEDS_MORE_INFORMATION`, `AI_FAILED`, `CANCELLED` handled. Invalid arrows return `409 INVALID_STATUS_TRANSITION`.

### Visibility (`backend/src/services/visibility.js`)
`buildProblemWhere(user, filters)` + `canViewProblem(problem, user)` + `sanitizeProblemForViewer` enforce per-role visibility in Prisma queries (not frontend):
- Public: `APPROVED` onward.
- Citizen: public + own submissions (any state).
- University/Industry: approved-pipeline problems matched to their org only.
- `sanitizeProblemForViewer` strips email/phone/exact coords from non-owners.

### Routes
- `problem.routes.js` — submit (image mandatory + magic-byte integrity check, defer matching, route to `PENDING_ADMIN_REVIEW`/`AI_FAILED`, 60s dedupe); list/detail now visibility-gated; `PATCH /:id/status` is `requireRole('ADMIN')` + transition validation + on APPROVE creates matches and transitions to `UNIVERSITY_MATCHING`.
- `workflow.routes.js` (new) — role-guarded actions: University interest/idea/prototype; Industry review/support/implement/resolve.
- `match.routes.js` — match-status edits require org ownership + valid enum.
- `admin.routes.js` — override routes status through the state machine; pending stat counts `PENDING_ADMIN_REVIEW`/`AI_FAILED`/`NEEDS_MORE_INFORMATION`.

### Frontend
- `StatusTimeline.jsx` — new 7-stage canonical timeline + `STATUS_LABELS`.
- `ReportProblem.jsx` — restricts image to JPG/PNG/WebP, updated success messaging.
- `AdminDashboard.jsx` — Pending Verification gate (Approve / Reject / More Info) using the guarded endpoint.
- `CitizenDashboard.jsx` — accurate pending/pipeline counts + friendly status labels.
- `University/IndustryDashboard.jsx` — status chips + context-aware workflow action buttons.
- `ProblemDetails.jsx` — admin override routes status via the guarded PATCH.

### Test result (against live backend, `__flow.mjs`)
`PASS: 35 / FAIL: 0` across login, submit (valid/no image/invalid image), dedupe, public-visibility before/after approval, citizen/university approve blocked (403), invalid transition rejected (409), admin approve → `UNIVERSITY_MATCHING` + matches, full University→Industry→Resolved pipeline. Frontend `npm run build` succeeds (only the pre-existing >500 kB chunk warning).

### Remaining / not covered
- `ai-service` vision/ASR/NLP are reused as-is; submit-time call ordering changed only in the backend. External real CV-model quality was not validated (no live model).
- Sector-specific "reach out to unmatched orgs" and parallel multi-org matching beyond a single sequential pipeline are not implemented.
- No new i18n keys were added for the new status labels in `en/hi/kh.json` (labels render in English via `STATUS_LABELS`).
