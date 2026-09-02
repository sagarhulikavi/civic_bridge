# Product Requirements Document (PRD)

## Project Name

**Sahyog — AI-Powered Multilingual Societal Problem Crowdsourcing and Collaborative Problem-Solving Platform**

> Working name. The final product name can be changed by the team.

---

# 1. Problem Statement

## 1.1 Background

Local communities frequently face societal challenges such as:

- Damaged roads
- Water and sanitation problems
- Waste management
- Electricity-related issues
- Agriculture problems
- Environmental issues
- Healthcare-related challenges
- Education-related problems
- Public infrastructure problems
- Other locally relevant challenges

However, many of these problems are not effectively connected with the people and organizations capable of solving them.

Citizens may know about a problem but may not know:

- Where to report it
- How to describe it technically
- Which department should handle it
- Which university has relevant expertise
- Which industry can provide technology or implementation support
- Whether someone has already reported the same problem

Language can create another barrier, especially for communities where people communicate primarily in local languages such as **Khortha**.

The proposed platform aims to create a bridge between:

**Citizens → Problems → AI Understanding → Universities → Industries → Collaborative Solutions**

---

# 2. Product Vision

Build a multilingual digital platform where citizens can easily submit real-world societal problems using an image and optionally provide text or voice.

The platform uses AI to understand the submitted problem and intelligently connect it with relevant universities, industries, departments, and potential solution providers.

The platform should make problem reporting:

- Simple
- Accessible
- Multilingual
- Visual
- AI-assisted
- Explainable
- Collaborative
- Scalable

---

# 3. Target Users

## 3.1 Primary Users — Citizens / Community Members

People who experience or observe societal problems.

Examples:

- Villagers
- Students
- Farmers
- Workers
- Local residents
- Community organizations
- Volunteers

They should be able to report a problem without requiring technical knowledge.

---

## 3.2 University Users

Universities, colleges, faculty members, researchers and students who can contribute expertise and develop solutions.

Examples:

- Engineering departments
- Computer Science departments
- Civil Engineering departments
- Environmental departments
- Agricultural departments
- Medical/health-related institutions
- Research laboratories

---

## 3.3 Industry Users

Companies and organizations capable of providing:

- Technology
- Equipment
- Mentorship
- Funding
- Manufacturing
- Testing
- Deployment
- Technical expertise

---

## 3.4 Government / Department / Administrative Users

Officials or administrators who can:

- Review submitted problems
- Validate AI results
- Prioritize problems
- Route problems
- Monitor progress
- Connect problems with relevant organizations

---

## 3.5 Platform Administrators

Administrators responsible for:

- User management
- Category management
- University data
- Industry data
- Moderation
- System monitoring
- AI feedback
- Platform configuration

---

# 4. Product Scope

The platform consists of four major technical divisions:

1. **Division 1 — Frontend**
2. **Division 2 — Backend + Database**
3. **Division 3 — AI Service**
4. **Division 4 — Intelligence, Matching & Decision Engine**

Architecture:

```text
DIVISION 1
Frontend
     ↓
DIVISION 2
Backend + Database
     ↓
DIVISION 3
AI Service
     ↓
DIVISION 4
Intelligence & Matching
```

---

# 5. Core User Flow

```text
Citizen
   ↓
Open Platform
   ↓
Select Language
   ↓
Upload Image
   ↓
Optional Text
   ↓
Optional Voice
   ↓
Provide Location
   ↓
Submit Problem
   ↓
AI Analysis
   ↓
Problem Classification
   ↓
Priority Assessment
   ↓
Duplicate Detection
   ↓
Expertise / Department Identification
   ↓
University Matching
   ↓
Industry Matching
   ↓
Recommendations
   ↓
Human/Admin Review
   ↓
Collaborative Problem Solving
```

---

# 6. Core Features

## 6.1 Multilingual User Interface

The platform should support multiple languages.

Initial focus:

- English
- Hindi
- Khortha

The architecture should allow additional Indian languages to be added later.

### Requirements

- Language selector
- Translated interface text
- Language preference storage
- Local-language problem submission
- Preservation of original user input

