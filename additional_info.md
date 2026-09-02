Important: The Privacy Policy, Terms, Refund/Cancellation Policy, and payment-related legal wording below is a product/engineering specification, not legal advice. Before a real public launch, have the final legal documents reviewed for your actual business model and applicable Indian laws.

SAHYOG — PRODUCTION-READY WEB REQUIREMENTS
# SAHYOG Production-Ready Web Requirements

## Project Context

Sahyog is a multilingual platform for crowdsourcing societal/community problems and connecting those problems with universities, industries, and other organizations for collaborative problem solving.

The platform supports:
- Citizens/community users
- Universities
- Industry
- Administrators

Problem submission:
- IMAGE = REQUIRED
- TEXT = OPTIONAL
- VOICE = OPTIONAL

The platform may use:
- Computer Vision
- ASR / Speech Recognition
- NLP
- Multilingual processing
- AI classification
- Organization matching

The application must be production-ready.

Do not implement only visual pages.
Every feature must include:
1. UI
2. Frontend validation
3. Backend validation
4. API handling
5. Database/state handling where necessary
6. Loading states
7. Success states
8. Error states
9. Security considerations
10. Responsive design
11. Accessibility
1. 404 — PAGE NOT FOUND
Route
/404

Also configure the application/router so that any unknown URL automatically displays the 404 page.

UI
404

Page not found

The page you're looking for doesn't exist
or may have been moved.

[ Go to Home ]

[ Explore Problems ]

Optional illustration:

🔍
Behavior

If the user visits:

/random-page
/abc
/xyz

show the 404 page.

Do not expose:

stack traces
database errors
server paths
API errors
framework errors
Buttons
Go to Home

Navigate to:

/
Explore Problems

Navigate to:

/problems
Browser behavior

Set:

HTTP status = 404

when handled by the server.

2. PRIVACY POLICY
Route
/privacy-policy

Footer must contain:

Privacy Policy
Purpose

Explain clearly how Sahyog collects, uses, stores, processes, and protects user information.

Sections

Create the following sections.

1. Introduction
2. Information We Collect
3. How We Use Information
4. Images and Uploaded Media
5. Voice and Speech Data
6. Location Data
7. AI Processing
8. Multilingual Processing
9. How We Share Information
10. Data Storage
11. Data Retention
12. Account and Data Deletion
13. Cookies
14. Security
15. Third-Party Services
16. Children's Privacy
17. User Rights
18. Changes to This Policy
19. Contact Information
Important data categories

Clearly identify:

Account information
Name
Email
Authentication information
Profile information

Problem information
Images
Text descriptions
Voice recordings
Location
Problem category
AI-generated analysis

Technical information
IP address where legitimately collected
Browser/device information
Application logs
Security logs

Only collect information that is actually needed.

Do not claim that Sahyog collects information that the implementation does not collect.

AI section

Include an explanation that:

Sahyog may use automated systems and AI-assisted processing
to analyze submitted images, text, voice transcripts, and
other problem information.

AI-generated classifications and recommendations may not
always be accurate and may be reviewed or corrected.

Do not claim:

AI is always accurate
AI makes final decisions
AI understands every language perfectly
User content

Explain:

How submitted images are used
How submitted descriptions are used
How voice recordings are processed
How content is shared with relevant organizations
Data deletion

Provide a mechanism for authenticated users to request account/data deletion.

Example UI:

Settings
    ↓
Privacy & Data
    ↓
Delete Account
3. TERMS AND CONDITIONS
Route
/terms

Footer:

Terms & Conditions
Sections
1. Acceptance of Terms
2. Eligibility
3. User Accounts
4. User Responsibilities
5. Problem Reports
6. User-Generated Content
7. Images and Media
8. Prohibited Activities
9. AI-Assisted Features
10. University and Industry Participation
11. Collaboration
12. Intellectual Property
13. Platform Availability
14. Third-Party Services
15. Suspension and Termination
16. Limitation of Liability
17. Changes to Terms
18. Governing Law
19. Contact
False/misleading reports

Users must not intentionally submit:

fake problems
fraudulent information
malicious content
spam
misleading reports

Provide reporting/moderation functionality.

AI disclaimer

Display:

AI-generated results are provided as assistance and may require human verification.

Organization disclaimer

Make it clear that:

Sahyog facilitates connections and collaboration.
It does not automatically guarantee that an organization
will accept, fund, implement, or resolve a reported problem.

This is particularly important for your platform.

