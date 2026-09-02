# User Journey / App Flow

## Project

**Sahyog — AI-Powered Multilingual Societal Problem Crowdsourcing and Collaborative Problem-Solving Platform**

---

# 1. Main User Journey

```text
Citizen identifies a problem
        ↓
Opens Sahyog
        ↓
Selects language
        ↓
Uploads Image (MANDATORY)
        ↓
Adds Text (OPTIONAL)
        ↓
Adds Voice (OPTIONAL)
        ↓
Adds Location
        ↓
Submits Problem
        ↓
AI Understands Problem
        ↓
Problem Classified
        ↓
Priority Calculated
        ↓
Similar/Duplicate Problems Checked
        ↓
Required Expertise Identified
        ↓
Universities + Industries Matched
        ↓
Admin Reviews
        ↓
Collaboration Begins
        ↓
Solution Developed
        ↓
Problem Resolved
```

---

# 2. Citizen User Journey

## Step 1 — Open Application

The citizen opens the Sahyog web application.

```text
┌─────────────────────────────┐
│          SAHYOG             │
│                             │
│  Connect Problems           │
│  With Solutions             │
│                             │
│       [Get Started]         │
│                             │
│ Language: English ▼         │
└─────────────────────────────┘
```

---

# 3. Select Language

The user chooses:

```text
English
Hindi
Khortha
```

Example:

```text
User selects → Khortha
```

The interface changes to the selected language where translations are available.

> **Important:** UI language and the language of the problem description are separate concepts.

---

# 4. Login / Continue

The user can:

```text
Login
   OR
Register
```

After authentication:

```text
Citizen Dashboard
```

---

# 5. Citizen Dashboard

```text
┌─────────────────────────────────┐
│ Welcome                         │
│                                 │
│ [ + Report a Problem ]          │
│                                 │
│ My Problems                     │
│                                 │
│ PRB-001   Road Damage           │
│ Status: Under Review            │
│                                 │
│ PRB-002   Water Problem         │
│ Status: Matched                 │
└─────────────────────────────────┘
```

Main action:

**Report a Problem**

---

# 6. Report Problem

This is the most important screen.

```text
Report a Societal Problem

1. Upload Image *
2. Describe Problem
3. Voice Description
4. Location
5. Submit
```

---

# 7. Upload Image — Mandatory

The user **must upload an image**.

```text
┌─────────────────────────────┐
│ Upload Problem Image *      │
│                             │
│      [ 📷 Upload Image ]    │
│                             │
│ JPG / PNG / WEBP            │
└─────────────────────────────┘
```

If the user does not upload an image:

```text
⚠ Image is required to submit a problem.
```

The submission cannot continue.

---

# 8. Optional Text

The user can describe the problem using text.

Example:

> "There are large potholes on the road near the school."

The text field is optional.

```text
Problem Description (Optional)

[___________________________]
[___________________________]
```

---

# 9. Optional Voice

The user can record their problem.

```text
🎤 Record Voice

[ Start Recording ]
```

A Khortha-speaking citizen can describe the problem using their voice.

Flow:

```text
Khortha Voice
      ↓
Speech Recognition / ASR
      ↓
Transcript
      ↓
NLP
```

Voice remains optional because the mandatory evidence is the image.

---

# 10. Location

The user provides the location.

Options:

```text
📍 Use Current Location

OR

🗺 Select on Map

OR

Enter Location Manually
```

The system can store:

```text
Latitude
Longitude
Location name
```

---

# 11. Submit Problem

The user presses:

```text
[ SUBMIT PROBLEM ]
```

Frontend validates:

```text
Image?
 ├── NO → Stop submission
 └── YES
       ↓
Text?
 ├── Yes → Include
 └── No → Continue

Voice?
 ├── Yes → Include
 └── No → Continue

Location?
 ├── Yes → Include
 └── No → Continue/handle according to policy
```

---

# 12. Problem Created

Backend creates a problem.

```text
Problem ID: PRB-001
Status: AI PROCESSING
```