---

# 7. Image-Based Problem Submission

## Requirement

**Image upload is mandatory.**

Every problem submission must contain at least one image.

The image acts as the primary visual evidence of the problem.

### Supported Formats

- JPG
- JPEG
- PNG
- WEBP

### Validation

The system should validate:

- File type
- File size
- Image readability
- Corrupted files

The original image should be preserved as evidence.

---

# 8. Optional Text Input

Users may describe their problem using text.

Example:

> "There are large potholes near the village school."

Text may be written in:

- English
- Hindi
- Khortha
- Other supported languages

Text is optional because the image is mandatory.

---

# 9. Optional Voice Input

Users can optionally describe the problem using voice.

Example:

A citizen speaks in Khortha describing a damaged road.

The system performs:

```text
Voice
 ↓
Speech-to-Text
 ↓
Language Detection
 ↓
NLP
 ↓
Problem Understanding
```

Voice is optional.

If speech processing fails, the image should still be processed.

---

# 10. Location Capture

The user should be able to provide the problem location.

Possible methods:

- GPS
- Map selection
- Manual location
- Latitude/longitude

Location is important for:

- Duplicate detection
- Problem clustering
- Geographic analysis
- Priority calculation
- Institutional relevance

---

# 11. AI Image Classification

The platform should analyze the mandatory image.

Example:

```text
Image
 ↓
Computer Vision
 ↓
Detected visual information
 ↓
Category
 ↓
Subcategory
 ↓
Confidence
```

Potential categories include:

- Infrastructure
- Roads
- Water
- Waste
- Agriculture
- Environment
- Education
- Healthcare
- Electricity
- Public Safety
- Other

The final category taxonomy should remain configurable.

---

# 12. NLP Problem Understanding

If text or voice-derived text is available, NLP should analyze it.

The system should identify:

- Language
- Keywords
- Problem summary
- Category
- Subcategory
- Relevant expertise
- Semantic representation

Example:

```text
Input:

"Village road has large potholes."

Output:

Category:
Infrastructure

Subcategory:
Road

Keywords:
road, potholes

Expertise:
Civil Engineering
Road Infrastructure
```

---

# 13. Khortha Language Support

Khortha should be treated as an important language in the platform.

The system should support:

```text
Khortha Text
     ↓
Language Processing
     ↓
Problem Understanding
```

For voice:

```text
Khortha Voice
     ↓
ASR
     ↓
Khortha Transcription
     ↓
NLP
```

The platform must preserve the original Khortha input.

If translation is used, both should be maintained:

```text
Original Khortha
        +
Processed / Translated Representation
```

The system must not falsely claim perfect Khortha understanding if model performance is limited.

---

# 14. Multimodal AI

The platform should combine information from:

- Image
- Text
- Voice-derived transcription

Example:

```text
IMAGE
  ↓
Computer Vision
  ↓
Visual Evidence

TEXT
  ↓
NLP
  ↓
Text Evidence

VOICE
  ↓
ASR
  ↓
NLP
  ↓
Voice Evidence

       ↓
Multimodal Analysis
       ↓
Final Problem Understanding
```

The system should handle four cases:

### Case 1
Image only

### Case 2
Image + text

### Case 3
Image + voice

### Case 4
Image + text + voice

---

# 15. Problem Summary Generation

AI should generate a concise structured summary.

Example:

> "Large potholes have been reported on a village road near a school."

The summary should be based on available evidence.

---

# 16. Problem Categorization

Each problem should receive:

- Category
- Subcategory
- Confidence

Example:

```text
Category:
Infrastructure

Subcategory:
Road Damage

Confidence:
Model-derived confidence
```

Low-confidence predictions should be flagged for human review.

---

# 17. Required Expertise Identification

The system should determine what expertise may be required.

Example:

```text
Problem:
Road damage

Required expertise:

- Civil Engineering
- Road Infrastructure
- Transportation Engineering
```

This information becomes an input to the matching engine.

---

# 18. Priority Assessment

Division 4 should determine the priority of a problem.

