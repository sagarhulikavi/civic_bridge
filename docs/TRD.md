# Technical Requirements Document (TRD)

## Project

**Sahyog — AI-Powered Multilingual Societal Problem Crowdsourcing and Collaborative Problem-Solving Platform**

**Purpose:** Technical blueprint for building, integrating, testing, and deploying the SIH solution.

---

# 1. Technical Objectives

The system shall:

1. Accept a **mandatory image** for every societal problem submission.
2. Accept **optional text** and **optional voice** input.
3. Support multilingual interaction, with initial focus on **English, Hindi, and Khortha**.
4. Analyze images using computer vision.
5. Process text and speech-derived text using NLP.
6. Convert voice to text using ASR.
7. Combine image, text, voice, language, and location signals.
8. Classify and structure the reported problem.
9. Calculate an assistive priority score.
10. Detect potential duplicate reports.
11. Cluster similar problems.
12. Route problems to relevant expertise/departments.
13. Match problems with universities.
14. Match problems with industries.
15. Provide explainable recommendations.
16. Allow human/admin review.
17. Track a problem from submission to resolution.
18. Maintain secure communication between all services.

---

# 2. System Architecture

## 2.1 High-Level Architecture

```text
                         ┌─────────────────────┐
                         │       USERS         │
                         │ Citizen / Admin     │
                         │ University / Industry│
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      FRONTEND       │
                         │ React / Web App     │
                         └──────────┬──────────┘
                                    │ HTTPS
                                    ▼
                         ┌─────────────────────┐
                         │     API GATEWAY     │
                         │ Auth / Rate Limit   │
                         │ Routing / Validation│
                         └──────────┬──────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
        ┌────────────────┐ ┌────────────────┐ ┌──────────────────┐
        │    BACKEND     │ │   AI SERVICE   │ │  INTELLIGENCE    │
        │ API + Business │ │ Vision/NLP/ASR │ │ Matching/Ranking │
        │ Logic          │ │ Multimodal     │ │ Priority/Cluster │
        └───────┬────────┘ └───────┬────────┘ └────────┬─────────┘
                │                  │                   │
                └──────────────────┼───────────────────┘
                                   ▼
                         ┌─────────────────────┐
                         │ DATABASE / STORAGE  │
                         │ PostgreSQL + Object │
                         │ Storage              │
                         └─────────────────────┘
```

---

# 3. Four Technical Divisions

## Division 1 — Frontend

Responsibilities:

- User interface
- Language selection
- Image upload
- Optional text input
- Optional voice recording
- Location capture
- Authentication UI
- Problem dashboard
- Admin dashboard
- University dashboard
- Industry dashboard
- Recommendation display
- Problem status tracking

Suggested stack:

```text
React
JavaScript / TypeScript
HTML5
CSS3
Tailwind CSS
Axios / Fetch
```

---

# 4. Division 2 — Backend

Responsibilities:

- REST APIs
- Authentication
- Authorization
- Problem management
- User management
- File metadata
- Database operations
- API gateway integration
- Service-to-service communication
- Notifications
- Audit logs

Suggested stack:

```text
Node.js
Express.js
PostgreSQL
Prisma ORM
JWT
```

FastAPI may be used instead of Express if the team prefers Python.

---

# 5. Division 3 — AI Service

Responsibilities:

- Image analysis
- Image classification
- Object/scene understanding
- OCR where required
- Language detection
- NLP
- ASR
- Khortha processing pipeline
- Text embedding
- Image embedding
- Multimodal analysis
- AI confidence
- Structured problem extraction

Suggested stack:

```text
Python
FastAPI
PyTorch
Transformers
OpenCV
Pillow
scikit-learn
sentence-transformers
```

Specific models should be selected after benchmarking available models against the project's actual data.

---

# 6. Division 4 — Intelligence Service

Responsibilities:

- Priority engine
- Duplicate detection
- Similarity search
- Problem clustering
- Department routing
- University matching
- Industry matching
- Ranking
- Recommendations
- Explainability
- Human feedback processing

Suggested stack:

```text
Python
FastAPI
PostgreSQL
pgvector
scikit-learn
NumPy
Pandas
```

---

# 7. API Gateway

The API Gateway is the main entry point between the frontend and backend services.

## Responsibilities