4. COOKIE PREFERENCES
Routes
/cookies
/cookie-preferences
First visit

Display a cookie consent banner.

Example:

We use cookies

Sahyog uses essential cookies to keep the platform secure
and functional. With your permission, we may also use
optional cookies to understand how the platform is used.

[ Accept All ]

[ Reject Optional ]

[ Manage Preferences ]
Cookie categories
Essential
Always active

Used for:

Authentication
Security
Session management
Cookie preference storage
Core application functionality

User cannot disable these through the preference UI if they are genuinely necessary.

Analytics

Optional.

Used for:

Understanding usage
Improving performance
Understanding feature usage
Preferences

Optional.

Used for:

Language preference
UI preferences
Other non-essential personalization
Marketing

Only include this category if the actual product uses marketing/advertising cookies.

Do not create a fake marketing-cookie system.

Cookie preference UI
Cookie Preferences

Essential Cookies
Always Active

Analytics Cookies
[ ON / OFF ]

Preference Cookies
[ ON / OFF ]

Marketing Cookies
[ ON / OFF ]

[ Save Preferences ]
Database

Store consent information when appropriate:

cookie_consents

id
user_id
anonymous_id
essential
analytics
preferences
marketing
policy_version
created_at
updated_at

Do not store unnecessary personal information.

5. REFUND AND CANCELLATION

Only implement the payment/refund functionality if Sahyog actually handles money.

If Sahyog is free:

Do NOT create fake payment/refund functionality.

If payments are introduced later, implement the following.

Route
/refund-policy

Footer:

Refund Policy
Cancellation Policy
Policy sections
1. Introduction
2. Applicable Services
3. Cancellation
4. Refund Eligibility
5. Non-Refundable Transactions
6. Refund Processing Time
7. Failed Payments
8. Duplicate Payments
9. Disputes
10. Contact Support

The exact refund rules must be based on the actual services/products being sold.

Do not hard-code an arbitrary "7-day refund" or similar policy unless the business has actually adopted that policy.

6. PAYMENT SYSTEM

If Sahyog requires payments, keep payment processing isolated from the core problem-reporting system.

Recommended architecture:

Frontend
    ↓
Backend
    ↓
Payment Service
    ↓
Payment Gateway
    ↓
Webhook
    ↓
Backend
    ↓
Database

Possible gateway:

PayPal

or another gateway appropriate for the actual target market and business model.

Do not store:

credit card number
CVV
full card details

on Sahyog servers.

Use the payment provider's secure checkout/tokenization mechanisms.

7. PAYMENT DATABASE

Create:

payments

id
user_id
order_id
provider
provider_payment_id
amount
currency
status
payment_method
created_at
updated_at

Possible statuses:

PENDING
PROCESSING
SUCCEEDED
FAILED
CANCELLED
REFUNDED
PARTIALLY_REFUNDED
8. PAYMENT FLOW
User
 ↓
Select Paid Service
 ↓
Create Order
 ↓
Create Payment
 ↓
Payment Gateway
 ↓
User Completes Payment
 ↓
Gateway
 ↓
Webhook
 ↓
Backend Verification
 ↓
Update Payment
 ↓
Update Order
 ↓
Show Result
Important

Do NOT trust only the frontend redirect to determine payment success.

The backend must verify the payment using the gateway's server-side mechanism/webhook.

9. PAYMENT SUCCESS

Route:

/payment/success

Display:

Payment successful

Your payment has been successfully processed.

Transaction ID:
XXXXXX

Amount:
₹XXX

[ Continue ]

[ View Payment History ]

Only display "successful" after backend verification.

10. PAYMENT FAILED

Route:

/payment/failed

Display:

Payment could not be completed

Your payment was not successful.

No successful payment was recorded for this transaction.

[ Try Again ]

[ Return to Dashboard ]

[ Contact Support ]

Possible reasons:

Payment declined
Payment cancelled
Network failure
Gateway unavailable
Session expired
Payment verification failed

Don't expose gateway internals.

11. PAYMENT PENDING

Route:

/payment/pending

Display:

Payment processing

We're waiting for confirmation from the payment provider.

Please do not make another payment for the same order.

[ Check Payment Status ]

Backend should periodically/reliably reconcile the status.

12. DUPLICATE PAYMENT PROTECTION

This is extremely important.

Use:

idempotency key

for payment/order creation where supported.

If the user clicks:

Pay
Pay
Pay

three times, the system should not accidentally create three successful transactions.

13. PASSWORD RESET

Routes:

/forgot-password
/reset-password
Forgot Password

