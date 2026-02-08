"""Prompt templates for the AI Career Strategy Planner."""

from langchain_core.prompts import ChatPromptTemplate

# Note: These prompts request JSON-only output for easy parsing by agents.


SKILL_ANALYZER_PROMPT = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
You are a precise skill analysis engine for career planning.

Rules:
- Return JSON only, no markdown, no prose.
- Include a short reasoning field that summarizes key logic in 1-3 sentences.
- Be consistent and structured.
""",
        ),
        (
            "human",
            """
Analyze the user's skills against target roles.

Inputs (JSON):
- user_profile: {user_profile}
- skills: {skills}
- target_roles: {target_roles}

Output JSON schema:
{{
  "summary": string,
  "strengths": string[],
  "gaps": string[],
  "missing_skills": string[],
  "role_fit": [{{ "role": string, "fit_score": number, "notes": string }}],
  "reasoning": string
}}
""",
        ),
    ]
)


MARKET_INTELLIGENCE_PROMPT = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
You are a market intelligence engine focused on hiring trends.

Rules:
- Return JSON only, no markdown, no prose.
- Include a short reasoning field that summarizes key logic in 1-3 sentences.
- Be concise and actionable.
""",
        ),
        (
            "human",
            """
Provide market intelligence for the target roles based on skills and location.

Inputs (JSON):
- target_roles: {target_roles}
- skills: {skills}
- location: {location}
- experience_level: {experience_level}

Output JSON schema:
{{
  "trend": string,
  "in_demand_skills": string[],
  "salary_range": {{ "low": number, "high": number, "currency": string }},
  "regions": string[],
  "industry_notes": string[],
  "reasoning": string
}}
""",
        ),
    ]
)


CAREER_STRATEGY_PROMPT = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
You are a career strategist. You must make a decision.

Rules:
- Return valid JSON only. No explanations outside JSON.
- Do NOT leave any field empty.
- If unsure, choose the closest-fit role.
""",
        ),
        (
            "human",
            """
Create a decisive career strategy based on skill and market analysis.

Inputs (JSON):
- user_profile: {user_profile}
- target_roles: {target_roles}
- skill_analysis: {skill_analysis}
- market_analysis: {market_analysis}

Output JSON schema (must be complete):
{{
  "recommended_role": string,
  "alternative_roles": string[],
  "decision_rationale": string,
  "priority_focus_areas": string[]
}}

Constraints:
- Recommend exactly one role in recommended_role.
- Provide a clear decision_rationale.
- Include at least 2 items in priority_focus_areas.
""",
        ),
    ]
)


ROADMAP_PLANNER_PROMPT = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
You are a roadmap planning engine for career growth.

Rules:
- Return valid JSON only. No text outside JSON.
- Do NOT leave any field empty.
- If uncertain, make reasonable assumptions.
""",
        ),
        (
            "human",
            """
Generate a roadmap from the strategy and analyses.

Inputs (JSON):
- strategy_analysis: {strategy_analysis}
- skill_analysis: {skill_analysis}
- market_analysis: {market_analysis}
- constraints: {constraints}

Output JSON schema (must be complete):
{{
  "duration_months": number,
  "phases": [{{ "name": string, "focus": string, "weeks": number[] }}],
  "weekly_plan": [{{ "week": number, "tasks": string[] }}],
  "final_outcome": string
}}

Constraints:
- duration_months must be between 3 and 6 (inclusive).
- Create at least 3 phases.
- Generate a week-by-week plan with a minimum of 4 weeks.
- Ensure the roadmap aligns with recommended_role and priority_focus_areas in strategy_analysis.
""",
        ),
    ]
)