```text
Client
  ↓
API Gateway
  ├── Authentication
  ├── Authorization
  ├── Rate Limiting
  ├── Request Validation
  ├── Routing
  ├── Logging
  └── Error Handling
```

The frontend should generally communicate with the gateway rather than directly accessing internal AI/database services.

---

# 8. Gateway Routes

Example external routes:

```text
/api/v1/auth/*
/api/v1/problems/*
/api/v1/users/*
/api/v1/ai/*
/api/v1/intelligence/*
/api/v1/universities/*
/api/v1/industries/*
/api/v1/admin/*
```

Internal routing:

```text
/api/v1/ai/*
        ↓
AI Service

/api/v1/intelligence/*
        ↓
Intelligence Service
```

---

# 9. API Versioning

All production APIs should be versioned.

Example:

```text
/api/v1/problems
```

Future breaking changes can use:

```text
/api/v2/problems
```

---

# 10. Authentication

Use token-based authentication.

Recommended:

```text
User
 ↓
Login
 ↓
Backend
 ↓
JWT Access Token
 ↓
Frontend
 ↓
API Gateway
 ↓
Protected API
```

Roles:

```text
CITIZEN
ADMIN
UNIVERSITY
INDUSTRY
```

Authorization must be checked server-side.

---

# 11. Core API Specification

## 11.1 Authentication APIs

### Register

```http
POST /api/v1/auth/register
```

Request:

```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password"
}
```

Response:

```json
{
  "user_id": "USR-001",
  "message": "Registration successful"
}
```

---

### Login

```http
POST /api/v1/auth/login
```

Response:

```json
{
  "access_token": "...",
  "token_type": "Bearer",
  "role": "CITIZEN"
}
```

---

# 12. Problem Submission API

## Create Problem