Heading:

Forgot your password?

Text:

Enter the email address associated with your Sahyog account and we'll send you a password reset link.

Input:

Email address

Button:

Send Reset Link

Success:

If an account exists with this email address, you'll receive a password reset link shortly.

This wording helps prevent account enumeration.

14. Password Reset Backend

Flow:

User
 ↓
Forgot Password
 ↓
Email
 ↓
Backend
 ↓
Generate secure random token
 ↓
Store hashed token
 ↓
Set expiration
 ↓
Send email
 ↓
User clicks link
 ↓
Reset Password
 ↓
Validate token
 ↓
Change password
 ↓
Invalidate token

Token must:

Be cryptographically random
Be single-use
Expire
Be stored securely

Do not store reset tokens in plaintext if avoidable.

15. Reset Password UI
Create a new password

New Password
[................]

Confirm Password
[................]

Password requirements:
✓ At least X characters
✓ Passwords match

[ Reset Password ]

After success:

Your password has been changed successfully.

Button:

Go to Login

Invalidate existing reset tokens.

Consider invalidating existing sessions depending on your authentication architecture and security policy.

16. EMAIL VERIFICATION

Routes:

/verify-email
/resend-verification

After registration:

Verify your email

We've sent a verification link to:
user@example.com

Please check your inbox.

[ Resend Email ]

[ Change Email ]
17. Email Verification Flow
Register
 ↓
Create account
 ↓
Email verified = false
 ↓
Generate verification token
 ↓
Send email
 ↓
User clicks link
 ↓
Backend validates token
 ↓
email_verified = true

Database:

users

email_verified
email_verified_at

Verification token:

single-use
time-limited
secure
18. Unverified Account

Decide which features require verification.

Recommended:

Browse public problems
    ↓
Allowed

Submit problem
    ↓
Email verification required

Create collaboration
    ↓
Email verification required

Payment
    ↓
Email verification required

If a user tries a restricted feature:

Please verify your email to continue.

[ Verify Email ]
19. ACCESS DENIED — 403

Route:

/403

Display:

Access denied

You don't have permission to access this page.

[ Go to Dashboard ]

Example:

A citizen attempts:

/admin

Backend returns:

403 Forbidden

Frontend displays the appropriate page.

20. IMPORTANT SECURITY RULE

Never rely on frontend hiding.

Bad:

if (role !== "ADMIN") {
    hideAdminButton();
}

This is only UX.

Backend must also enforce:

ADMIN-only endpoint
        ↓
Authentication
        ↓
Authorization
        ↓
Role verification
21. 401 — UNAUTHORIZED

This is different from 403.

Use:

401 Unauthorized

when the user is not authenticated.

UI:

Please sign in to continue.

[ Login ]

[ Create Account ]
22. MAINTENANCE PAGE

Route:

/maintenance

Display:

We'll be back soon

Sahyog is temporarily unavailable while
we perform scheduled maintenance.

We apologize for the inconvenience.

[ Try Again ]

Optional:

Estimated return:
10:30 PM

Only show an estimated time if the team actually knows it.

23. MAINTENANCE MODE

Do not hard-code maintenance mode into the frontend.

Backend/configuration should control it.

Example:

MAINTENANCE_MODE=true

Application behavior:

Request
 ↓
Maintenance middleware
 ↓
Maintenance enabled?
 ↓ YES
Maintenance response

But administrators should retain a secure way to manage the system.

24. SUPPORT PAGE

Route:

/support

Heading:

How can we help?

Categories:

Account
Problem Report
AI Analysis
Voice / Language
Organization
Collaboration
Payment
Privacy
Technical Issue
Other
25. Contact Support

Form:

Subject
[________________]

Category
[ Select ]

Description
[________________________]

Attachment
[ Optional ]

[ Submit Request ]

For logged-in users, automatically associate:

user_id

Do not ask the user to manually enter their email if it's already available.

26. SUPPORT TICKETS

Database:

support_tickets

id
user_id
category
subject
description
status
priority
assigned_to
created_at
updated_at

Statuses:

OPEN
IN_PROGRESS
WAITING_FOR_USER
RESOLVED
CLOSED
27. Support Success

After submission:

Support request submitted

Your support request has been received.

Ticket ID:
SUP-001234

Our team will review your request.

[ View Support Requests ]
28. SUPPORT ERROR

If submission fails:

We couldn't submit your request.

Please try again.

[ Try Again ]

Don't display:

