import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'http://localhost:5000/api';

// Minimal valid 1x1 PNG (magic bytes: 89 50 4E 47)
const PNG_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const imagePath = path.join(__dirname, '__smoke.png');
fs.writeFileSync(imagePath, Buffer.from(PNG_B64, 'base64'));

const invalidImagePath = path.join(__dirname, '__smoke.txt');
fs.writeFileSync(invalidImagePath, 'this is not an image');

const RUN = Date.now();
let pass = 0, fail = 0;
function ok(cond, label) {
  if (cond) { pass++; console.log('  PASS  ' + label); }
  else { fail++; console.log('  FAIL  ' + label); }
}
function assertStatus(res, expected, label) {
  ok(res.status === expected, `${label} -> ${res.status} (expected ${expected})`);
  return res;
}
async function login(email, password) {
  const r = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const j = await r.json();
  return { status: r.status, data: j.data, token: j.data?.token, user: j.data?.user };
}

function multipart(fields, imagePathParam, audioPathParam = null) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  if (imagePathParam) fd.append('image', new Blob([fs.readFileSync(imagePathParam)], { type: 'image/png' }), path.basename(imagePathParam));
  if (audioPathParam) fd.append('audio', new Blob([fs.readFileSync(audioPathParam)], { type: 'audio/webm' }), path.basename(audioPathParam));
  return fd;
}

async function submit(fd, token) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const r = await fetch(`${BASE}/problems`, { method: 'POST', headers, body: fd });
  const j = await r.json();
  return { status: r.status, data: j.data, err: j.error };
}

console.log('== LOGIN ==');
const admin = await login('admin@drishti.gov.in', 'Password@123');
const citizen = await login('citizen@drishti.in', 'Password@123');
const univ = await login('prof.sharma@bitmesra.ac.in', 'Password@123');
const industry = await login('siddharth@tatasteel.com', 'Password@123');
ok(admin.status === 200 && admin.token, 'admin login');
ok(citizen.status === 200 && citizen.token, 'citizen login');
ok(univ.status === 200 && univ.token, 'university login');
ok(industry.status === 200 && industry.token, 'industry login');
console.log('  roles/admin org:', admin.user?.role, '| univ orgId:', univ.user?.organizationId, '| industry orgId:', industry.user?.organizationId);

console.log('\n== SUBMIT (valid image) ==');
const sub = await submit(multipart({
  title: 'Pothole near Ranchi main road ' + RUN,
  description: 'Large pothole causing damage to vehicles',
  language: 'en',
  district: 'Ranchi',
  state: 'Jharkhand',
  latitude: '23.35', longitude: '85.31', locationName: 'Main Road, Ranchi'
}, imagePath), citizen.token);
assertStatus(sub, 201, 'submit valid problem (200/201)');
ok(sub.data?.problem?.status === 'PENDING_ADMIN_REVIEW', 'problem lands at PENDING_ADMIN_REVIEW');
const pid = sub.data?.problem?.id;
const pidDisplay = sub.data?.problem?.displayId;
console.log('  problem id:', pid, 'displayId:', pidDisplay);

console.log('\n== SUBMIT WITHOUT IMAGE ==');
const noImg = await submit(multipart({ title: 'No image problem', language: 'en' }, null), citizen.token);
assertStatus(noImg, 400, 'submit with no image rejected');
ok(noImg.err?.code === 'IMAGE_REQUIRED', 'no-image error code IMAGE_REQUIRED');

console.log('\n== SUBMIT WITH INVALID IMAGE (txt) ==');
const badImg = await submit(multipart({ title: 'Bad image problem', language: 'en' }, invalidImagePath), citizen.token);
assertStatus(badImg, 400, 'submit with txt-as-image rejected');
ok(badImg.err?.code === 'INVALID_IMAGE_FILE', 'bad-image error code INVALID_IMAGE_FILE');

console.log('\n== PUBLIC VISIBILITY BEFORE APPROVAL ==');
const pubList = await fetch(`${BASE}/problems`).then(r => r.json());
const inPublicBefore = pubList.data?.problems?.some(p => p.id === pid);
ok(!inPublicBefore, 'pending problem NOT in public list');
const pubDetail = await fetch(`${BASE}/problems/${pid}`).then(r => ({ status: r.status, json: r.json() }));
const pubDetailStatus = pubDetail.status;
pubDetail.json.then((j) => {
  ok(pubDetailStatus === 403 || pubDetailStatus === 404, `public detail blocked before approval (${pubDetailStatus})`);
  console.log('\n== DEDUPE (rapid resubmit) ==');
  return null;
}).catch(()=>{});

console.log('\n== ROLE ENFORCEMENT ON APPROVE ==');
const citizenApprove = await fetch(`${BASE}/problems/${pid}/status`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${citizen.token}` },
  body: JSON.stringify({ status: 'APPROVED' })
});
assertStatus(citizenApprove, 403, 'citizen cannot approve (403)');
const universityApprove = await fetch(`${BASE}/problems/${pid}/status`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${univ.token}` },
  body: JSON.stringify({ status: 'APPROVED' })
});
assertStatus(universityApprove, 403, 'university cannot approve (403)');