```http
POST /api/v1/problems
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

Required:

```text
image
```

Optional:

```text
text
audio
latitude
longitude
language
```

Example logical request:

```text
image = road.jpg
text = "Large potholes near school"
audio = optional.webm
latitude = 23.xxxxx
longitude = 85.xxxxx
language = khortha
```

Response:

```json
{
  "problem_id": "PRB-001",
  "status": "SUBMITTED"
}
```

---

# 13. Problem Retrieval APIs

```http
GET /api/v1/problems
GET /api/v1/problems/{problem_id}
PUT /api/v1/problems/{problem_id}
DELETE /api/v1/problems/{problem_id}
```

Filtering:

```text
?category=infrastructure
?priority=high
?status=submitted
?language=khortha
?location=...
```

---

# 14. AI API Gateway

## Image Analysis

```http
POST /api/v1/ai/image/analyze
```

Input:

```json
{
  "problem_id": "PRB-001",
  "image_url": "..."
}
```

Output:

```json
{
  "category": "Infrastructure",
  "subcategory": "Road Damage",
  "confidence": 0.91,
  "visual_features": [
    "pothole",
    "damaged road"
  ]
}
```

---

# 15. ASR API

## Voice Transcription

```http
POST /api/v1/ai/audio/transcribe
```

Input:

```text
audio file
language = khortha
```

Output:

```json
{
  "language": "khortha",
  "transcript": "...",
  "confidence": 0.82
}
```

If the system cannot reliably determine the language, it should return an appropriate low-confidence/error state rather than inventing a transcription.

---

# 16. NLP API

```http
POST /api/v1/ai/text/analyze
```

Input:

```json
{
  "text": "There are large potholes near the school.",
  "language": "en"
}
```

Output:

```json
{
  "summary": "Large potholes reported near a school.",
  "category": "Infrastructure",
  "subcategory": "Road Damage",
  "keywords": [
    "potholes",
    "road",
    "school"
  ],
  "expertise": [
    "Civil Engineering",
    "Road Infrastructure"
  ]
}
```

---

# 17. Multimodal AI API

```http
POST /api/v1/ai/multimodal/analyze
```

Input:

```json
{
  "problem_id": "PRB-001",
  "image": "...",
  "text": "...",
  "transcript": "...",
  "language": "khortha"
}
```

Output:

```json
{
  "summary": "...",
  "category": "Infrastructure",
  "subcategory": "Road Damage",
  "expertise": [
    "Civil Engineering"
  ],
  "confidence": 0.89
}
```

The multimodal service should gracefully handle:

```text
Image only
Image + Text
Image + Voice
Image + Text + Voice
```

---

# 18. Intelligence APIs

## Priority

```http
POST /api/v1/intelligence/priority
```

Response:

```json
{
  "problem_id": "PRB-001",
  "priority": "HIGH",
  "score": 78,
  "reasons": [
    "Public infrastructure affected",
    "Multiple nearby reports"
  ]
}
```

---

## Duplicate Detection

```http
POST /api/v1/intelligence/duplicates
```

Response:

```json
{
  "problem_id": "PRB-001",
  "potential_duplicates": [
    {
      "problem_id": "PRB-102",
      "similarity": 0.91
    }
  ]
}
```

The result is a candidate list, not an automatic deletion/merge decision.

---

## Clustering

```http
POST /api/v1/intelligence/cluster
```

Output:

```json
{
  "cluster_id": "CL-001",
  "problem_ids": [
    "PRB-001",
    "PRB-014",
    "PRB-021"
  ]
}
```

---

# 19. University Matching API

```http
POST /api/v1/intelligence/university-matches
```

Input:

```json
{
  "problem_id": "PRB-001",
  "expertise": [
    "Civil Engineering",
    "Road Infrastructure"
  ]
}
```

Output:

```json
{
  "matches": [
    {
      "university_id": "UNI-001",
      "score": 0.92,
      "reasons": [
        "Civil Engineering department",
        "Road infrastructure research"
      ]
    }
  ]
}
```

---

# 20. Industry Matching API

```http
POST /api/v1/intelligence/industry-matches
```

Output:

```json
{
  "matches": [
    {
      "industry_id": "IND-001",
      "score": 0.89,
      "reasons": [
        "IoT capability",
        "Infrastructure deployment experience"
      ]
    }
  ]
}
```

---

# 21. Recommendation API

```http
GET /api/v1/intelligence/recommendations/{problem_id}
```

Response:

```json
{
  "problem_id": "PRB-001",
  "priority": "HIGH",
  "department": "Road/Public Works",
  "universities": [],
  "industries": [],
  "similar_problems": []
}
```

---

# 22. Human Feedback APIs

```http
POST /api/v1/admin/review/{problem_id}
POST /api/v1/admin/merge
POST /api/v1/admin/reject
POST /api/v1/admin/correct-classification
POST /api/v1/admin/update-priority
```

Example:

```json
{
  "decision": "APPROVED",
  "comment": "Classification verified by administrator."
}
```

---

# 23. API Communication Model

## Frontend → Gateway

```text
HTTPS
REST/JSON
Multipart for files
JWT authentication
```

## Gateway → Backend

```text
Internal HTTPS/REST
```

## Backend → AI

```text
REST
JSON
Object-storage references for large files
```

## Backend → Intelligence

```text
REST
JSON
```

## Services → Database

```text
PostgreSQL
```

---

# 24. Avoid Sending Large Files Between Services

Do not repeatedly send large image/audio files through every service.

Recommended:

```text
Frontend
   ↓
Backend
   ↓
Object Storage
   ↓
File URL / Object ID
   ↓
AI Service
```

This reduces network traffic and improves scalability.

---

# 25. Database Requirements

Recommended database:

**PostgreSQL**

Core entities:

```text
users
roles
problems
problem_media
problem_analysis
problem_categories
problem_locations
problem_status
problem_clusters
universities
university_expertise
industries
industry_capabilities
recommendations
collaborations
feedback
notifications
audit_logs
```

---

# 26. Problem Table

Conceptual structure:

```text
problems
----------------------------
id
user_id
title
description
language
category_id
subcategory_id
status
priority
latitude
longitude
created_at
updated_at
```

---

# 27. Media Table

```text
problem_media
----------------------------
id
problem_id
type
storage_key
mime_type
file_size
created_at
```

Types:

```text
IMAGE
AUDIO
```

Image is mandatory at the problem level.

Audio remains optional.

---

# 28. AI Analysis Table

```text
problem_analysis
----------------------------
id
problem_id
model_name
model_version
category
subcategory
summary
keywords
expertise
confidence
raw_result
created_at
```

Store model/version information so AI outputs can be traced.

---

# 29. Vector Search

Vector embeddings can be used for:

- Duplicate detection
- Semantic similarity
- Problem clustering
- University matching
- Industry matching

Recommended initial approach:

```text
PostgreSQL
+
pgvector
```

Conceptually:

```text
Problem Text
     ↓
Embedding Model
     ↓
Vector
     ↓