Database connection refused
SMTP exception
Stack trace
29. GLOBAL ERROR SYSTEM

Your production application should handle at least:

400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
408 Request Timeout
409 Conflict
413 File Too Large
422 Validation Error
429 Too Many Requests
500 Internal Server Error
502 Bad Gateway
503 Service Unavailable

Map them to friendly UI.

30. GLOBAL ERROR PAGE

For unexpected errors:

Something went wrong

We couldn't complete your request.

Please try again.

[ Try Again ]

[ Go to Home ]

If the problem continues, contact support.

Generate an internal error ID:

Error ID: ERR-XXXXXXXX

The user can give this ID to support.

31. ERROR LOGGING

Backend should log:

timestamp
request ID
error type
endpoint
HTTP status
user ID where appropriate
server context

Never log:

passwords
password reset tokens
authentication secrets
payment card details
API keys
private credentials
32. GLOBAL LOADING STATES

Every API-driven action needs a loading state.

Example:

Submit Problem
      ↓
Submitting...

Disable duplicate submission:

[ Submitting... ]

instead of allowing:

Submit
Submit
Submit
33. SESSION EXPIRATION

If the user's session expires:

Your session has expired.

Please sign in again to continue.

Buttons:

[ Login ]

Don't silently lose unsaved form data where practical.

34. NETWORK FAILURE

If internet connection fails:

Connection lost

Please check your internet connection
and try again.

For problem submission, make sure the UI does not falsely say:

Problem submitted

until the backend has confirmed it.

35. SECURITY REQUIREMENTS

Implement:

HTTPS
Secure authentication
Password hashing
Secure cookies where applicable
CSRF protection where applicable
Rate limiting
Input validation
Output encoding
File validation
File size limits
Authorization
Audit logging
Secure headers
CORS configuration
Secret management

For uploads:

Validate MIME type
Validate file extension
Validate file size
Validate actual file content where possible
Generate safe storage names
Do not execute uploaded files
Store uploads outside executable application paths
36. AUDIT LOGGING

Create:

audit_logs

id
user_id
action
resource_type
resource_id
timestamp
ip_address
metadata

Examples:

USER_LOGIN
PASSWORD_CHANGED
EMAIL_VERIFIED
PROBLEM_CREATED
PROBLEM_UPDATED
AI_RESULT_CORRECTED
COLLABORATION_CREATED
PAYMENT_CREATED
REFUND_REQUESTED
ACCOUNT_DELETED
ADMIN_ACTION

Be careful not to put sensitive secrets into metadata.

37. ACCOUNT DELETION

Settings:

Account
Security
Privacy
Delete Account

Confirmation:

Delete your account?

This action may permanently remove or anonymize
your account information according to our data
retention requirements.

[ Cancel ]

[ Continue ]

For high-risk actions, require re-authentication or another appropriate verification step.

38. PRODUCTION FOOTER

Every public page should have:

SAHYOG

Report. Connect. Solve.

Platform
Home
Explore Problems
How It Works

Organizations
Universities
Industry

Support
Help Center
Contact Support

Legal
Privacy Policy
Terms & Conditions
Cookie Policy
Refund & Cancellation

Languages
English | हिन्दी | खोरठा

© 2026 Sahyog
39. FINAL ROUTE MAP

Your frontend should eventually contain:

/
├── /login
├── /register
├── /forgot-password
├── /reset-password
├── /verify-email
│
├── /dashboard
├── /problems
├── /problems/:id
├── /report-problem
│
├── /matches
├── /collaborations
├── /collaborations/:id
├── /solutions
│
├── /support
├── /support/:id
│
├── /payment/success
├── /payment/failed
├── /payment/pending
├── /payments
│
├── /privacy-policy
├── /terms
├── /cookies
├── /cookie-preferences
├── /refund-policy
│
├── /403
├── /404
├── /maintenance
│
└── /admin
    ├── /users
    ├── /problems
    ├── /organizations
    ├── /ai-review
    ├── /payments
    ├── /refunds
    ├── /support
    └── /audit-logs
40. Backend API Requirements

Your AI coding agent should also implement these API groups:

/api/auth
    POST /register
    POST /login
    POST /logout
    POST /forgot-password
    POST /reset-password
    POST /verify-email
    POST /resend-verification

/api/users
    GET /me
    PATCH /me
    DELETE /me

/api/problems
    POST /
    GET /
    GET /:id
    PATCH /:id
    DELETE /:id

/api/ai
    POST /analyze
    GET /analysis/:problemId

/api/matches
    GET /problem/:problemId