User sees:

```text
✓ Problem submitted successfully.

Problem ID:
PRB-001

AI is analyzing your problem...
```

---

# 13. AI Processing

The system processes the available inputs.

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
             Language Detection
                    │
                    │
TEXT ───────────────┘
                    ↓
            Multimodal Analysis
                    ↓
            Structured Problem
```

The system should handle:

```text
Image only
Image + Text
Image + Voice
Image + Text + Voice
```

---

# 14. AI Understanding

Example input:

```text
Image:
Damaged road

Voice:
Khortha description

Location:
Jharkhand
```

AI output:

```text
Category:
Infrastructure

Subcategory:
Road Damage

Summary:
Damaged road with multiple potholes.

Required Expertise:
Civil Engineering
Road Infrastructure
Transportation Engineering
```

---

# 15. Priority Assessment

The intelligence engine evaluates the problem.

Example:

```text
Priority: HIGH

Reasons:
• Public road affected
• Near important public location
• Multiple similar reports
```

This is an **AI-assisted assessment** and can be reviewed by an administrator.

---

# 16. Duplicate Detection

The system searches existing problems.

```text
New Problem
     ↓
Image Similarity
     +
Text Similarity
     +
Location
     +
Category
     ↓
Potential Duplicate
```

Example:

```text
Potential similar problem found:

PRB-102
Similarity: 91%
Distance: 300 m
```

Potential duplicates should be sent for review rather than automatically deleting or merging a report.

---

# 17. Problem Clustering

If many citizens report the same type of problem:

```text
PRB-001 ─┐
PRB-014 ─┤
PRB-021 ─┼──→ Road Damage Cluster
PRB-034 ─┤
PRB-041 ─┘
```

This helps organizations identify widespread problems.

---

# 18. Expertise Identification

The system determines the expertise required.

```text
Problem:
Road Damage

Required Expertise:

✓ Civil Engineering
✓ Transportation Engineering
✓ Road Infrastructure
```

---

# 19. University Matching

The intelligence engine searches university profiles.

Example:

```text
Recommended Universities

1. University A
   Match: High
   Reason:
   ✓ Civil Engineering
   ✓ Road Infrastructure Research

2. University B
   Match: Medium
   Reason:
   ✓ Transportation Engineering
```

The system should explain **why** each university was recommended.

---

# 20. Industry Matching

The system searches industry capabilities.

Example:

```text
Recommended Industry

Industry X
Match: High

Capabilities:
✓ Infrastructure Technology
✓ Road Monitoring
✓ IoT
✓ Deployment
```

---

# 21. Admin Review

The admin receives:

```text
New Problem

PRB-001

Category:
Infrastructure

Priority:
HIGH

Potential Duplicate:
PRB-102

University Matches:
3

Industry Matches:
4

[Approve]
[Edit]
[Reject]
```

The admin can correct AI mistakes.

---

# 22. Collaboration

After approval:

```text
Problem
   ↓
University / Industry
   ↓
Accept Collaboration
   ↓
Project Created
```

Example:

```text
Problem PRB-001

University A → Accepted
Industry X   → Accepted

Collaboration Started
```

---

# 23. Solution Development

The problem moves through:

```text
COLLABORATION
      ↓
SOLUTION DESIGN
      ↓
PROTOTYPE
      ↓
TESTING
      ↓
IMPLEMENTATION
```

The exact stages can be configurable.

---

# 24. Problem Resolution

Example lifecycle:

```text
SUBMITTED
     ↓
AI ANALYZED
     ↓
UNDER REVIEW
     ↓
MATCHED
     ↓
COLLABORATION
     ↓
IN PROGRESS
     ↓
RESOLVED
```

The citizen receives:

```text
✓ Your reported problem has been resolved.