Priority levels:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

Priority may consider:

- Severity
- Number of people affected
- Safety implications
- Location
- Critical infrastructure
- Recurrence
- Number of similar reports

The system should provide reasons for the priority.

Example:

```text
Priority: HIGH

Reasons:
- Public road affected
- Multiple nearby reports
- Located near a school
```

Priority should be treated as an assistive decision, not an unquestionable truth.

---

# 19. Duplicate Detection

The platform should identify potentially duplicate reports.

The system can compare:

- Image similarity
- Text similarity
- Location
- Category
- Time

Example:

```text
New Report
    ↓
Candidate Reports
    ↓
Image Similarity
Text Similarity
Location Similarity
Category Similarity
Time Similarity
    ↓
Duplicate Score
```

The system must NOT automatically delete or merge reports.

Instead:

```text
Potential Duplicate
        ↓
Admin Review
        ↓
Merge / Keep Separate
```

---

# 20. Problem Clustering

Similar problems should be grouped into clusters.

Example:

```text
50 citizen reports

       ↓

Cluster:

"Road Infrastructure Problems
in Area X"
```

Clustering can consider:

- Geographic proximity
- Category
- Text similarity
- Image similarity
- Time

This helps administrators identify large-scale problems rather than handling every report independently.

---

# 21. Department / Expertise Routing

The platform should recommend the relevant department or expertise.

Example:

```text
Water contamination
        ↓
Water Quality
        ↓
Environmental Engineering
        ↓
Relevant authority
```

Department mappings should be configurable because organizational structures can differ by location.

---

# 22. University Matching

The system should recommend universities capable of contributing to a problem.

University profiles may include:

- Departments
- Research areas
- Faculty expertise
- Laboratories
- Technologies
- Facilities
- Previous projects
- Geographic location

Matching should consider:

- Expertise similarity
- Research similarity
- Technology capability
- Previous project relevance
- Geographic relevance

---

# 23. Explainable University Recommendations

Instead of simply showing:

```text
University A — 92
```

show:

```text
University A — Match Score: 92

Why?

✓ Civil Engineering expertise
✓ Road infrastructure research
✓ Relevant previous project
✓ Suitable laboratory capability
```

The user/admin should understand why a recommendation was made.

---

# 24. Industry Matching

The system should identify industries that can contribute to solving a problem.

Industry capabilities may include:

- Technology
- Manufacturing
- Funding
- Mentorship
- Testing
- Deployment
- Infrastructure
- Technical expertise

Example:

```text
Smart Water Monitoring Project

Required:
IoT
Sensors
Cloud

Industry A:
IoT ✓
Sensors ✓
Cloud ✓

→ High match
```

---

# 25. Recommendation Engine

The system should combine available intelligence into ranked recommendations.

Possible recommendation types:

- Relevant department
- University
- Industry
- Similar problem
- Expertise
- Potential collaborator

Every recommendation should include:

- Name
- Score
- Reasons
- Relevant evidence

---

# 26. Admin / Human Review

AI recommendations should be assistive.

Administrators should be able to:

- Review AI classification
- Correct category
- Change priority
- Approve recommendation
- Reject recommendation
- Merge duplicate reports
- Keep reports separate
- Modify routing
- Review low-confidence results

Workflow:

```text
AI
 ↓
Human Review
 ↓
Final Decision
```

---

# 27. Problem Status Tracking

Every problem should have a status.

Possible statuses:

```text
SUBMITTED
UNDER_REVIEW
AI_ANALYZED
ROUTED
MATCHED
COLLABORATION_STARTED
SOLUTION_IN_PROGRESS
RESOLVED
REJECTED
DUPLICATE
```

The final status list can be adjusted during implementation.

---

# 28. Collaboration Workflow

Once a suitable university or industry is identified:

```text
Problem
 ↓
University / Industry Match
 ↓
Interest / Acceptance
 ↓
Collaboration
 ↓
Solution Development
 ↓
Implementation
 ↓
Problem Resolution
```

The platform should allow progress to be tracked.

---

# 29. Notifications

