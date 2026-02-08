"""Career Strategy agent for the AI Career Strategy Planner.

This module:
- Calls Groq LLM via get_llm()
- Uses the Career Strategy prompt
- Parses and validates JSON-only output
"""

from __future__ import annotations

import json
from typing import Any, Dict, List, Optional

from app.llm.llm import get_llm
from app.llm.prompts import CAREER_STRATEGY_PROMPT


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


def analyze_strategy(
    skill_analysis: Dict[str, Any],
    market_analysis: Dict[str, Any],
    target_roles: List[str],
) -> Dict[str, Any]:
    """Run career strategy analysis and return a clean structured dict.

    Returns a dict with keys: recommended_role, alternative_roles,
    decision_rationale, priority_focus_areas.
    If the model response is malformed, returns safe empty defaults.
    """

    llm = get_llm()

    prompt_messages = CAREER_STRATEGY_PROMPT.format_messages(
        user_profile={},
        target_roles=target_roles,
        skill_analysis=skill_analysis,
        market_analysis=market_analysis,
    )

    response = llm.invoke(prompt_messages)
    raw_text = getattr(response, "content", "") or str(response)

    data = _extract_json(raw_text)
    if not isinstance(data, dict):
        return {
            "recommended_role": "",
            "alternative_roles": [],
            "decision_rationale": "Model returned invalid JSON.",
            "priority_focus_areas": [],
        }

    recommended_role = (
        data.get("recommended_role") if isinstance(data.get("recommended_role"), str) else ""
    )
    alternative_roles = _normalize_list(data.get("alternative_roles"))
    decision_rationale = (
        data.get("decision_rationale")
        if isinstance(data.get("decision_rationale"), str)
        else ""
    )
    priority_focus_areas = _normalize_list(data.get("priority_focus_areas"))

    return {
        "recommended_role": recommended_role,
        "alternative_roles": alternative_roles,
        "decision_rationale": decision_rationale,
        "priority_focus_areas": priority_focus_areas,
    }
