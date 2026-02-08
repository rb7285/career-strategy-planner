"""Typed state for LangGraph workflows."""

from typing import List, TypedDict, Dict, Any


class CareerState(TypedDict):
    """Shared state for the career strategy graph."""

    # Inputs
    user_profile: Dict[str, Any]
    skills: List[str]
    target_roles: List[str]

    # Outputs (semantic, not function names)
    skill_analysis: Dict[str, Any]
    market_analysis: Dict[str, Any]
    strategy_analysis: Dict[str, Any]
    roadmap: Dict[str, Any]