Vector Database
     ↓
Similarity Search
```

---

# 30. Matching Architecture

Matching should not rely only on a single AI score.

Use multiple signals.

Example:

```text
Expertise Match
      +
Research Match
      +
Technology Match
      +
Location Relevance
      +
Previous Project Relevance
      ↓
Weighted Ranking
      ↓
Final Match Score
```

---

# 31. Priority Engine

Example conceptual formula:

```text
Priority Score =
    Severity Weight
  + Affected Population Weight
  + Safety Weight
  + Recurrence Weight
  + Geographic/Infrastructure Weight
```

Normalize the final score to:

```text
0 – 100
```

Example:

```text
0–24    LOW
25–49   MEDIUM
50–74   HIGH
75–100  CRITICAL
```

These thresholds should be calibrated with test data and domain review.

---

# 32. Duplicate Detection Architecture

Use multiple signals:

```text
Image Embedding
      +
Text Embedding
      +
Location Distance
      +
Category
      +
Time
      ↓
Similarity Model
      ↓
Duplicate Probability
```

Example conceptual score:

```text
Duplicate Score =
0.40 × Image Similarity
+
0.35 × Text Similarity
+
0.15 × Location Similarity
+
0.10 × Category Similarity
```

Weights are configurable and must be validated experimentally.

---

# 33. Problem Clustering

Possible approach:

```text
Problem Embeddings
       ↓
Similarity Matrix
       ↓
Clustering Algorithm
       ↓
Problem Groups
```

Possible algorithms:

- DBSCAN
- HDBSCAN
- K-Means for suitable datasets

Location can be incorporated as an additional feature.

---

# 34. AI Pipeline

Complete AI flow:

```text
                    IMAGE
                      │
                      ▼
              Computer Vision
                      │
                      ▼
               Visual Features
                      │
                      │
VOICE ──→ ASR ──→ TRANSCRIPT
                      │
                      ▼
                    NLP
                      │
                      ▼
             Language Processing
                      │
                      ▼
             Semantic Embeddings
                      │
                      ▼
              Multimodal Fusion
                      │
                      ▼
             Structured Problem
                      │
                      ├── Category
                      ├── Summary
                      ├── Expertise
                      └── Confidence
```

---

# 35. Khortha Processing Pipeline

Initial architecture:

```text
Khortha Voice
      ↓
ASR
      ↓
Khortha Transcript
      ↓
Language Processing
      ↓
Translation / Cross-lingual Representation
      ↓
NLP
      ↓
Problem Understanding
```

For Khortha, the team should benchmark available ASR, multilingual and translation models on a locally collected/test dataset before selecting a production model.

---

# 36. Async Processing

AI operations may take longer than normal CRUD operations.

Recommended:

```text
Problem Submitted
      ↓
status = AI_PROCESSING
      ↓
Background Job
      ↓
AI Analysis
      ↓
Intelligence Processing
      ↓
status = AI_ANALYZED
      ↓
Recommendations Ready
```

A queue can be introduced if processing volume increases.

Possible technologies:

```text
Redis
Celery
RabbitMQ
```

For an MVP, synchronous processing may be acceptable for lightweight operations.

---

# 37. API Gateway Security

Gateway should implement:

- JWT validation
- Role checks
- Request size limits
- File upload validation
- Rate limiting
- CORS
- Request logging
- Correlation IDs
- Error normalization

Example:

```text
Request
 ↓
Authentication
 ↓
Authorization
 ↓
Validation
 ↓
Rate Limit
 ↓
Route
 ↓
Service
```

---

# 38. File Security

Uploaded files must be validated.

Check:

- MIME type
- File extension
- File size
- File signature/magic bytes
- Malware scanning where appropriate
- Storage permissions

Never trust only the filename extension.

---

# 39. Error Handling

Use consistent API errors.

Example:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_IMAGE",
    "message": "Uploaded file is not a supported image."
  },
  "request_id": "REQ-123"
}
```

Recommended HTTP codes:

```text
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
413 Payload Too Large
422 Validation Error
429 Too Many Requests
500 Internal Server Error
503 Service Unavailable
```

---

# 40. API Response Standard

Success:

```json
{
  "success": true,
  "data": {},
  "request_id": "REQ-123"
}
```

