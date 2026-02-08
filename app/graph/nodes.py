"""Placeholder node implementations for the career strategy graph."""

from datetime import datetime

from app.agents.market_agent import analyze_market
from app.agents.roadmap_agent import analyze_roadmap
from app.agents.skill_agent import analyze_skills
from app.agents.strategy_agent import analyze_strategy
from app.graph.state import CareerState


def skill_node(state: CareerState) -> CareerState:
    """Skill analysis node.

    Pulls inputs from the shared state and stores structured output back.
    """

    # Read inputs from the state (resume text is expected in user_profile).
    user_profile = state.get("user_profile", {}) or {}
    resume_text = user_profile.get("resume_text", "")
    skills = state.get("skills", []) or []
    target_roles = state.get("target_roles", []) or []

    # Run the Skill Analyzer agent and store the results in state.
    state["skill_analysis"] = analyze_skills(
        resume_text=resume_text,
        skills=skills,
        target_roles=target_roles,
    )
    # Keep a timestamp to track when this analysis was generated.
    state["skill_analysis"]["generated_at"] = datetime.utcnow().isoformat()
    return state


def market_node(state: CareerState) -> CareerState:
    """Market intelligence node using Groq."""

    target_roles = state.get("target_roles", []) or []
    skills = state.get("skills", []) or []

    state["market_analysis"] = analyze_market(
        target_roles=target_roles,
        skills=skills,
    )
    state["market_analysis"]["generated_at"] = datetime.utcnow().isoformat()

    return state

def strategy_node(state: CareerState) -> CareerState:
    """Mock strategy analysis node.

    Adds a lightweight strategy plan based on prior analyses.
    """

    # Read inputs from state produced by previous nodes.
    skill_analysis = state.get("skill_analysis", {}) or {}
    market_analysis = state.get("market_analysis", {}) or {}
    target_roles = state.get("target_roles", []) or []

    # Call the Career Strategy agent and store its structured output.
    state["strategy_analysis"] = analyze_strategy(
        skill_analysis=skill_analysis,
        market_analysis=market_analysis,
        target_roles=target_roles,
    )
    # Track when the strategy analysis was generated.
    state["strategy_analysis"]["generated_at"] = datetime.utcnow().isoformat()
    return state


def roadmap_node(state: CareerState) -> CareerState:
    """Mock roadmap node.

    Adds a stub timeline with milestones.
    """

    # Read inputs from state produced by previous nodes.
    strategy_analysis = state.get("strategy_analysis", {}) or {}
    skill_analysis = state.get("skill_analysis", {}) or {}
    target_roles = state.get("target_roles", []) or []

    # Call the Roadmap Planning agent and store its structured output.
    state["roadmap"] = analyze_roadmap(
        strategy_analysis=strategy_analysis,
        skill_analysis=skill_analysis,
        target_roles=target_roles,
    )
    # Track when the roadmap was generated.
    state["roadmap"]["generated_at"] = datetime.utcnow().isoformat()
    return state