Problem ID: PRB-001
```

---

# 25. Citizen Complete Journey

```text
             CITIZEN
                │
                ▼
         Open Sahyog
                │
                ▼
        Select Language
                │
                ▼
             Login
                │
                ▼
       Report a Problem
                │
                ▼
       Upload Image ★
          MANDATORY
                │
        ┌───────┴────────┐
        ▼                ▼
   Add Text          Add Voice
   OPTIONAL          OPTIONAL
        │                │
        └───────┬────────┘
                ▼
             Location
                │
                ▼
             Submit
                │
                ▼
         Problem Created
                │
                ▼
          AI Processing
                │
                ▼
      Problem Classification
                │
                ▼
       Priority Assessment
                │
                ▼
      Duplicate Detection
                │
                ▼
       Problem Clustering
                │
                ▼
      Expertise Detection
                │
        ┌───────┴─────────┐
        ▼                 ▼
   University          Industry
    Matching           Matching
        │                 │
        └────────┬────────┘
                 ▼
            Admin Review
                 │
                 ▼
           Collaboration
                 │
                 ▼
          Solution Design
                 │
                 ▼
           Implementation
                 │
                 ▼
             RESOLVED
```

---

# 26. University User Journey

```text
University
    ↓
Login
    ↓
University Dashboard
    ↓
View Recommended Problems
    ↓
Filter by Expertise
    ↓
Open Problem
    ↓
Review Problem Details
    ↓
View AI Analysis
    ↓
View Why It Was Matched
    ↓
Express Interest
    ↓
Admin/Problem Owner Review
    ↓
Collaboration
    ↓
Develop Solution
    ↓
Update Progress
    ↓
Resolution
```

---

# 27. Industry User Journey

```text
Industry
   ↓
Login
   ↓
Industry Dashboard
   ↓
View Relevant Problems
   ↓
Filter by Capability
   ↓
Open Problem
   ↓
Review Requirements
   ↓
View Match Reason
   ↓
Express Interest
   ↓
Collaboration
   ↓
Provide Technology / Funding /
Implementation / Expertise
   ↓
Track Progress
   ↓
Solution
```

---

# 28. Admin Journey

```text
Admin Login
    ↓
Admin Dashboard
    ↓
View Incoming Problems
    ↓
Review AI Analysis
    ↓
Check Priority
    ↓
Check Potential Duplicates
    ↓
Verify Category
    ↓
Verify Routing
    ↓
Review University Matches
    ↓
Review Industry Matches
    ↓
Approve / Edit / Reject
    ↓
Monitor Collaboration
    ↓
Track Resolution
```

---

# 29. Recommended SIH Demo Flow

For the SIH presentation, demonstrate one complete problem from beginning to end.

```text
Khortha-speaking Citizen
          ↓
Selects Khortha
          ↓
Uploads Road Problem Image
          ↓
Records Optional Khortha Voice
          ↓
Adds Location
          ↓
Submit
          ↓
AI
 ├── Image Classification
 ├── ASR
 ├── NLP
 └── Multimodal Understanding
          ↓
"Road Damage"
          ↓
HIGH Priority
          ↓
Potential Duplicate Found
          ↓
Civil Engineering Required
          ↓
University A Recommended
          ↓
Industry X Recommended
          ↓
Admin Verifies
          ↓
Collaboration
          ↓
Solution
          ↓
RESOLVED
```

---

# 30. Core Product Story

> **A citizen does not need to know whom to contact or how to technically describe the problem. They simply show the problem through an image and optionally explain it through their own language or voice. The platform converts that raw community input into structured information and connects it with organizations capable of solving it.**

The platform should therefore be presented as more than an AI image-classification website. Its complete value chain is:

```text
COMMUNITY PROBLEM
       ↓
MULTILINGUAL INPUT
       ↓
AI UNDERSTANDING
       ↓
STRUCTURED PROBLEM
       ↓
PRIORITIZATION
       ↓
SIMILARITY / CLUSTERING
       ↓
EXPERTISE IDENTIFICATION
       ↓
UNIVERSITY + INDUSTRY MATCHING
       ↓
COLLABORATION
       ↓
SOLUTION
       ↓
REAL-WORLD IMPACT
```