Failure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  },
  "request_id": "REQ-123"
}
```

---

# 41. API Documentation

Use:

```text
OpenAPI / Swagger
```

Each service should document:

- Endpoint
- Method
- Request
- Response
- Authentication
- Error responses
- Example payloads

---

# 42. Service Health Checks

Each backend service should expose:

```http
GET /health
```

Example:

```json
{
  "status": "healthy",
  "service": "ai-service"
}
```

Optional detailed endpoint:

```http
GET /health/ready
```

---

# 43. Logging

Every service should log:

- Timestamp
- Service name
- Request ID
- User ID where appropriate
- Endpoint
- Status code
- Processing duration
- Error information

Do not log:

- Passwords
- JWT secrets
- API keys
- Sensitive user content unnecessarily

---

# 44. Observability

Track:

- API latency
- Error rate
- AI processing time
- Queue length
- Database latency
- Model failures
- Match generation time

For an MVP, structured application logs are sufficient.

Advanced deployment may add:

```text
Prometheus
Grafana
OpenTelemetry
```

---

# 45. Caching

Caching can be used for relatively stable data:

- University profiles
- Industry profiles
- Category lists
- Language metadata

Avoid caching sensitive user-specific information without proper controls.

Possible technology:

```text
Redis
```

---

# 46. Environment Configuration

Use environment variables.

Example:

```text
DATABASE_URL=
JWT_SECRET=
OBJECT_STORAGE_URL=
OBJECT_STORAGE_KEY=
AI_SERVICE_URL=
INTELLIGENCE_SERVICE_URL=
REDIS_URL=
```

Never commit secrets to GitHub.

Provide:

```text
.env.example
```

instead of:

```text
.env
```

---

# 47. Repository Structure

Recommended final monorepo:

```text
sih-project/
│
├── frontend/
│
├── backend/
│
├── ai-service/
│
├── intelligence-service/
│
├── docs/
│   ├── PRD.md
│   ├── TRD.md
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── DATABASE.md
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

# 48. AI Service Structure

```text
ai-service/
│
├── app/
│   ├── api/
│   ├── models/
│   │   ├── vision/
│   │   ├── nlp/
│   │   ├── asr/
│   │   └── multimodal/
│   ├── services/
│   ├── schemas/
│   ├── utils/
│   ├── config/
│   └── main.py
│
├── datasets/
├── notebooks/
├── tests/
├── requirements.txt
├── Dockerfile
└── README.md
```

---

# 49. Intelligence Service Structure

```text
intelligence-service/
│
├── app/
│   ├── api/
│   ├── engines/
│   │   ├── priority_engine.py
│   │   ├── similarity_engine.py
│   │   └── ranking_engine.py
│   ├── services/
│   │   ├── priority_service.py
│   │   ├── duplicate_service.py
│   │   ├── clustering_service.py
│   │   ├── routing_service.py
│   │   ├── university_match_service.py
│   │   ├── industry_match_service.py
│   │   └── recommendation_service.py
│   ├── schemas/
│   ├── utils/
│   ├── config/
│   └── main.py
│
├── datasets/
├── tests/
├── requirements.txt
├── Dockerfile
└── README.md
```

---

# 50. Backend Structure

```text
backend/
│
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── middleware/
│   ├── validators/
│   ├── config/
│   └── app.js
│
├── prisma/
│   └── schema.prisma
│
├── tests/
├── .env.example
├── package.json
└── README.md
```

---

# 51. Frontend Structure

```text
frontend/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   ├── i18n/
│   ├── assets/
│   └── App.jsx
│
├── public/
├── .env.example
├── package.json
└── README.md
```

---

# 52. Internationalization Architecture

Frontend:

```text
i18n/
├── en.json
├── hi.json
└── kh.json
```

Example:

```json
{
  "submit_problem": "Submit Problem",
  "upload_image": "Upload Image",
  "optional_voice": "Voice (Optional)"
}
```

The language layer should be independent from AI language processing.

UI translation and user-content NLP are two different technical concerns.

---

# 53. Database + AI Integration

Recommended:

```text
PostgreSQL
      │
      ├── Relational Data
      │
      └── pgvector
              │
              ├── Text Embeddings
              ├── Image Embeddings
              └── Problem Embeddings
```

---

# 54. Object Storage

Images/audio should preferably be stored in object storage rather than directly inside PostgreSQL.

Example:

```text
Frontend
   ↓
Backend
   ↓
Object Storage
   ↓
object_key
   ↓
Database
```

