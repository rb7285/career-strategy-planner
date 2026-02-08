"""Market Intelligence agent for the AI Career Strategy Planner.

This module:
- Calls Groq LLM via get_llm()
- Uses the Market Intelligence prompt
- Parses and validates JSON-only output
"""

from __future__ import annotations

import json
from typing import Any, Dict, List, Optional

from app.llm.llm import get_llm
from app.llm.prompts import MARKET_INTELLIGENCE_PROMPT


def _extract_json(text: str) -> Optional[Dict[str, Any]]:
    """Extract the first JSON object from text.

    Returns None if parsing fails.
    """

    if not text:
        return None

    text = text.strip()
    if text.startswith("{") and text.endswith("}"):
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass

    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return None

    candidate = text[start : end + 1]
    try:
        return json.loads(candidate)
    except json.JSONDecodeError:
        return None


def _normalize_list(value: Any) -> List[Any]:
    """Ensure a list output, falling back to an empty list."""

    if isinstance(value, list):
        return value
    if value is None:
        return []
    return [value]


def analyze_market(
    target_roles: List[str],
    skills: List[str],
    location: Optional[str] = None,
    experience_level: Optional[str] = None,
) -> Dict[str, Any]:
    """Run market intelligence and return a clean structured dict.

    Returns a dict with keys: in_demand_skills, emerging_skills, skill_gaps, market_summary.
    If the model response is malformed, returns safe empty defaults.
    """

    llm = get_llm()

    prompt_messages = MARKET_INTELLIGENCE_PROMPT.format_messages(
        target_roles=target_roles,
        skills=skills,
        location=location or "",
        experience_level=experience_level or "",
    )

    response = llm.invoke(prompt_messages)
    raw_text = getattr(response, "content", "") or str(response)

    data = _extract_json(raw_text)
    if not isinstance(data, dict):
        return {
            "in_demand_skills": [],
            "emerging_skills": [],
            "skill_gaps": [],
            "market_summary": "Model returned invalid JSON.",
        }

    in_demand_skills = _normalize_list(data.get("in_demand_skills"))
    emerging_skills = _normalize_list(data.get("emerging_skills"))
    skill_gaps = _normalize_list(data.get("skill_gaps"))
    market_summary = (
        data.get("market_summary") if isinstance(data.get("market_summary"), str) else ""
    )

    return {
        "in_demand_skills": in_demand_skills,
        "emerging_skills": emerging_skills,
        "skill_gaps": skill_gaps,
        "market_summary": market_summary,
    }
