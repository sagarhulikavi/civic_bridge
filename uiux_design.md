A citizen should be able to report a real-world problem in less than 2 minutes, even if they are not comfortable with English, typing, or technology.

Below is the complete UI/UX specification you can give directly to your frontend team or AI coding agent.

Sahyog — Complete UI/UX Design Specification
1. Design Identity
Product name

Sahyog

Tagline

“Report. Connect. Solve.”

Alternative supporting line:

“Your problem. Our collective solution.”

Primary purpose

Sahyog is a multilingual societal problem reporting and collaborative problem-solving platform connecting:

Citizens
Universities
Industry
Organizations
Administrators

The interface must feel:

Simple
Trustworthy
Modern
Community-oriented
Accessible
Indian/local-context friendly
AI-powered without feeling complicated
2. Design Philosophy

Follow these five principles.

1. Simple

A first-time user should immediately understand:

What is Sahyog?
        ↓
What can I do?
        ↓
How do I report a problem?
2. Image-first

Because:

IMAGE = REQUIRED
TEXT = OPTIONAL
VOICE = OPTIONAL

The main reporting interface should therefore prioritize camera/image upload rather than a large text box.

3. Multilingual

The user should be able to select:

English
हिन्दी
खोरठा

from the interface.

4. AI should remain in the background

Don't overwhelm citizens with:

NLP
Computer Vision
ASR
Multimodal AI

Instead show:

“Analyzing your report…”

The technical AI pipeline should be visible mainly in the admin/technical dashboard.

5. Accessibility

Design for:

Low digital literacy
Mobile users
Older users
Users with limited typing ability
Users using local languages
3. Font System

I recommend using Noto Sans as the main font family.

Why?

It provides broad language support and works well for English and Indian-language UI.

Primary font
Noto Sans
Hindi/Khortha-compatible font
Noto Sans Devanagari

Use it automatically when the interface/content is Devanagari.

Font hierarchy
H1
32–40px
Weight: 700

H2
24–28px
Weight: 700

H3
20–22px
Weight: 600

Body
16px
Weight: 400

Small text
14px
Weight: 400

Button
15–16px
Weight: 600

Navigation
15–16px
Weight: 500/600
Avoid

Don't use:

Times New Roman
Comic Sans
Decorative fonts
Too many different fonts

Use one primary font family throughout the application.

4. Color System

Use a clean civic-tech visual identity.

Primary
Deep Blue
#2563EB

Used for:

Primary buttons
Links
Active navigation
Important actions
Dark
#0F172A

Used for:

Main headings
Important text
Background
#F8FAFC
White
#FFFFFF

Used for:

Cards
Modals
Forms
Navigation areas
Success
#16A34A

Used for:

Resolved
Approved
Successful actions
Warning
#F59E0B

Used for:

Pending
Processing
Warnings
Error
#DC2626

Used for:

Errors
Rejected
Failed uploads
Text

Primary:

#0F172A

Secondary:

#64748B
5. Border & Radius System

Use modern rounded cards.

Small radius:
6px

Medium:
10px

Large:
14px

Buttons:
8–10px

Cards:
12–16px

Avoid extremely rounded "bubble" interfaces.

The platform should look professional rather than like a social-media app.

6. Spacing System

Use multiples of 4.

4px
8px
12px
16px
24px
32px
40px
48px
64px

Main page horizontal padding:

Desktop:
48–64px

Tablet:
32px

Mobile:
16px
7. Global Navigation
Desktop

Header:

------------------------------------------------------
SAHYOG     Home   Problems   How it Works   About
                                      [Language] [Login]
------------------------------------------------------

Logo:

SAHYOG

Under logo optionally:

Report. Connect. Solve.

Navigation
Home
Explore Problems
How It Works
About

Right side:

Language selector
Login

For logged-in users:

Dashboard
Notifications
Profile
8. Mobile Navigation

Mobile header:

┌──────────────────────────┐
│ ☰   SAHYOG        🔔     │
└──────────────────────────┘

Bottom navigation:

Home
Explore
Report
Activity
Profile

The Report button should be visually prominent.

9. Home Page
Hero section

Large heading:

See a problem? Help solve it.

Supporting text:

