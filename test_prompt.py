"""Quick test for Groq LLM + Skill Analyzer prompt.

Expected output:
- Raw LLM response text containing JSON only (no markdown).
- The JSON should include a reasoning field and skill gap info.
"""

from app.llm.llm import get_llm
from app.llm.prompts import SKILL_ANALYZER_PROMPT


def main() -> None:
    # Load configured Groq LLM (requires GROQ_API_KEY in env/.env).
    llm = get_llm()

    # Mock inputs for the skill analyzer.
    resume_text = (
        "Backend engineer with 3 years of Python and FastAPI experience, "
        "built REST APIs, worked with PostgreSQL, and deployed on AWS."
    )
    skills = ["python", "fastapi", "postgresql", "aws"]
    target_roles = ["Backend Engineer", "API Engineer"]

    # Build the prompt with structured variables.
    prompt = SKILL_ANALYZER_PROMPT.format_messages(
        user_profile={"resume_text": resume_text},
        skills=skills,
        target_roles=target_roles,
    )

    # Invoke the LLM with the prompt and print the raw response.
    response = llm.invoke(prompt)
    print(response)


if __name__ == "__main__":
    main()