console.log('\n== INVALID TRANSITION ==');
// submit a second problem to test invalid arrow SUBMITTED -> RESOLVED rejected
const sub2 = await submit(multipart({
  title: 'Second problem for invalid transition test ' + RUN,
  language: 'en', district: 'Ranchi'
}, imagePath), citizen.token);
const pid2 = sub2.data?.problem?.id;
const invalidTrans = await fetch(`${BASE}/problems/${pid2}/status`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${admin.token}` },
  body: JSON.stringify({ status: 'RESOLVED' })
});
assertStatus(invalidTrans, 409, 'invalid transition SUBMITTED->RESOLVED rejected (409)');

console.log('\n== ADMIN APPROVE ==');
const approve = await fetch(`${BASE}/problems/${pid}/status`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${admin.token}` },
  body: JSON.stringify({ status: 'APPROVED' })
});
const approveJ = await approve.json();
assertStatus(approve, 200, 'admin approve (200)');
ok(approveJ.data?.problem?.status === 'UNIVERSITY_MATCHING', 'problem now UNIVERSITY_MATCHING');
ok((approveJ.data?.problem?.matches || []).length > 0, 'matches created on approval');

console.log('\n== PUBLIC VISIBILITY AFTER APPROVAL ==');
const pubList2 = await fetch(`${BASE}/problems`).then(r => r.json());
ok(pubList2.data?.problems?.some(p => p.id === pid), 'approved problem now in public list');
const pubDetail2a = await fetch(`${BASE}/problems/${pid}`);
ok(pubDetail2a.status === 200, 'public detail accessible after approval');

console.log('\n== CITIZEN TRACKING ==');
const meList = await fetch(`${BASE}/problems?reporterId=${citizen.user.id}`, {
  headers: { Authorization: `Bearer ${citizen.token}` }
}).then(r => r.json());
ok(meList.data?.problems?.some(p => p.id === pid), 'citizen sees own problem in tracking');

console.log('\n== UNIVERSITY WORKFLOW ==');
const interest = await fetch(`${BASE}/workflow/${pid}/interest`, {
  method: 'POST', headers: { Authorization: `Bearer ${univ.token}` }
});
const interestJ = await interest.json();
assertStatus(interest, 200, 'university interest (200)');
ok(interestJ.data?.problem?.status === 'UNIVERSITY_INTERESTED', 'status UNIVERSITY_INTERESTED');

const idea = await fetch(`${BASE}/workflow/${pid}/idea`, {
  method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${univ.token}` },
  body: JSON.stringify({ title: 'Drainage & resurfacing idea', description: 'Install drainage then resurface' })
});
const ideaJ = await idea.json();
assertStatus(idea, 200, 'university idea (200)');
ok(ideaJ.data?.problem?.status === 'IDEA_SUBMITTED', 'status IDEA_SUBMITTED');

const proto = await fetch(`${BASE}/workflow/${pid}/prototype`, {
  method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${univ.token}` },
  body: JSON.stringify({ title: 'Prototype: cold-patch kit' })
});
const protoJ = await proto.json();
assertStatus(proto, 200, 'university prototype (200)');
ok(protoJ.data?.problem?.status === 'INDUSTRY_REVIEW', 'status INDUSTRY_REVIEW');

console.log('\n== INDUSTRY WORKFLOW ==');
const review = await fetch(`${BASE}/workflow/${pid}/review`, {
  method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${industry.token}` },
  body: JSON.stringify({ decision: 'ACCEPT' })
});
const reviewJ = await review.json();
assertStatus(review, 200, 'industry review accept (200)');
ok(reviewJ.data?.problem?.status === 'ACCEPTED', 'status ACCEPTED');

const support = await fetch(`${BASE}/workflow/${pid}/support`, {
  method: 'POST', headers: { Authorization: `Bearer ${industry.token}` }
});
const supportJ = await support.json();
assertStatus(support, 200, 'industry support (200)');
ok(supportJ.data?.problem?.status === 'PROTOTYPE_DEVELOPMENT', 'status PROTOTYPE_DEVELOPMENT');

const implement = await fetch(`${BASE}/workflow/${pid}/implement`, {
  method: 'POST', headers: { Authorization: `Bearer ${industry.token}` }
});
const implementJ = await implement.json();
assertStatus(implement, 200, 'industry implement (200)');
ok(implementJ.data?.problem?.status === 'IMPLEMENTED', 'status IMPLEMENTED');

const resolve = await fetch(`${BASE}/workflow/${pid}/resolve`, {
  method: 'POST', headers: { Authorization: `Bearer ${industry.token}` }
});
const resolveJ = await resolve.json();
assertStatus(resolve, 200, 'industry resolve (200)');
ok(resolveJ.data?.problem?.status === 'RESOLVED', 'status RESOLVED');

console.log('\n== UNIVERSITY CANNOT SEE OTHERS/UNMATCHED ==');
// university should not see a problem not matched to their org (use a problems list bound by role)
// Attempt an invalid cross-role jump: citizen tries submit then university tries approve on resolved
console.log('\n== SUMMARY ==');
console.log(`  PASS: ${pass}  FAIL: ${fail}`);
process.exit(fail > 0 ? 1 : 0);