Users should receive notifications when appropriate.

Examples:

- Problem submitted
- AI analysis completed
- Problem reviewed
- Duplicate detected
- University matched
- Industry matched
- Collaboration started
- Problem resolved

---

# 30. Dashboard

## Citizen Dashboard

Display:

- Submitted problems
- Status
- Priority
- AI-generated category
- Updates
- Resolution progress

## Admin Dashboard

Display:

- Total problems
- Pending problems
- High-priority problems
- Critical problems
- Potential duplicates
- Problem clusters
- University matches
- Industry matches
- Resolution statistics

## University Dashboard

Display:

- Recommended problems
- Relevant expertise matches
- Collaboration opportunities
- Accepted projects
- Active projects

## Industry Dashboard

Display:

- Relevant projects
- Technology matches
- Collaboration opportunities
- Active collaborations

---

# 31. Search and Filtering

Users/admins should be able to search/filter problems using:

- Category
- Subcategory
- Location
- Priority
- Status
- Language
- Date
- University
- Industry
- Expertise
- Cluster

---

# 32. Data Requirements

A problem record should conceptually contain:

```json
{
  "problem_id": "PRB-001",
  "image": "...",
  "text": "...",
  "voice": "...",
  "language": "khortha",
  "location": {
    "latitude": 0,
    "longitude": 0
  },
  "category": "...",
  "subcategory": "...",
  "summary": "...",
  "priority": "...",
  "status": "...",
  "ai_confidence": 0
}
```

The exact database schema will be defined by Division 2.

---

# 33. Non-Functional Requirements

## Performance

The platform should provide reasonable response times for:

- Problem submission
- Image processing
- Text processing
- Voice transcription
- AI analysis
- Matching

AI-heavy operations may be asynchronous if required.

## Scalability

The architecture should allow:

- More users
- More problems
- More universities
- More industries
- More languages
- More AI models

without requiring complete redevelopment.

## Reliability

If an optional component fails, the system should degrade gracefully.

Example:

```text
ASR fails
 ↓
Image processing continues
```

---

# 34. Security Requirements

The system must:

- Secure user accounts
- Protect uploaded files
- Validate file types
- Protect API keys
- Validate API requests
- Prevent unauthorized access
- Avoid exposing private information
- Use secure communication between services

---

# 35. Privacy Requirements

The system should minimize unnecessary collection of personal information.

AI services should not unnecessarily store:

- Raw audio
- Raw images
- Sensitive personal information

Original evidence should be stored only where required by the application.

---

# 36. AI Transparency

The platform should clearly indicate when information comes from AI.

Example:

```text
AI Suggested Category:
Infrastructure

Confidence:
High

Human Review:
Pending
```

AI output should not be presented as guaranteed truth.

---

# 37. Core APIs

### Backend

```text
POST /problems
GET /problems
GET /problems/{id}
PUT /problems/{id}
```

### AI

```text
POST /ai/image/analyze
POST /ai/text/analyze
POST /ai/audio/transcribe
POST /ai/multimodal/analyze
```

### Intelligence

```text
POST /intelligence/priority
POST /intelligence/duplicates
POST /intelligence/cluster
POST /intelligence/routing
POST /intelligence/university-matches
POST /intelligence/industry-matches
POST /intelligence/recommendations
```

Exact API contracts will be finalized during integration.

---

# 38. Success Criteria

The project will be considered successful when the following core workflow works:

```text
Citizen
   ↓
Uploads mandatory image
   ↓
Optionally enters text
   ↓
Optionally records voice
   ↓
Selects/provides language
   ↓
Provides location
   ↓
Submits problem
   ↓
AI analyzes available information
   ↓
Problem is categorized
   ↓
Priority is generated
   ↓
Potential duplicates are detected
   ↓
Relevant expertise is identified
   ↓
Relevant universities are recommended
   ↓
Relevant industries are recommended
   ↓
Admin reviews recommendations
   ↓
Problem enters collaborative workflow
```

---

# 39. Measurable Success Criteria

## Citizen Submission

