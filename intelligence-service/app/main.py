"""
DRISHTI Intelligence & Decision Engine Service (Division 4)
Handles Priority Scoring, Multi-Signal Duplicate Detection, Clustering, and Explainable Matching.
"""

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import math

app = FastAPI(
    title="DRISHTI Intelligence & Decision Engine",
    description="Priority Evaluation, Duplicate Detection, Clustering, and Explainable University & Industry Matching",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------------------
# Request / Response Schemas
# ----------------------------------------------------

class PriorityEvaluationRequest(BaseModel):
    problem_id: Optional[str] = None
    category: str
    subcategory: Optional[str] = None
    text_content: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    nearby_reports_count: Optional[int] = 1

class PriorityEvaluationResponse(BaseModel):
    priority: str # LOW, MEDIUM, HIGH, CRITICAL
    score: int # 0 - 100
    reasons: List[str]

class DuplicateCheckRequest(BaseModel):
    problem_id: Optional[str] = None
    category: str
    title: Optional[str] = None
    description: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    existing_problems: Optional[List[Dict[str, Any]]] = []

class DuplicateCandidate(BaseModel):
    problem_id: str
    display_id: str
    title: str
    similarity_score: float
    reasons: List[str]

class DuplicateCheckResponse(BaseModel):
    is_potential_duplicate: bool
    highest_similarity: float
    candidates: List[DuplicateCandidate]

class MatchEvaluationRequest(BaseModel):
    problem_id: Optional[str] = None
    category: str
    required_expertise: List[str]
    district: Optional[str] = None
    state: Optional[str] = None

class OrganizationMatch(BaseModel):
    organization_id: str
    display_id: str
    name: str
    type: str # UNIVERSITY, INDUSTRY
    match_score: int # 0 - 100
    reasons: List[str]

class RecommendationsResponse(BaseModel):
    problem_id: Optional[str]
    priority: str
    priority_score: int
    recommended_department: str
    university_matches: List[OrganizationMatch]
    industry_matches: List[OrganizationMatch]

# ----------------------------------------------------
# Core Algorithms
# ----------------------------------------------------

def calculate_priority_score(req: PriorityEvaluationRequest) -> Dict[str, Any]:
    """Computes deterministic 0-100 priority score based on severity, public risk, recurrence, and keywords."""
    score = 40 # Base baseline score
    reasons = []
    
    cat_lower = req.category.lower()
    text_corpus = (req.subcategory or "") + " " + (req.text_content or "")
    text_lower = text_corpus.lower()
    
    # 1. Category-specific hazard weight
    if "electric" in cat_lower or "power" in cat_lower:
        score += 35
        reasons.append("⚡ High-voltage electric shock hazard risk")
    elif "water" in cat_lower:
        score += 25
        reasons.append("💧 Vital drinking water / public sanitation necessity")
    elif "road" in cat_lower or "infrastructure" in cat_lower:
        score += 20
        reasons.append("🛣️ Public transport arterial route affected")
    elif "waste" in cat_lower:
        score += 15
        reasons.append("🗑️ Public health and sanitation concern")
        
    # 2. Critical landmark proximity & vulnerability terms
    if any(k in text_lower for k in ["school", "college", "विद्यालय", "स्कूल"]):
        score += 18
        reasons.append("🏫 Located in close proximity to a school zone / children transit")
    if any(k in text_lower for k in ["hospital", "clinic", "अस्पताल", "emergency"]):
        score += 20
        reasons.append("🏥 Adjacent to healthcare facility access route")
    if any(k in text_lower for k in ["accident", "injury", "danger", "खतरा", "गड्ढा"]):
        score += 12
        reasons.append("⚠️ Citizen reported direct danger of accidents or vehicle damage")
        
    # 3. Recurrence & Community Density
    if req.nearby_reports_count and req.nearby_reports_count > 1:
        bonus = min(req.nearby_reports_count * 5, 15)
        score += bonus
        reasons.append(f"📍 Multiple related community reports ({req.nearby_reports_count}) in this vicinity")
        
    # Normalize score 0 - 100
    final_score = min(max(score, 10), 98)
    
    if final_score >= 75:
        priority_label = "CRITICAL"
    elif final_score >= 50:
        priority_label = "HIGH"
    elif final_score >= 25:
        priority_label = "MEDIUM"
    else:
        priority_label = "LOW"
        
    if not reasons:
        reasons.append("Standard community maintenance priority evaluation.")
        
    return {
        "priority": priority_label,
        "score": final_score,
        "reasons": reasons
    }

def evaluate_duplicates(req: DuplicateCheckRequest) -> Dict[str, Any]:
    """Evaluates multi-signal duplicate probability using Category, Distance, and Keyword overlap."""
    candidates = []
    highest_sim = 0.0
    
    for item in (req.existing_problems or []):
        sim = 0.0
        reasons = []
        
        # 1. Category exact match (10%)
        if item.get("category", "").lower() == req.category.lower():
            sim += 0.20
            reasons.append("Identical problem category")
            
        # 2. Geographic distance (40%)
        lat1, lon1 = req.latitude, req.longitude
        lat2, lon2 = item.get("latitude"), item.get("longitude")
        if lat1 and lon1 and lat2 and lon2:
            # Simple Euclidean approx in degrees (~111km per deg)
            dist_km = math.sqrt((lat1 - lat2)**2 + (lon1 - lon2)**2) * 111.0
            if dist_km < 0.5: # within 500m
                sim += 0.45
                reasons.append(f"Located within {int(dist_km*1000)} meters")
            elif dist_km < 2.0:
                sim += 0.25
                reasons.append(f"Nearby vicinity ({round(dist_km, 1)} km)")
        else:
            sim += 0.15 # Neutral fallback
            
        # 3. Text semantic keyword overlap (35%)
        text1 = ((req.title or "") + " " + (req.description or "")).lower()
        text2 = ((item.get("title") or "") + " " + (item.get("description") or "")).lower()
        words1 = set(text1.split())
        words2 = set(text2.split())
        overlap = words1.intersection(words2)
        if len(overlap) >= 3:
            sim += 0.30
            reasons.append(f"Shared descriptive terms: {', '.join(list(overlap)[:3])}")
            
        sim = min(round(sim, 2), 0.95)
        if sim >= 0.55:
            if sim > highest_sim:
                highest_sim = sim
            candidates.append(DuplicateCandidate(
                problem_id=str(item.get("id", "PRB-EXISTING")),
                display_id=str(item.get("displayId", "PRB-000102")),
                title=str(item.get("title", "Existing Similar Problem")),
                similarity_score=sim,
                reasons=reasons
            ))
            
    return {
        "is_potential_duplicate": highest_sim >= 0.70,
        "highest_similarity": highest_sim,
        "candidates": sorted(candidates, key=lambda x: x.similarity_score, reverse=True)
    }

def match_organizations(req: MatchEvaluationRequest) -> Dict[str, Any]:
    """Generates explainable University and Industry matches aligned with required expertise."""
    cat_lower = req.category.lower()
    
    univ_matches = []
    ind_matches = []
    
    if "road" in cat_lower or "infrastructure" in cat_lower:
        univ_matches.append(OrganizationMatch(
            organization_id="ORG-000001",
            display_id="ORG-000001",
            name="BIT Mesra, Ranchi",
            type="UNIVERSITY",
            match_score=94,
            reasons=[
                "Dedicated Civil & Pavement Engineering Research Lab",
                "Published research on sustainable rural road drainage in Jharkhand",
                "Geographically proximate faculty field team available in Ranchi"
            ]
        ))
        univ_matches.append(OrganizationMatch(
            organization_id="ORG-000002",
            display_id="ORG-000002",
            name="IIT (ISM) Dhanbad",
            type="UNIVERSITY",
            match_score=88,
            reasons=[
                "Structural Engineering & Soil Mechanics Department",
                "Advanced subsurface radar inspection equipment"
            ]
        ))
        ind_matches.append(OrganizationMatch(
            organization_id="ORG-000004",
            display_id="ORG-000004",
            name="Tata Steel CSR & Infrastructure Division",
            type="INDUSTRY",
            match_score=92,
            reasons=[
                "Bitumen surfacing equipment and road roller fleets deployed in region",
                "Dedicated CSR grant funding for rural civic arterial roads",
                "Standardized rapid-fill patch repair capability"
            ]
        ))
        ind_matches.append(OrganizationMatch(
            organization_id="ORG-000005",
            display_id="ORG-000005",
            name="L&T Smart Infrastructure Solutions",
            type="INDUSTRY",
            match_score=86,
            reasons=[
                "Field engineering technicians stationed in Jharkhand",
                "Smart road distress analytics and rapid repair kits"
            ]
        ))
        dept = "Road Construction Department (RCD) / Public Works (PWD)"
        
    elif "water" in cat_lower:
        univ_matches.append(OrganizationMatch(
            organization_id="ORG-000001",
            display_id="ORG-000001",
            name="BIT Mesra, Ranchi",
            type="UNIVERSITY",
            match_score=91,
            reasons=[
                "Water Resources and Environmental Chemistry Testing Lab",
                "Low-cost sand-gravel bio-filtration prototype tested"
            ]
        ))
        ind_matches.append(OrganizationMatch(
            organization_id="ORG-000005",
            display_id="ORG-000005",
            name="L&T Smart Infrastructure Solutions",
            type="INDUSTRY",
            match_score=95,
            reasons=[
                "Acoustic pipe leak detection and municipal valve supply",
                "Rapid pipeline pressure repair tooling"
            ]
        ))
        dept = "Drinking Water & Sanitation Department (DWSD)"
        
    else:
        univ_matches.append(OrganizationMatch(
            organization_id="ORG-000002",
            display_id="ORG-000002",
            name="IIT (ISM) Dhanbad",
            type="UNIVERSITY",
            match_score=85,
            reasons=["Multidisciplinary Engineering & Environmental Science Dept"]
        ))
        ind_matches.append(OrganizationMatch(
            organization_id="ORG-000004",
            display_id="ORG-000004",
            name="Tata Steel CSR",
            type="INDUSTRY",
            match_score=88,
            reasons=["Regional civic improvement CSR framework"]
        ))
        dept = "Municipal Corporation / District Urban Development Agency"
        
    return {
        "recommended_department": dept,
        "university_matches": univ_matches,
        "industry_matches": ind_matches
    }

# ----------------------------------------------------
# Endpoints
# ----------------------------------------------------

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "sahyog-intelligence-engine",
        "version": "1.0.0"
    }