Database stores metadata, not large binary files.

---

# 55. Data Flow — Complete Submission

```text
1. User opens website
        ↓
2. Selects language
        ↓
3. Uploads mandatory image
        ↓
4. Adds optional text
        ↓
5. Adds optional voice
        ↓
6. Adds location
        ↓
7. Frontend validates input
        ↓
8. API Gateway
        ↓
9. Backend stores problem
        ↓
10. Image/audio stored
        ↓
11. AI Service processes input
        ↓
12. Structured AI result
        ↓
13. Backend stores AI result
        ↓
14. Intelligence Service
        ↓
15. Priority
        ↓
16. Duplicate detection
        ↓
17. Clustering
        ↓
18. Routing
        ↓
19. University matching
        ↓
20. Industry matching
        ↓
21. Recommendations
        ↓
22. Admin review
        ↓
23. Final decision
        ↓
24. Collaboration/status tracking
```

---

# 56. Minimum Technology Stack

For an SIH MVP, keep the stack manageable.

```text
Frontend:
React + Tailwind CSS

Backend:
Node.js + Express

Database:
PostgreSQL + Prisma

AI:
Python + FastAPI

ML:
PyTorch / Transformers / scikit-learn

Vector Search:
pgvector

Storage:
S3-compatible object storage

Authentication:
JWT

API:
REST + OpenAPI

Deployment:
Docker

Version Control:
Git + GitHub
```

---

# 57. Testing Requirements

## Frontend Tests

Test:

- Image upload
- Required image validation
- Optional text
- Optional voice
- Language switching
- Form validation
- Dashboard

## Backend Tests

Test:

- Authentication
- Authorization
- CRUD
- File metadata
- API validation
- Database operations

## AI Tests

Test:

- Image classification
- Text classification
- ASR
- Language handling
- Khortha pipeline
- Multimodal processing

## Intelligence Tests

Test:

- Priority
- Duplicate detection
- Clustering
- University ranking
- Industry ranking
- Recommendation explanations

---

# 58. End-to-End Test

The most important test:

```text
Image + Optional Text/Voice
          ↓
Problem Created
          ↓
AI Analysis
          ↓
Structured Result
          ↓
Priority
          ↓
Duplicate Detection
          ↓
University Matching
          ↓
Industry Matching
          ↓
Recommendation
          ↓
Admin Review
```

This should work with a realistic SIH demo dataset.

---

# 59. AI Evaluation

Do not evaluate the AI only by whether the demo "looks correct."

Create a test dataset.

Measure:

### Classification

- Accuracy
- Precision
- Recall
- F1-score

### Retrieval / Matching

- Precision@K
- Recall@K
- Mean Reciprocal Rank where appropriate

### ASR

- Word Error Rate where a reliable reference transcript exists

### Duplicate Detection

- Precision
- Recall
- F1-score

The team should report the evaluation methodology and dataset limitations.

---

# 60. Security Checklist

Before deployment:

```text
[ ] HTTPS enabled
[ ] JWT authentication implemented
[ ] Role-based authorization implemented
[ ] Secrets removed from source code
[ ] File validation implemented
[ ] Upload size limits implemented
[ ] SQL injection protection
[ ] XSS protection
[ ] CORS configured
[ ] Rate limiting
[ ] Input validation
[ ] Error handling
[ ] Audit logging
[ ] Database backups
```

---

# 61. Deployment Architecture

Recommended:

```text
                    INTERNET
                       │
                       ▼
                  HTTPS / DNS
                       │
                       ▼
                 Reverse Proxy
                       │
                       ▼
                  API Gateway
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
       Backend       AI Service  Intelligence
          │            │            │
          └────────────┼────────────┘
                       ▼
                  PostgreSQL
                       │
                       ▼
                 Object Storage
```

Docker should be used so that each service has a reproducible environment.

---

# 62. CI/CD

GitHub-based workflow:

```text
Developer
   ↓
Git Branch
   ↓
Pull Request
   ↓
Automated Tests
   ↓
Code Review
   ↓
Merge
   ↓
Build
   ↓
Docker Image
   ↓
Deployment
```

Recommended branch structure:

```text
main
develop
feature/*
bugfix/*
```

---

# 63. Integration Contract Between Divisions

## Division 1 → Division 2

Sends:

```text
image
text
audio
language
location
user_id
```

## Division 2 → Division 3

Sends:

