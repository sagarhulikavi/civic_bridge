# Database Schema & Data Storage Plan

## Project

**Sahyog — AI-Powered Multilingual Societal Problem Crowdsourcing and Collaborative Problem-Solving Platform**

---

# 1. Database Architecture

The system will use multiple storage layers depending on the type of data.

## Primary Database

**PostgreSQL**

Used for:

- Users
- Roles
- Problems
- Categories
- Locations
- AI results
- Organizations
- Matching
- Collaboration
- Solutions
- Notifications
- Audit logs

## Object/File Storage

Used for:

- Problem images
- Voice/audio files
- Other uploaded media

## Redis

Optional, used for:

- Caching
- Rate limiting
- Background job queues
- Temporary processing states

---

# 2. High-Level Architecture

```text
                    FRONTEND
                React / Next.js
                       |
                       v
                  BACKEND API
                       |
          +------------+------------+
          |            |            |
          v            v            v
     PostgreSQL   Object Storage   Redis
       Database    Images/Audio    Cache/Queue
          |
          v
      AI PIPELINE
          |
    +-----+-----+-----+
    |           |     |
    v           v     v
 Vision        ASR   NLP
    |           |     |
    +-----------+-----+
                |
                v
        MULTIMODAL ANALYSIS
                |
                v
        MATCHING ENGINE
                |
        +-------+-------+
        |               |
        v               v
   UNIVERSITY        INDUSTRY
        |               |
        +-------+-------+
                |
                v
         COLLABORATION
                |
                v
            SOLUTION
3. Main Database Entities
USERS
ROLES
USER_ROLES

PROBLEMS
PROBLEM_MEDIA
LOCATIONS
CATEGORIES

AI_ANALYSES
AI_CLASSIFICATIONS
ASR_RESULTS
NLP_RESULTS

ORGANIZATIONS
ORGANIZATION_EXPERTISE
PROBLEM_EXPERTISE
PROBLEM_MATCHES

COLLABORATIONS
COLLABORATION_MEMBERS

SOLUTIONS
SOLUTION_UPDATES

COMMENTS
NOTIFICATIONS

AUDIT_LOGS
4. Central Data Relationship

The PROBLEM is the central entity of the entire system.

USER
 |
 | submits
 v
PROBLEM
 |
 +----> MEDIA
 |        |
 |        +----> IMAGE
 |        |
 |        +----> AUDIO
 |
 +----> LOCATION
 |
 +----> CATEGORY
 |
 +----> AI_ANALYSIS
 |
 +----> NLP_RESULT
 |
 +----> EXPERTISE
 |
 +----> MATCHING
 |
 +----> COLLABORATION
 |
 +----> SOLUTION
5. Users Table
Table: users

Stores information about people using the platform.

Fields
id
name
email
phone
password_hash
preferred_language
status
created_at
updated_at
last_login_at
Example
{
  "id": "USR-001",
  "name": "Rahul",
  "email": "rahul@example.com",
  "phone": "XXXXXXXXXX",
  "preferred_language": "khortha",
  "status": "active"
}
6. Roles Table
Table: roles

Stores available system roles.

Fields
id
name
description
Roles
CITIZEN
UNIVERSITY
INDUSTRY
ADMIN
7. User Roles Table
Table: user_roles

Connects users with their roles.

Fields
user_id
role_id
created_at
Relationship
USERS
  |
  | 1
  |
  | many
  v
USER_ROLES
  |
  | many
  |
  | 1
  v
ROLES

This allows one user to have one or multiple roles if required.

8. Organizations Table
Table: organizations

Stores university and industry information.

Fields
id
name
type
description
website
email
phone
location
verification_status
created_at
updated_at
Organization Types
UNIVERSITY
INDUSTRY
NGO
GOVERNMENT

For the MVP, the main types can be:

UNIVERSITY
INDUSTRY
9. User and Organization Relationship

A user can belong to an organization.

ORGANIZATION
      |
      | 1
      |
      | many
      v
    USERS

Example:

University A
 |
 +-- Professor A
 +-- Researcher B
 +-- Student C
10. Problems Table
Table: problems

This is the most important table.

Every societal problem submitted by a user is stored here.

Fields
id
reporter_id
title
description
language
category_id
status
priority
ai_status
verification_status
created_at
updated_at
Example
{
  "id": "PRB-001",
  "reporter_id": "USR-001",
  "title": "Road damaged near school",
  "description": "There are several large potholes near the school.",
  "language": "khortha",
  "category_id": "CAT-001",
  "status": "SUBMITTED",
  "priority": "HIGH",
  "ai_status": "PROCESSING"
}
11. User to Problem Relationship

One user can submit many problems.

USERS
  |
  | 1
  |
  | many
  v
PROBLEMS

Example:

Sagar
 |
 +-- PRB-001
 +-- PRB-002
 +-- PRB-003

Relationship:

users.id
     |
     +---- problems.reporter_id
12. Problem Status

The problem lifecycle can be:

DRAFT
SUBMITTED
AI_PROCESSING
UNDER_REVIEW
APPROVED
MATCHED
COLLABORATION
IN_PROGRESS
RESOLVED
REJECTED
ARCHIVED
Main Flow
SUBMITTED
    |
    v
AI_PROCESSING
    |
    v
UNDER_REVIEW
    |
    v
APPROVED
    |
    v
MATCHED
    |
    v
COLLABORATION
    |
    v
IN_PROGRESS
    |
    v
RESOLVED
13. Categories Table
Table: categories

Stores problem categories.

Fields
id
name
description
parent_id
is_active
created_at
updated_at
Example Categories
Infrastructure
 |
 +-- Roads
 +-- Bridges
 +-- Drainage

Healthcare
 |
 +-- Hospitals
 +-- Medical Access

Environment
 |
 +-- Waste
 +-- Pollution

Education
 |
 +-- Schools
 +-- Digital Education
14. Category Relationship

One category can contain many problems.

CATEGORY
   |
   | 1
   |
   | many
   v
PROBLEMS

Example:

Road Damage
 |
 +-- PRB-001
 +-- PRB-014
 +-- PRB-023
15. Problem Media Table
Table: problem_media

Stores information about images and audio associated with a problem.

Fields
id
problem_id
media_type
storage_key
mime_type
file_size
duration
created_at
Media Types
IMAGE
AUDIO
16. Image Storage

Images should normally NOT be stored directly inside PostgreSQL.

Instead:

USER
 |
 | uploads
 v
BACKEND
 |
 +----> PostgreSQL
 |        |
 |        +-- media metadata
 |
 +----> OBJECT STORAGE
          |
          +-- actual image

Example object storage path:

/problems/PRB-001/image-001.webp

PostgreSQL stores:

problem_id:
PRB-001

storage_key:
problems/PRB-001/image-001.webp

media_type:
IMAGE

mime_type:
image/webp
17. Image Requirement

The application requirement is:

IMAGE = REQUIRED
VOICE = OPTIONAL
TEXT = OPTIONAL

Therefore:

Valid
IMAGE
IMAGE + TEXT
IMAGE + VOICE
IMAGE + TEXT + VOICE
Invalid
TEXT only
VOICE only
TEXT + VOICE

The backend must reject submissions without an image.

18. Media Relationship

One problem can have multiple media records.

PROBLEM
   |
   | 1
   |
   | many
   v
PROBLEM_MEDIA

Example:

PRB-001
 |
 +-- image-001
 +-- image-002
 +-- audio-001
19. Locations Table
Table: locations

Stores geographical information about the problem.

Fields
id
problem_id
latitude
longitude
location_name
district
state
created_at
updated_at
Example
{
  "problem_id": "PRB-001",
  "latitude": 23.3441,
  "longitude": 85.3096,
  "location_name": "Ranchi",
  "district": "Ranchi",
  "state": "Jharkhand"
}
20. Problem and Location Relationship

One problem has one primary location.

PROBLEM
   |
   | 1
   |
   | 1
   v
LOCATION

This allows:

Find problems in a district
Find problems near a location
Find problems within a radius
Display problems on a map

For advanced geographic queries, PostgreSQL can use PostGIS.

21. AI Analysis Table
Table: ai_analyses

Stores AI processing results.

Fields
id
problem_id
model_name
model_version
status
summary
confidence
processed_at
processing_time_ms
error_code
created_at
22. Why AI Data Is Separate

Do not overwrite the original user submission.

Instead:

PROBLEM
 |
 +-- ORIGINAL USER INPUT
 |
 +-- AI ANALYSIS

AI processing can happen multiple times.

Example:

PRB-001
 |
 +-- AI Analysis V1
 +-- AI Analysis V2
 +-- AI Analysis V3

This allows model improvement and reprocessing.

23. AI Classification Table
Table: ai_classifications

Stores detailed AI predictions.

Fields
id
ai_analysis_id
category_id
confidence
is_selected
created_at
Example
AI ANALYSIS
 |
 +-- Road Damage       0.91
 +-- Infrastructure    0.74
 +-- Construction      0.21

The system can select the most appropriate classification after validation.

24. ASR Table
Table: asr_results

ASR means:

Automatic Speech Recognition

It converts voice into text.

Fields
id
media_id
language
transcript
confidence
model_name
created_at
Flow
VOICE
  |
  v
ASR
  |
  v
TRANSCRIPT
  |
  v
NLP
25. NLP Table
Table: nlp_results

Stores NLP processing results.

Fields
id
problem_id
source
language
normalized_text
summary
keywords
entities
confidence
created_at
Source
TEXT
ASR
26. Multilingual Processing

The user may provide information in:

Khortha
Hindi
English

and potentially other supported languages.

The system stores the original language:

problems.language

Example:

language = "khortha"

The system should preserve the original input rather than replacing it with a translation.

27. Multimodal AI Pipeline

Your system combines three possible inputs:

IMAGE
   |
   v
VISION AI
   |
   +----------------+
                    |
TEXT -------------->|
                    |
VOICE
   |
   v
ASR
   |
   v
TEXT
   |
   v
NLP ----------------+
                    |
                    v
             MULTIMODAL AI
                    |
                    v
          STRUCTURED ANALYSIS

The image is mandatory.

Text and voice are optional.

28. Problem Expertise Table
Table: problem_expertise

Stores expertise required to solve a problem.

Fields
id
problem_id
expertise_name
importance
source
created_at
Example
PRB-001
 |
 +-- Civil Engineering
 +-- Road Infrastructure
 +-- Transportation
Source
AI
ADMIN
USER
29. Organization Expertise Table
Table: organization_expertise

Stores expertise available within an organization.

Fields
id
organization_id
expertise_name
expertise_category
description
created_at
Example
University A
 |
 +-- Civil Engineering
 +-- Transportation
 +-- Computer Vision
30. Matching System

The matching engine compares:

PROBLEM REQUIREMENTS
        |
        v
REQUIRED EXPERTISE
        |
        v
ORGANIZATION EXPERTISE
        |
        v
MATCH SCORE

Example:

Problem:
Road Damage

Required:
Civil Engineering
Transportation

        |

University A:
Civil Engineering
Transportation
Road Research

        |

Match Score:
92%
31. Problem Matches Table
Table: problem_matches

Stores recommended organizations.

Fields
id
problem_id
organization_id
match_score
match_reason
match_status
created_at
updated_at
Match Status
RECOMMENDED
VIEWED
INTERESTED
ACCEPTED
REJECTED
EXPIRED
32. Problem to Organization Relationship

A problem can be matched with many organizations.

An organization can be matched with many problems.

Therefore this is a:

MANY-TO-MANY

relationship.

PROBLEMS
   |
   | many
   v
PROBLEM_MATCHES
   ^
   |
   | many
   |
ORGANIZATIONS
33. Problem Clusters
Table: problem_clusters

Groups similar problems together.

Fields
id
name
description
category_id
status
created_at
updated_at

Example:

Road Problems in Ranchi
34. Problem Cluster Members
Table: problem_cluster_members

Connects problems to clusters.

Fields
id
cluster_id
problem_id
similarity_score
created_at

Relationship:

CLUSTER
 |
 +-- PRB-001
 +-- PRB-014
 +-- PRB-021
 +-- PRB-034
35. Duplicate Detection

The system can calculate similarity between two problems.

Table: problem_similarity
id
problem_id_1
problem_id_2
similarity_score
reason
status
created_at

Example:

PRB-001
   |
   | 91% similarity
   |
PRB-102

Reasons can include:

Similar image
Similar description
Same location
Same category
Similar AI embedding

The system should flag possible duplicates instead of automatically deleting reports.

36. Collaborations Table
Table: collaborations

Created when organizations agree to work on a problem.

Fields
id
problem_id
created_by
status
start_date
target_date
created_at
updated_at
Status
PROPOSED
ACTIVE
ON_HOLD
COMPLETED
CANCELLED
37. Collaboration Relationship
PROBLEM
   |
   | 1
   |
   | many
   v
COLLABORATIONS

Normally, the application may have one active collaboration per problem, while historical collaborations can be retained if required.

38. Collaboration Members
Table: collaboration_members

Stores users and organizations participating in a collaboration.

Fields
id
collaboration_id
user_id
organization_id
role
status
joined_at

Example:

COLLABORATION
 |
 +-- University A
 |      |
 |      +-- Professor A
 |
 +-- Industry B
        |
        +-- Engineer B
39. Solutions Table
Table: solutions

Stores proposed or implemented solutions.

Fields
id
problem_id
collaboration_id
title
description
solution_type
status
created_at
updated_at
Solution Status
PROPOSED
DESIGN
PROTOTYPE
TESTING
IMPLEMENTATION
COMPLETED
REJECTED
40. Solution Updates
Table: solution_updates

Tracks progress of a solution.

Fields
id
solution_id
updated_by
title
description
progress_percentage
created_at

Example:

Solution
 |
 +-- 20% → Initial Design
 +-- 50% → Prototype
 +-- 80% → Field Testing
 +-- 100% → Completed
41. Comments Table
Table: comments

Allows communication between users.

Fields
id
problem_id
user_id
parent_comment_id
content
created_at
updated_at

The parent_comment_id allows replies.

Example:

User:
Can this problem be solved using low-cost materials?

University:
Yes, we can test an alternative material.
42. Notifications Table
Table: notifications

Stores user notifications.

Fields
id
user_id
type
title
message
reference_type
reference_id
is_read
created_at

Example:

Your problem PRB-001 has been matched with University A.
43. Audit Logs
Table: audit_logs

Stores important security and administrative actions.

Fields
id
user_id
action
entity_type
entity_id
ip_address
user_agent
metadata
created_at

Example:

user_id:
ADMIN-001

action:
APPROVED

entity_type:
PROBLEM

entity_id:
PRB-001
44. Complete Entity Relationship
                         +-------------+
                         |    USERS    |
                         +------+------+
                                |
                     +----------+----------+
                     |                     |
                     v                     v
                USER_ROLES            PROBLEMS
                     |                     |
                     v                     |
                   ROLES                   |
                                           |
                +--------------------------+--------------------------+
                |              |             |           |           |
                v              v             v           v           v
            LOCATIONS       MEDIA        CATEGORY    AI_ANALYSIS  EXPERTISE
                              |                         |
                        +-----+-----+                   v
                        |           |             AI_CLASSIFICATIONS
                        v           v
                      IMAGE      AUDIO
                                    |
                                    v
                                   ASR
                                    |
                                    v
                                   NLP
                                    |
                                    +-------------+
                                                  |
                                                  v
                                           MATCHING ENGINE
                                                  |
                                           +------+------+
                                           |             |
                                           v             v
                                    ORGANIZATIONS    MATCHES
                                           |
                                           v
                                      EXPERTISE
                                           |
                                           v
                                    COLLABORATIONS
                                           |
                                 +---------+---------+
                                 |                   |
                                 v                   v
                         COLLAB_MEMBERS          SOLUTIONS
                                                     |
                                                     v
                                             SOLUTION_UPDATES
45. Complete Problem Data Journey
USER
 |
 | Submit
 v
PROBLEM
 |
 +---------------- IMAGE
 |                    |
 |                    v
 |                VISION AI
 |
 +---------------- TEXT
 |                    |
 |                    v
 |                   NLP
 |
 +---------------- VOICE
                      |
                      v
                     ASR
                      |
                      v
                     NLP
 |
 +---------------- LOCATION
                      |
                      v
                  GEO DATA

              ALL RESULTS
                  |
                  v
           MULTIMODAL AI
                  |
        +---------+---------+
        |         |         |
        v         v         v
    CATEGORY   PRIORITY   SUMMARY
        |
        v
 REQUIRED EXPERTISE
        |
        v
 MATCHING ENGINE
        |
     +--+--+
     |     |
     v     v
 UNIVERSITY INDUSTRY
     |     |
     +--+--+
        |
        v
 COLLABORATION
        |
        v
 SOLUTION
        |
        v
    RESOLVED
46. Where Each Data Type Is Stored
Data	Storage
User account	PostgreSQL
Password hash	PostgreSQL
Roles	PostgreSQL
Problem information	PostgreSQL
Problem description	PostgreSQL
Language	PostgreSQL
Categories	PostgreSQL
Location metadata	PostgreSQL
Image file	Object Storage
Audio file	Object Storage
Image metadata	PostgreSQL
Audio metadata	PostgreSQL
ASR transcript	PostgreSQL
NLP results	PostgreSQL
AI classification	PostgreSQL
AI processing history	PostgreSQL
Organization	PostgreSQL
Organization expertise	PostgreSQL
Problem expertise	PostgreSQL
Match results	PostgreSQL
Collaboration	PostgreSQL
Solutions	PostgreSQL
Comments	PostgreSQL
Notifications	PostgreSQL
Audit logs	PostgreSQL
Cache	Redis
Background jobs	Redis/Queue
47. Data Storage Rule

Use this simple rule:

STRUCTURED DATA
       |
       v
POSTGRESQL

LARGE FILES
       |
       v
OBJECT STORAGE

TEMPORARY/CACHED DATA
       |
       v
REDIS

Do not store everything in one place.

48. Foreign Key Relationships

Important foreign keys:

problems.reporter_id
        |
        v
users.id
problems.category_id
        |
        v
categories.id
problem_media.problem_id
        |
        v
problems.id
locations.problem_id
        |
        v
problems.id
ai_analyses.problem_id
        |
        v
problems.id
ai_classifications.ai_analysis_id
        |
        v
ai_analyses.id
asr_results.media_id
        |
        v
problem_media.id
nlp_results.problem_id
        |
        v
problems.id
organization_expertise.organization_id
        |
        v
organizations.id
problem_matches.problem_id
        |
        v
problems.id
problem_matches.organization_id
        |
        v
organizations.id
collaborations.problem_id
        |
        v
problems.id
solutions.problem_id
        |
        v
problems.id
solutions.collaboration_id
        |
        v
collaborations.id
49. Relationship Types
One-to-One
PROBLEM
   |
   | 1:1
   v
LOCATION

A problem has one primary location.

One-to-Many
USER
 |
 | 1:N
 v
PROBLEMS

One user can submit many problems.

Another example:

PROBLEM
 |
 | 1:N
 v
PROBLEM_MEDIA

One problem can have multiple media files.

Many-to-Many

Problems and organizations have a many-to-many relationship.

PROBLEMS
   |
   v
PROBLEM_MATCHES
   ^
   |
ORGANIZATIONS

One problem can be matched with many organizations.

One organization can work on many problems.

50. Data Integrity Rules

The database should enforce:

Every problem must have a valid user.

Every media record must belong to a valid problem.

Every AI analysis must belong to a valid problem.

Every match must reference an existing problem.

Every match must reference an existing organization.

Every collaboration must reference an existing problem.

Every solution must reference an existing problem.

This prevents orphan records.

51. ID Strategy

Use UUIDs internally.

Example:

550e8400-e29b-41d4-a716-446655440000

For user-friendly IDs, generate display IDs.

Example:

USR-000001
PRB-000001
ORG-000001
SOL-000001

Therefore:

Internal ID:
UUID

Public Display ID:
PRB-000001
52. Database Indexes

Create indexes for frequently searched fields.

users.email

problems.reporter_id
problems.category_id
problems.status
problems.created_at

problem_media.problem_id

ai_analyses.problem_id

problem_matches.problem_id
problem_matches.organization_id

collaborations.problem_id

notifications.user_id
notifications.is_read

audit_logs.user_id
audit_logs.created_at

For geographic search, use PostGIS indexes if PostGIS is enabled.

53. Data Security Rules

Never store:

Plain text passwords
API keys
Database passwords
Private keys

Passwords must be hashed.

Secrets must be stored in environment variables or a secret-management system.

54. Original Data vs AI Data

This is a critical architecture rule.

Original User Data
Original image
Original voice
Original text
Original location
Original language

must remain unchanged.

AI Data
Classification
Summary
Keywords
Priority
Confidence
Detected objects
Required expertise

should be stored separately.

Architecture:

             USER DATA
                 |
       +---------+---------+
       |         |         |
     IMAGE      TEXT      VOICE
                           |
                           v
                          ASR

             AI PROCESSING
                   |
        +----------+----------+
        |          |          |
       VISION      NLP       ASR
        |          |          |
        +----------+----------+
                   |
                   v
              AI RESULTS
55. AI Failure Handling

If AI fails:

PROBLEM
   |
   v
AI PROCESSING
   |
   X
AI FAILURE
   |
   v
AI_STATUS = FAILED
   |
   v
RETRY / MANUAL REVIEW

The original problem must remain stored.

The user should not lose their submission.

56. AI Confidence

AI results should contain confidence.

Example:

Road Damage
Confidence = 0.91

For low confidence:

Confidence = 0.31

the system should flag the result for review instead of presenting it as certain.

57. Data Lifecycle
1. USER SUBMITS PROBLEM
             |
             v
2. PROBLEM STORED
             |
             v
3. IMAGE STORED
             |
             v
4. OPTIONAL AUDIO STORED
             |
             v
5. ASR PROCESSING
             |
             v
6. NLP PROCESSING
             |
             v
7. IMAGE CLASSIFICATION
             |
             v
8. MULTIMODAL ANALYSIS
             |
             v
9. CATEGORY + PRIORITY
             |
             v
10. EXPERTISE IDENTIFICATION
             |
             v
11. ORGANIZATION MATCHING
             |
             v
12. COLLABORATION
             |
             v
13. SOLUTION
             |
             v
14. RESOLUTION
58. Recommended MVP Database

Because this is an SIH project, do not implement every advanced table on day one.

Start with:

users
roles
user_roles

problems
problem_media
locations
categories

ai_analyses
ai_classifications
asr_results
nlp_results

organizations
organization_expertise
problem_expertise
problem_matches

collaborations
collaboration_members
solutions

notifications
audit_logs

After the core system works, add:

problem_clusters
problem_cluster_members
problem_similarity
comments
solution_updates
59. Recommended Technology Stack
Frontend:
React / Next.js

Backend:
Node.js + Express
OR
Node.js + NestJS

Database:
PostgreSQL

ORM:
Prisma

Object Storage:
S3-compatible storage

Cache/Queue:
Redis

Authentication:
JWT or secure server-managed sessions

AI:
Computer Vision
ASR
NLP
Multimodal AI

Maps:
Map service + PostGIS

Deployment:
Cloud/VPS/container platform
60. Final Architecture
                         SAHYOG
                            |
                    +-------+-------+
                    |               |
                FRONTEND          BACKEND
                    |               |
                    |         +-----+------+
                    |         |            |
                    |         v            v
                    |     PostgreSQL    Object Storage
                    |         |            |
                    |         |        Images/Audio
                    |         |
                    |         v
                    |      AI PIPELINE
                    |         |
                    |    +----+----+----+
                    |    |         |    |
                    |    v         v    v
                    |  Vision     ASR  NLP
                    |    |         |    |
                    |    +---------+----+
                    |              |
                    |              v
                    |       AI ANALYSIS
                    |              |
                    |              v
                    |       MATCHING ENGINE
                    |              |
                    |       +------+------+
                    |       |             |
                    |       v             v
                    |   UNIVERSITY      INDUSTRY
                    |       |             |
                    |       +------+------+
                    |              |
                    |              v
                    |        COLLABORATION
                    |              |
                    |              v
                    |           SOLUTION
                    |              |
                    +--------------+
                                   |
                                   v
                              RESOLVED
61. Most Important Design Decision

The entire database should revolve around the following entity:

                    PROBLEM
                       |
       +---------------+---------------+
       |       |       |       |       |
       v       v       v       v       v
     MEDIA  LOCATION  AI    EXPERTISE MATCHES
                       |
                       v
                 COLLABORATION
                       |
                       v
                    SOLUTION