- 100% of valid problem submissions require an image.
- Users can submit a problem with image only.
- Users can optionally add text.
- Users can optionally add voice.

## Multilingual Support

- English interface works.
- Hindi interface works.
- Khortha input can be accepted.
- Original Khortha input is preserved.
- Voice/text processing failures do not prevent image-based submission.

## AI

The system successfully produces structured output for valid test cases:

- Category
- Subcategory
- Summary
- Keywords
- Required expertise
- AI confidence where meaningful

Actual model performance must be measured using a test dataset rather than assumed.

## Duplicate Detection

The system can identify potential duplicates using multiple signals:

- Image
- Text
- Location
- Category
- Time

Potential duplicates are sent for human review rather than automatically deleted.

## Matching

For test datasets containing suitable institutional information:

- Relevant universities can be ranked.
- Relevant industries can be ranked.
- Each recommendation provides an explanation.

## Explainability

For every major AI/algorithmic decision, the system should be able to answer:

> "Why did the system make this recommendation?"

## Integration

All four divisions should communicate successfully:

```text
Frontend
   ↕
Backend
   ↕
AI Service
   ↕
Intelligence Service
```

The complete end-to-end demo should work using real APIs.

---

# 40. SIH Demonstration Success Scenario

A successful demonstration should show a realistic citizen problem.

### Step 1

Citizen opens the platform.

### Step 2

Citizen selects:

```text
Khortha
```

### Step 3

Citizen uploads:

```text
Image of damaged road
```

### Step 4

Citizen optionally records a Khortha voice description.

### Step 5

System processes:

```text
Image
 ↓
Computer Vision

Voice
 ↓
ASR
 ↓
Khortha NLP
```

### Step 6

AI generates:

```text
Category:
Infrastructure

Subcategory:
Road

Summary:
Road damage near a village/school

Required expertise:
Civil Engineering
Road Infrastructure
```

### Step 7

Division 4 analyzes:

```text
Priority:
HIGH

Potential Duplicate:
PRB-102

Relevant Department:
Road/Public Works

University Match:
University A — High

Industry Match:
Industry X — High
```

### Step 8

Admin reviews the recommendations.

### Step 9

University/industry collaboration begins.

### Step 10

Problem status changes:

```text
SUBMITTED
     ↓
ANALYZED
     ↓
MATCHED
     ↓
COLLABORATION
     ↓
IN PROGRESS
     ↓
RESOLVED
```

---

# 41. MVP Scope

## Must Have

- User interface
- Image upload
- Optional text
- Optional voice
- Location
- Basic multilingual UI
- AI image classification
- Basic NLP
- Basic ASR
- Khortha processing pipeline
- Problem categorization
- Priority
- Duplicate detection
- University matching
- Industry matching
- Admin review
- Problem status

## Should Have

- Problem clustering
- Explainable recommendations
- Notifications
- Analytics
- Advanced multilingual support

## Future

- More Indian languages
- Advanced multimodal models
- Improved Khortha ASR/NLP
- Automated feedback-based model improvement
- Large-scale deployment
- Advanced geographic analytics
- Advanced collaboration tools

---

# 42. Final Product Definition

The final product is an:

**AI-powered, multilingual societal problem crowdsourcing and collaborative problem-solving platform.**

Its key differentiator is the complete pipeline:

```text
LOCAL PROBLEM
     ↓
IMAGE + OPTIONAL TEXT/VOICE
     ↓
MULTILINGUAL AI
     ↓
PROBLEM UNDERSTANDING
     ↓
INTELLIGENT PRIORITIZATION
     ↓
DUPLICATE DETECTION
     ↓
EXPERTISE / DEPARTMENT ROUTING
     ↓
UNIVERSITY MATCHING
     ↓
INDUSTRY MATCHING
     ↓
COLLABORATION
     ↓
SOLUTION
```

The platform should not merely be a **problem-reporting website**.

Its main purpose is to transform:

> **"A citizen reported a problem."**

into:

> **"The system understood the problem, identified its importance, found similar reports, identified the expertise required, and connected the problem with organizations capable of helping solve it."**