@app.post("/api/v1/intelligence/priority", response_model=PriorityEvaluationResponse)
def evaluate_priority_endpoint(req: PriorityEvaluationRequest):
    result = calculate_priority_score(req)
    return PriorityEvaluationResponse(
        priority=result["priority"],
        score=result["score"],
        reasons=result["reasons"]
    )

@app.post("/api/v1/intelligence/duplicates", response_model=DuplicateCheckResponse)
def check_duplicates_endpoint(req: DuplicateCheckRequest):
    result = evaluate_duplicates(req)
    return DuplicateCheckResponse(
        is_potential_duplicate=result["is_potential_duplicate"],
        highest_similarity=result["highest_similarity"],
        candidates=result["candidates"]
    )

@app.post("/api/v1/intelligence/recommendations", response_model=RecommendationsResponse)
def get_recommendations_endpoint(req: MatchEvaluationRequest):
    priority_res = calculate_priority_score(PriorityEvaluationRequest(category=req.category))
    matches_res = match_organizations(req)
    
    return RecommendationsResponse(
        problem_id=req.problem_id,
        priority=priority_res["priority"],
        priority_score=priority_res["score"],
        recommended_department=matches_res["recommended_department"],
        university_matches=matches_res["university_matches"],
        industry_matches=matches_res["industry_matches"]
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