/api/collaborations
    POST /
    GET /:id
    PATCH /:id
    POST /:id/cancel

/api/support
    POST /
    GET /
    GET /:id

/api/cookies
    GET /preferences
    POST /preferences

/api/payments
    POST /create
    GET /:id
    POST /:id/cancel
    POST /webhook

/api/refunds
    POST /
    GET /:id

/api/admin
    ...

The exact endpoints should be reconciled with your existing API specification before implementation rather than blindly duplicating endpoints.

41. DATABASE ADDITIONS

Add these production tables to the schema we already designed:

password_reset_tokens

email_verification_tokens

cookie_consents

payments

payment_events

refunds

support_tickets

audit_logs

Potentially:

user_sessions
notifications

depending on your authentication/session architecture.

42. Email System

You will need transactional emails for:

Email verification
Password reset
Security alerts
Support ticket creation
Support ticket updates
Payment confirmation
Payment failure
Refund updates
Collaboration notifications

Do not build these as frontend-only notifications.

Use a backend email service.

43. Email Templates

Create reusable templates:

emails/
├── verify-email
├── password-reset
├── password-changed
├── payment-success
├── payment-failed
├── refund-created
├── refund-completed
├── support-created
└── support-updated

Every email should include:

Sahyog logo/name
Clear subject
Reason for email
Relevant action
Support/contact information
44. AI CODING AGENT RULES

This section is especially important.

Add the following to your AI coding agent's project instructions:

PRODUCTION IMPLEMENTATION RULES

1. Do not only create frontend pages.
   Implement the required backend/API behavior.

2. Do not invent database tables when an existing schema already
   provides the required functionality.

3. Before changing the database schema, inspect the existing schema.

4. Before creating an API endpoint, inspect existing API routes.

5. Reuse existing components where possible.

6. Do not duplicate authentication logic.

7. Do not put authorization logic only in the frontend.

8. All protected APIs must validate authentication and authorization
   on the backend.

9. Never expose passwords, tokens, API keys, payment credentials,
   or other secrets in frontend code.

10. Never store raw passwords.

11. Never store card numbers or CVV.

12. Payment success must be verified server-side.

13. Never trust a frontend payment-success redirect.

14. Payment webhooks must be verified.

15. Payment operations must be idempotent.

16. Never display raw server errors to normal users.

17. All API failures must have user-friendly UI states.

18. All forms must have validation.

19. All asynchronous operations must have loading states.

20. Prevent duplicate form submissions.

21. All file uploads must be validated.

22. Image is mandatory for problem submission.

23. Text and voice are optional.

24. Failure of optional voice processing must not prevent
    submission when the required image is valid.

25. Preserve original user-submitted language/content.

26. Do not claim AI output is always correct.

27. Low-confidence AI results must be reviewable where applicable.

28. Keep UI translation separate from NLP processing.

29. Never hard-code multilingual UI strings.

30. Use translation keys.

31. Maintain accessibility.

32. Maintain responsive behavior.

33. Use consistent error handling.

34. Add appropriate logging.

35. Never log passwords, tokens, payment secrets, or sensitive data.

36. Use secure environment variables for secrets.

37. Do not remove an existing feature simply to implement a new feature.

38. Do not make unrelated architectural changes.

39. Before modifying a shared component, check all places where it is used.

40. After implementation, test both the success and failure paths.

41. Update documentation whenever an API, database schema,
    environment variable, or architecture changes.

42. Never mark a feature as complete if only the UI exists.

43. Every production feature must be implemented end-to-end.

44. Do not use fake payment success, fake AI results, or fake
    production statistics.

45. Use mocks only in development/testing and clearly isolate them
    from production configuration.
45. Definition of "Production Ready"

For your project, production-ready does NOT mean "all pages exist."

A feature is complete only when:

UI
 ↓
Validation
 ↓
API
 ↓
Backend logic
 ↓
Database
 ↓
Security
 ↓
Loading state
 ↓
Success state
 ↓
Error state
 ↓
Mobile responsive
 ↓
Accessibility
 ↓
Testing
 ↓
Documentation

For example, Password Reset is NOT complete merely because /forgot-password exists.

It is complete only when:

Forgot Password UI
        ↓
API
        ↓
Secure token
        ↓
Database
        ↓
Email
        ↓
Reset page
        ↓
Token validation
        ↓
Password update
        ↓
Token invalidation
        ↓
Success/error handling
        ↓
Security testing

That is the standard I recommend you use for every feature in Sahyog.