```text
problem_id
image_reference
text
audio_reference
language
```

## Division 3 → Division 2

Returns:

```text
category
subcategory
summary
keywords
expertise
confidence
embeddings/reference
```

## Division 2 → Division 4

Sends:

```text
problem_id
category
summary
expertise
location
embedding
metadata
```

## Division 4 → Division 2

Returns:

```text
priority
duplicate_candidates
cluster
department
university_matches
industry_matches
recommendations
explanations
```

---

# 64. Important Technical Rule

Do not allow the four divisions to independently invent different data formats.

Create shared API contracts.

For example:

```json
{
  "problem_id": "PRB-001",
  "category": "Infrastructure",
  "subcategory": "Road Damage",
  "language": "khortha",
  "location": {
    "latitude": 23.0,
    "longitude": 85.0
  }
}
```

Every service should follow the agreed contract.

---

# 65. Recommended Development Order

### Phase 1 — Foundation

```text
Git
Project structure
Frontend
Backend
Database
API Gateway
Authentication
```

### Phase 2 — Problem Submission

```text
Image upload
Text input
Voice input
Location
Storage
Problem API
```

### Phase 3 — AI

```text
Image classification
ASR
NLP
Khortha pipeline
Multimodal processing
```

### Phase 4 — Intelligence

```text
Priority
Duplicate detection
Clustering
Routing
University matching
Industry matching
Recommendations
```

### Phase 5 — Integration

```text
Frontend
 ↕
Backend
 ↕
AI
 ↕
Intelligence
```

### Phase 6 — Testing & Demo

```text
Test dataset
Performance testing
AI evaluation
Security testing
End-to-end testing
SIH demo
```

---

# 66. Definition of Done

The MVP is technically complete when:

- [ ] Frontend is connected to backend.
- [ ] User can register/login.
- [ ] Image is mandatory.
- [ ] Text is optional.
- [ ] Voice is optional.
- [ ] Location can be captured.
- [ ] Problem is stored in PostgreSQL.
- [ ] Image/audio is stored securely.
- [ ] AI service can process image.
- [ ] NLP can process available text.
- [ ] ASR can process supported voice input.
- [ ] Khortha processing pipeline is integrated/tested.
- [ ] Structured AI output is generated.
- [ ] Priority engine works.
- [ ] Duplicate detection works.
- [ ] Similar problems can be clustered.
- [ ] Expertise/department routing works.
- [ ] University matching works.
- [ ] Industry matching works.
- [ ] Recommendations include explanations.
- [ ] Admin can review AI results.
- [ ] Problem status can be updated.
- [ ] APIs are documented.
- [ ] Errors are handled consistently.
- [ ] Logs are available.
- [ ] End-to-end demo works.

---

# 67. Final Technical Architecture

```text
┌─────────────────────────────────────────────────────────┐
│                         USERS                           │
│ Citizen | Admin | University | Industry                 │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                       FRONTEND                          │
│ React | Multilingual UI | Image | Voice | Text | Maps  │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────┐
│                     API GATEWAY                         │
│ Auth | RBAC | Validation | Rate Limit | Routing | Logs │
└──────────────┬───────────────┬───────────────┬──────────┘
               │               │               │
               ▼               ▼               ▼
       ┌──────────────┐ ┌──────────────┐ ┌───────────────┐
       │   BACKEND    │ │  AI SERVICE  │ │ INTELLIGENCE  │
       │ Node/Express │ │   Python     │ │    Python     │
       │ REST APIs    │ │ Vision/NLP   │ │ Ranking       │
       │ Auth/CRUD    │ │ ASR/Multimodal│ │ Matching     │
       └───────┬──────┘ └──────┬───────┘ └───────┬───────┘
               │               │                 │
               └───────────────┼─────────────────┘
                               ▼
                  ┌─────────────────────────┐
                  │       PostgreSQL        │
                  │ Relational + pgvector   │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │      Object Storage     │
                  │ Images / Audio / Files  │
                  └─────────────────────────┘
```

---

# 68. Technical Principle

The platform should follow this principle:

> **Image is mandatory evidence. Text and voice are optional additional evidence. AI assists understanding and matching. Humans retain final authority over important decisions.**

The architecture should be modular so that an individual AI model can be replaced without rebuilding the entire application.

The initial SIH implementation should prioritize a reliable end-to-end workflow over excessive model complexity.