Report local challenges with a photo, voice, or text. Sahyog connects communities with universities and industry to turn problems into solutions.

Primary CTA:

Report a Problem

Secondary CTA:

Explore Problems

10. Hero Visual

Show a simple illustration:

Citizen
   ↓
Problem
   ↓
AI
   ↓
University + Industry
   ↓
Solution

Do not put a complicated AI diagram on the home page.

Keep it understandable.

11. Language Selector

Top-right:

🌐 English ▼

Dropdown:

English
हिन्दी
खोरठा

When selected:

Language changed to Hindi

The entire UI should update.

12. Home Page Sections

After hero:

Section 1

How Sahyog Works

Three/four steps:

01
Report

Share a problem using a photo.

↓

02
Understand

AI analyzes the image and optional voice/text.

↓

03
Connect

Find relevant universities and industries.

↓

04
Solve

Collaborate and track the solution.
13. Feature Section

Heading:

One platform. From problem to solution.

Cards:

Report

Share real-world problems with an image, voice, or text.

Understand

AI helps classify and understand the reported problem.

Connect

Connect challenges with relevant universities and industries.

Collaborate

Work together to develop practical solutions.

14. Trust Section

Heading:

Built for communities

Text:

Every report helps create a structured picture of the challenges faced by communities.

Stats can show:

1,250+
Problems Reported

320+
Problems Solved

75+
Organizations

18
Districts

Only show real numbers in the actual application. During development use placeholders.

15. Report Problem Page

This is the most important page in the entire application.

Title:

Report a Problem

Subtitle:

Help us understand the problem. A photo is required. You can also add your voice or describe it with text.

16. Step 1 — Image Upload

Large card:

┌─────────────────────────────────────┐
│                                     │
│             📷                      │
│                                     │
│       Add a photo of the problem    │
│                                     │
│       Photo is required             │
│                                     │
│     [ Take Photo ] [ Upload ]       │
│                                     │
└─────────────────────────────────────┘

Text:

Photo is required

Below:

JPG, PNG or WebP • Maximum 10 MB

After upload:

┌─────────────────────────────┐
│                             │
│       IMAGE PREVIEW         │
│                             │
│                  ✕ Remove   │
└─────────────────────────────┘

Button:

Change Photo

17. Step 2 — Optional Text

Heading:

Describe the problem

Badge:

Optional

Placeholder:

What is happening here?

Example:

“The road near the school has large potholes and becomes difficult to use during rain.”

Below:

0 / 500 characters
18. Step 3 — Optional Voice

Heading:

Describe it with your voice

Badge:

Optional

Button:

🎙 Start Recording

After recording:

▶  00:18

Buttons:

Delete
Record Again

Text:

You can speak in your preferred language.

19. Step 4 — Location

Heading:

Where is the problem?

Buttons:

📍 Use My Location

or:

Select Location

Display:

Ranchi, Jharkhand

Map:

[ MAP ]
      📍

Don't expose latitude/longitude to normal users.

20. Step 5 — Language

Heading:

What language are you using?

Options:

English
हिन्दी
खोरठा

Can also automatically detect the language.

Show:

Detected language: खोरठा

Then:

✓ Correct
Change
21. Submit Button

Large primary button:

Submit Problem

Before submission:

✓ Photo added
✓ Location added
✓ Language selected

Optional:

○ Text
○ Voice
22. Submission Processing Screen

After clicking submit:

Analyzing your report...

Show:

✓ Uploading image

✓ Reading your description

● Understanding the problem

○ Finding relevant organizations

Don't show technical terms like:

NLP inference
Vision transformer
ASR pipeline
Embedding generation

to citizens.

23. Submission Success Screen

Heading:

Problem reported successfully

Text:

Thank you for helping your community. Your report has been received and is being analyzed.

Show:

Problem ID

PRB-000123

Buttons:

View Problem
Explore Other Problems
Back to Home
24. AI Analysis Result

After processing:

AI Analysis

Display:

Category
Road Infrastructure

Problem Type
Road Damage

Priority
High

Confidence
91%

Don't claim that AI is always correct.

Add:

AI-generated analysis. Results may be reviewed or corrected.

25. Problem Details Page

Layout:

------------------------------------------------
Problem #PRB-000123

