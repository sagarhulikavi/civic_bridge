import requests
import json
import io
from PIL import Image

BASE_URL = "http://localhost:5000/api"

def run_tests():
    print("[INFO] Starting Sahyog Comprehensive End-to-End Golden Flow Verification...\n")
    
    # 1. Test Auth: Login as Demo Citizen
    print("1. Testing Citizen Authentication...")
    login_payload = {
        "email": "citizen@drishti.in",
        "password": "Password@123"
    }
    res = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
    assert res.status_code == 200, f"Login failed: {res.text}"
    auth_data = res.json()["data"]
    citizen_token = auth_data["token"]
    citizen_user = auth_data["user"]
    print(f"   [OK] Citizen logged in: {citizen_user['name']} ({citizen_user['displayId']})")

    # 2. Test Mandatory Image Validation (Missing Image should fail with 400)
    print("\n2. Testing Mandatory Image Validation (Submitting without image)...")
    bad_res = requests.post(f"{BASE_URL}/problems", data={"title": "Test without photo"})
    assert bad_res.status_code == 400, "Should reject submission without image"
    print(f"   [OK] Successfully rejected image-less submission: {bad_res.json()['error']['code']}")

    # 3. Test Full Problem Submission with Mandatory Image
    print("\n3. Submitting Problem with Mandatory Photo & GPS Location...")
    img_byte_arr = io.BytesIO()
    img = Image.new('RGB', (300, 300), color=(70, 70, 70))
    img.save(img_byte_arr, format='JPEG')
    img_bytes = img_byte_arr.getvalue()

    files = {
        'image': ('road_pothole_bit_mesra.jpg', img_bytes, 'image/jpeg')
    }
    data = {
        'title': 'Severe Pothole Cluster near BIT Mesra Gate 2',
        'description': 'Deep potholes causing vehicle congestion and water stagnation during monsoon rains.',
        'locationName': 'BIT Mesra Gate 2 Road',
        'district': 'Ranchi',
        'state': 'Jharkhand',
        'latitude': 23.4241,
        'longitude': 85.4385,
        'language': 'kh'
    }
    headers = {
        'Authorization': f'Bearer {citizen_token}'
    }

    sub_res = requests.post(f"{BASE_URL}/problems", files=files, data=data, headers=headers)
    assert sub_res.status_code == 201, f"Submission failed: {sub_res.text}"
    problem = sub_res.json()["data"]["problem"]
    problem_id = problem["id"]
    print(f"   [OK] Problem Created: {problem['displayId']} - {problem['title']}")
    print(f"   [OK] AI Category: {problem.get('category', {}).get('name', 'Road Infrastructure')}")
    print(f"   [OK] Priority: {problem['priority']} (Score: {problem.get('priorityScore')}/100)")

    # 4. Verify Matches Generated
    print("\n4. Verifying Explainable University & Industry Matches...")
    matches_res = requests.get(f"{BASE_URL}/matches/problem/{problem_id}")
    assert matches_res.status_code == 200, f"Match lookup failed: {matches_res.text}"
    matches = matches_res.json()["data"]["matches"]
    assert len(matches) > 0, "Should have matched organizations"
    for m in matches:
        print(f"   [MATCH] {m['organization']['type']}: {m['organization']['name']} (Score: {m['matchScore']}%)")
        reasons = json.loads(m['matchReasons']) if isinstance(m['matchReasons'], str) else m['matchReasons']
        print(f"           Reasons: {reasons[0] if reasons else 'Domain fit'}")

    # 5. University Professor Logs In and Joins Collaboration
    print("\n5. University Professor Joins Collaboration Room...")
    univ_login = requests.post(f"{BASE_URL}/auth/login", json={"email": "prof.sharma@bitmesra.ac.in", "password": "Password@123"})
    assert univ_login.status_code == 200
    univ_token = univ_login.json()["data"]["token"]

    collab_res = requests.post(f"{BASE_URL}/collaborations", json={"problemId": problem_id}, headers={"Authorization": f"Bearer {univ_token}"})
    assert collab_res.status_code == 201
    collab = collab_res.json()["data"]["collaboration"]
    collab_id = collab["id"]
    solution_id = collab["solutions"][0]["id"]
    print(f"   [OK] Collaboration Room Active: {collab_id}")
    print(f"   [OK] Lead Solution: {collab['solutions'][0]['title']} (Initial Progress: {collab['solutions'][0]['progressPercentage']}%)")

    # 6. Industry CSR Lead Logs In and Updates Milestones to 100% (RESOLVED)
    print("\n6. Industry CSR Partner Joins & Logs 100% Completion Milestone...")
    ind_login = requests.post(f"{BASE_URL}/auth/login", json={"email": "siddharth@tatasteel.com", "password": "Password@123"})
    assert ind_login.status_code == 200
    ind_token = ind_login.json()["data"]["token"]

    update_res = requests.post(
        f"{BASE_URL}/collaborations/{collab_id}/solutions/{solution_id}/updates",
        json={
            "title": "Completed Asphalt Surfacing & Drainage Invert Stabilization",
            "description": "Tata Steel deployed rapid-pave bitumen team with BIT Mesra civil field validation.",
            "progressPercentage": 100,
            "stage": "COMPLETED"
        },
        headers={"Authorization": f"Bearer {ind_token}"}
    )
    assert update_res.status_code == 201
    print("   [OK] Solution Milestone Updated to 100% (COMPLETED)")

    # Verify Problem Status is now RESOLVED
    final_prob = requests.get(f"{BASE_URL}/problems/{problem_id}").json()["data"]["problem"]
    print(f"   [SUCCESS] Problem Final Status: {final_prob['status']} (Expected: RESOLVED)")
    assert final_prob["status"] == "RESOLVED"

    # 7. Support Ticket Submission
    print("\n7. Testing Support Ticketing System...")
    sup_res = requests.post(f"{BASE_URL}/support", json={
        "email": "citizen@drishti.in",
        "category": "Problem Submission Query",
        "subject": "Inquiry regarding road repair status",
        "description": "Thank you for the quick resolution of BIT Mesra road potholes!"
    })
    assert sup_res.status_code == 201
    print(f"   [OK] Support Ticket Created: {sup_res.json()['data']['ticket']['displayId']}")

    # 8. Admin Dashboard Triage & Audit
    print("\n8. Testing Admin Command Center & Audit Stream...")
    admin_login = requests.post(f"{BASE_URL}/auth/login", json={"email": "admin@drishti.gov.in", "password": "Password@123"})
    assert admin_login.status_code == 200
    admin_token = admin_login.json()["data"]["token"]

    dash_res = requests.get(f"{BASE_URL}/admin/dashboard", headers={"Authorization": f"Bearer {admin_token}"})
    assert dash_res.status_code == 200
    stats = dash_res.json()["data"]["stats"]
    print(f"   [OK] Admin Metrics: Total Problems={stats['totalProblems']}, Resolved={stats['resolvedProblems']}, Collaborations={stats['totalCollaborations']}")

    print("\n[SUCCESS] ALL END-TO-END INTEGRATION TESTS PASSED WITH 100% SUCCESS!")

if __name__ == "__main__":
    run_tests()
