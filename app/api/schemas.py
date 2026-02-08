"""Pydantic schemas for the Career Strategy Planner API."""

from typing import Dict, List

from pydantic import BaseModel, Field


class CareerPlanRequest(BaseModel):
    """Request payload for generating a career plan."""

    user_profile: Dict = Field(..., description="Raw user profile data.")
    skills: List[str] = Field(..., description="List of user skills.")
    target_roles: List[str] = Field(..., description="Target role titles.")


class CareerPlanResponse(BaseModel):
    """Response payload for the generated career plan."""

    skill_analysis: Dict = Field(..., description="Skill gap analysis output.")
    market_analysis: Dict = Field(..., description="Market intelligence output.")
    strategy_analysis: Dict = Field(..., description="Career strategy output.")
    roadmap: Dict = Field(..., description="Roadmap planning output.")
