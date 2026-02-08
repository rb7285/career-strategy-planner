"""Roadmap Planning agent for the AI Career Strategy Planner.

This module:
- Calls Groq LLM via get_llm()
- Uses the Roadmap Planner prompt
- Parses and validates JSON-only output
"""

from __future__ import annotations

import json
from typing import Any, Dict, List, Optional

from app.llm.llm import get_llm
from app.llm.prompts import ROADMAP_PLANNER_PROMPT


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


def analyze_roadmap(
    strategy_analysis: Dict[str, Any],
    skill_analysis: Dict[str, Any],
    target_roles: List[str],
) -> Dict[str, Any]:
    """Generate a career roadmap and return a clean structured dict.

    Returns a dict with keys: duration_months, phases, weekly_plan, final_outcome.
    If the model response is malformed, returns safe empty defaults.
    """

    llm = get_llm()

    prompt_messages = ROADMAP_PLANNER_PROMPT.format_messages(
        strategy_analysis=strategy_analysis,
        skill_analysis=skill_analysis,
        market_analysis={},
        constraints={
            "target_roles": target_roles,
            "duration_months": "3-6",
        },
    )

    response = llm.invoke(prompt_messages)
    raw_text = getattr(response, "content", "") or str(response)

    data = _extract_json(raw_text)
    if not isinstance(data, dict):
        return {
            "duration_months": "",
            "phases": [],
            "weekly_plan": [],
            "final_outcome": "Model returned invalid JSON.",
        }

    duration_months = (
        data.get("duration_months") if isinstance(data.get("duration_months"), str) else ""
    )
    phases = _normalize_list(data.get("phases"))
    weekly_plan = _normalize_list(data.get("weekly_plan"))
    final_outcome = data.get("final_outcome") if isinstance(data.get("final_outcome"), str) else ""

    return {
        "duration_months": duration_months,
        "phases": phases,
        "weekly_plan": weekly_plan,
        "final_outcome": final_outcome,
    }