[ IMAGE ]

Road Damage Near School

📍 Ranchi, Jharkhand

Status: Under Review
------------------------------------------------

Then:

Description

The road near the school has large potholes...

AI Analysis
Category:
Infrastructure

Type:
Road Damage

Priority:
High
Report Information
Reported:
31 Aug 2026

Language:
Khortha

Location:
Ranchi, Jharkhand
26. Problem Status Timeline

Use a horizontal/vertical timeline:

✓ Reported
   |
✓ AI Analysis
   |
✓ Verified
   |
● Organization Matching
   |
○ Collaboration
   |
○ Solution
   |
○ Resolved

This is much better than simply showing:

Status: Processing

27. Explore Problems Page

Heading:

Explore Community Problems

Search:

🔍 Search problems...

Filters:

Category
Location
Status
Priority
Date

Cards:

┌───────────────────────────┐
│       PROBLEM IMAGE       │
│                           │
├───────────────────────────┤
│ Road Damage               │
│ 📍 Ranchi                 │
│                           │
│ Infrastructure            │
│ High Priority             │
│                           │
│ Under Review              │
└───────────────────────────┘
28. Citizen Dashboard

Heading:

Welcome back, [Name]

Cards:

My Reports
12

Under Review
3

In Progress
4

Resolved
5

Then:

My Recent Reports

Display report cards.

29. University Dashboard

University users should see:

Problems matched to your expertise

Example:

Road Damage
Match: 94%

Required expertise:
Civil Engineering
Transportation

Button:

View Problem

Then:

Interested in solving this?

Buttons:

Express Interest
Not Relevant
30. Industry Dashboard

Similar layout:

Challenges relevant to your organization

Show:

Problem
Required Expertise
Match Score
Location
Priority
31. Matching Page

Heading:

Potential Solution Partners

Example:

Road Damage

AI identified:
Civil Engineering
Transportation
Infrastructure

Then:

University A

94% Match

Strong expertise in:
✓ Civil Engineering
✓ Transportation
✓ Infrastructure

[View Organization]
[Connect]
32. Don't Make Match Score the Only Factor

Instead of:

94% Match

also explain:

Why this organization was recommended

Example:

✓ Relevant expertise
✓ Similar projects
✓ Located in Jharkhand
✓ Experience with road infrastructure

This makes the AI more trustworthy.

33. Collaboration Page

Heading:

Collaboration Workspace

Top:

Problem:
Road Damage Near School

Status:
In Progress

Members:

Citizen
University
Industry

Tabs:

Overview
Discussion
Solution
Progress
Files
34. Discussion Tab

Simple chat-like interface:

Professor A
We recommend inspecting the drainage system first.

Engineer B
We can arrange a site inspection.

Input:

Write a message...

Button:

Send

35. Solution Tab

Heading:

Proposed Solution

Example:

Low-cost road drainage improvement and resurfacing.

Progress:

████████░░ 80%

Stages:

✓ Problem Identified
✓ Initial Design
✓ Prototype
● Field Testing
○ Implementation
36. Admin Dashboard

Admin UI can be more technical.

Sidebar:

Dashboard
Problems
Users
Organizations
AI Review
Categories
Collaborations
Reports
Audit Logs
Settings

Dashboard cards:

Total Problems
Pending Review
AI Failures
Active Collaborations
Resolved Problems
37. Admin AI Review

Table:

Problem ID
Image
AI Category
Confidence
Status
Action

Example:

PRB-001
Road Damage
91%
Approved

PRB-002
Waste
42%
Needs Review

Buttons:

Approve
Correct
Reject
38. Error Messages

Never display technical errors to normal users.

Bad

500 Internal Server Error: PrismaClientKnownRequestError

Good

Something went wrong while submitting your report. Please try again.

39. Image Upload Errors

If no image:

Please add a photo before submitting your report.

If too large:

This image is too large. Please upload an image smaller than 10 MB.

Wrong format:

This file type isn't supported. Please upload JPG, PNG, or WebP.

Upload failure:

We couldn't upload your photo. Please check your connection and try again.

40. Voice Errors

Microphone permission denied:

Microphone access is required to record your voice.

Recording failure:

We couldn't record your voice. Please try again.

