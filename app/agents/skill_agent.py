"""Skill Analyzer agent for the AI Career Strategy Planner.

This module:
- Calls Groq LLM via get_llm()
- Uses the Skill Analyzer prompt
- Parses and validates JSON-only output
"""

from __future__ import annotations

import json
from typing import Any, Dict, List, Optional

from app.llm.llm import get_llm
from app.llm.prompts import SKILL_ANALYZER_PROMPT


def _extract_json(text: str) -> Optional[Dict[str, Any]]:
    """Extract the first JSON object from text.

    Returns None if parsing fails.
    """

    if not text:
        return None

    # Fast path: raw JSON object.
    text = text.strip()
    if text.startswith("{") and text.endswith("}"):
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass

    # Fallback: find first {...} block.
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


def analyze_skills(
    resume_text: str,
    skills: List[str],
    target_roles: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """Run skill analysis using Groq and return a clean structured dict.

    Returns a dict with keys: summary, strengths, gaps, role_fit.
    If the model response is malformed, returns safe empty defaults.
    """

    llm = get_llm()

    prompt_messages = SKILL_ANALYZER_PROMPT.format_messages(
        user_profile={"resume_text": resume_text},
        skills=skills,
        target_roles=target_roles or [],
    )

    response = llm.invoke(prompt_messages)
    raw_text = getattr(response, "content", "") or str(response)

    data = _extract_json(raw_text)
    if not isinstance(data, dict):
        return {
            "summary": "Model returned invalid JSON.",
            "strengths": [],
            "gaps": [],
            "role_fit": [],
        }

    # Validate and normalize expected fields.
    summary = data.get("summary") if isinstance(data.get("summary"), str) else ""
    strengths = _normalize_list(data.get("strengths"))
    gaps = _normalize_list(data.get("gaps"))
    role_fit = _normalize_list(data.get("role_fit"))

    return {
        "summary": summary,
        "strengths": strengths,
        "gaps": gaps,
        "role_fit": role_fit,
    }