ASR failure:

We couldn't understand the recording. You can try again or describe the problem using text.

Remember:

Voice is optional.

Therefore ASR failure should never prevent image + text submission.

41. AI Failure

If vision AI fails:

Don't block the report.

Show:

Your report was received, but automatic analysis is temporarily unavailable. It will be reviewed manually.

This is extremely important.

42. Empty States

Don't leave blank pages.

No reports

You haven't reported any problems yet.

Button:

Report a Problem

No matches

No matching organizations have been found yet.

No notifications

You're all caught up.

43. Loading States

Use skeleton loaders instead of blank screens.

Example:

████████████
██████
████████████████

For AI:

Analyzing image...

For matching:

Finding relevant organizations...
44. Accessibility

Minimum:

WCAG-inspired design

Use:

High text contrast
Large clickable areas
Keyboard navigation
Screen-reader labels
Alt text for images
Visible focus states
Don't rely only on color
Clear error messages

Buttons should generally have at least:

44 × 44 px

touch area.

45. Responsive Design
Mobile

Most citizen users should be assumed to use mobile.

Prioritize:

Image
Voice
Location
Submit
Tablet

Two-column layouts can be used.

Desktop

Use:

Sidebar + content

for dashboards.

46. Mobile Report Page

Recommended:

┌─────────────────────────┐
│ ← Report a Problem      │
│                         │
│ Add a Photo             │
│ ┌─────────────────────┐ │
│ │                     │ │
│ │       📷            │ │
│ │                     │ │
│ └─────────────────────┘ │
│                         │
│ [Take Photo] [Upload]   │
│                         │
│ Describe the problem    │
│ ┌─────────────────────┐ │
│ │ Optional...         │ │
│ └─────────────────────┘ │
│                         │
│ 🎙 Describe with voice  │
│                         │
│ 📍 Add Location          │
│                         │
│ Language: खोरठा         │
│                         │
│ [   Submit Problem   ]  │
└─────────────────────────┘
47. Button System
Primary
Report a Problem
Submit Problem
Connect
Accept
Save
Secondary
Explore Problems
View Details
Cancel
Back
Destructive
Delete
Reject
Remove

Use red only for destructive actions.

48. Icon System

Use one icon library consistently.

Recommended:

Lucide Icons

Use icons such as:

Camera
Mic
MapPin
Globe
Search
Bell
User
Upload
Check
X
AlertCircle
Building
GraduationCap
Factory
MessageCircle

Don't mix five different icon styles.

49. Cards

Cards should follow:

White background
12–16px radius
Subtle border
16–24px padding

Don't use excessive shadows.

50. Language UX

The language selector should be available globally.

Example:

🌐 English

Click:

Select Language

○ English

○ हिन्दी

○ खोरठा

After selection, preserve the choice.

Example:

preferred_language = "khortha"
51. Important Multilingual Rule

Separate:

UI translation

from:

AI language understanding

They are different systems.

For example:

UI
English → Hindi → Khortha

while:

User Problem
Khortha
   ↓
Language Processing
   ↓
NLP
   ↓
Structured Problem

Do not mix these two systems.

52. UI Translation Structure

Don't hardcode:

<button>Report a Problem</button>

Instead use translation keys:

<button>
  {t("report_problem")}
</button>

Translation files:

locales/
│
├── en.json
├── hi.json
└── kh.json

Example:

{
  "report_problem": "Report a Problem",
  "submit_problem": "Submit Problem",
  "explore": "Explore Problems"
}

Hindi:

{
  "report_problem": "समस्या की रिपोर्ट करें",
  "submit_problem": "समस्या सबमिट करें",
  "explore": "समस्याएँ देखें"
}

For Khortha, use translations that have been reviewed by native/local speakers rather than inventing translations through the UI code.

53. UX for AI Transparency

When AI is used, show a small label:

AI-assisted analysis

Then:

Category
Road Damage

Confidence
91%

Why?
Image shows visible road surface damage.

Don't tell users:

"AI knows this is definitely road damage."

Use:

AI suggests: Road Damage

54. AI Review UX

For low confidence:

AI confidence: 38%

⚠️ Needs review

Instead of:

Road Damage

display:

Possible Road Damage

This makes the system safer and more credible.

55. Overall UX Journey

Your complete citizen journey should be:

HOME
  ↓
Report a Problem
  ↓
Upload Image
  ↓
Optional Text
  ↓
Optional Voice
  ↓
Location
  ↓
Language
  ↓
Submit
  ↓
AI Processing
  ↓
Problem Created
  ↓
AI Classification
  ↓
Organization Matching
  ↓
University / Industry
  ↓
Collaboration
  ↓
Solution
  ↓
Progress
  ↓
Resolved
56. Visual Hierarchy

Every screen should answer:

First

What is this page?

Second

What should I do?

Third

What happened?

Fourth

What can I do next?

For example:

REPORT A PROBLEM        ← What is this?

Add a photo             ← What do I do?

Photo uploaded ✓        ← What happened?

[Submit Problem]        ← What's next?
57. Homepage Final Structure
HEADER
  ↓
HERO
  ↓
REPORT PROBLEM CTA
  ↓
HOW IT WORKS
  ↓
FEATURES
  ↓
COMMUNITY IMPACT
  ↓
UNIVERSITY + INDUSTRY
  ↓
CALL TO ACTION
  ↓
FOOTER
58. Footer
SAHYOG

Report. Connect. Solve.

Platform
Home
Explore Problems
How It Works

For Organizations
Universities
Industry

Support
Help
Contact

Languages
English | हिन्दी | खोरठा

© 2026 Sahyog
59. Recommended Frontend Folder Structure
frontend/
│
├── src/
│   ├── components/
│   │   ├── Navbar/
│   │   ├── Footer/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Modal/
│   │   ├── LanguageSelector/
│   │   ├── ImageUploader/
│   │   ├── VoiceRecorder/
│   │   ├── LocationPicker/
│   │   ├── ProblemCard/
│   │   ├── StatusTimeline/
│   │   └── AIAnalysis/
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── Register/
│   │   ├── Dashboard/
│   │   ├── ReportProblem/
│   │   ├── ExploreProblems/
│   │   ├── ProblemDetails/
│   │   ├── Matches/
│   │   ├── Collaboration/
│   │   ├── Solutions/
│   │   └── Admin/
│   │
│   ├── services/
│   │   ├── authApi.js
│   │   ├── problemApi.js
│   │   ├── aiApi.js
│   │   ├── matchApi.js
│   │   └── collaborationApi.js
│   │
│   ├── locales/
│   │   ├── en.json
│   │   ├── hi.json
│   │   └── kh.json
│   │
│   ├── hooks/
│   ├── context/
│   ├── utils/
│   ├── assets/
│   └── styles/
│
└── package.json
60. Final UI Design Rules

Give these rules to your frontend developer/AI agent.

1. Use Noto Sans as the primary font.

2. Support Noto Sans Devanagari for Hindi/Khortha UI.

3. Use a clean civic-tech visual style.

4. Keep the interface mobile-first.

5. Image upload must be mandatory.

6. Voice must be optional.

7. Text must be optional.

8. Never prevent submission because optional voice processing failed.

9. Keep original user language unchanged.

10. Don't expose technical AI terminology to normal citizens.

11. Show AI as "AI-assisted", not as infallible.

12. Show confidence when appropriate.

13. Low-confidence AI results should be reviewable.

14. Use clear status timelines.

15. Every important action must have a visible result.

16. Never show raw backend/database errors to users.

17. Use consistent buttons and icons.

18. Use accessible contrast and touch targets.

19. Avoid unnecessary animations.

20. Keep the reporting process extremely simple.

21. Don't make users fill long forms.

22. Ask only for information necessary for solving the problem.

23. Preserve original image, voice, text and language.

24. Keep UI translation separate from NLP processing.

25. Don't hardcode multilingual UI text.

26. Use translation keys.

27. Use real data for statistics in production.

28. Don't display fake AI accuracy.

29. Don't claim AI can understand every language perfectly.

30. Every page must have a clear next action.
The most important screen

If your team has limited time, perfect these five screens first:

1. Home
       ↓
2. Report Problem
       ↓
3. AI Analysis / Processing
       ↓
4. Problem Details + Status
       ↓
5. University/Industry Matching