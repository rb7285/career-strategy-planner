# AI Career Strategy Planner

## Project overview
AI Career Strategy Planner is a full-stack application that turns a user’s skills and goals into a structured, role-aligned career plan. It combines multi-step LLM reasoning (LangGraph) with a FastAPI backend and a Next.js frontend to deliver skill analysis, market insights, strategy recommendations, and a phased roadmap.

## Problem statement
Career planning is often fragmented across resumes, job listings, and vague advice. This project provides a structured workflow that analyzes skills, compares them to target roles, and generates an actionable roadmap in a consistent format that can be reused across agents and UIs.

## Architecture (FastAPI + LangGraph + Next.js)
- **FastAPI backend**: Hosts the `/career-plan` API and orchestrates the LangGraph workflow.
- **LangGraph**: Executes the sequential agent pipeline for skill, market, strategy, and roadmap analysis.
- **Next.js frontend**: Provides a responsive UI to collect user inputs and render results.

## Agent workflow explanation
The graph runs a sequential pipeline. Each node enriches shared state and passes it forward:
1. **Skill Analysis**: Extracts strengths, gaps, and role-fit signals.
2. **Market Intelligence**: Identifies in-demand and emerging skills, plus market gaps.
3. **Career Strategy**: Selects a best-fit role, alternatives, and priority focus areas.
4. **Roadmap Planning**: Produces a 3–6 month phased roadmap with weekly tasks.

All agent outputs are JSON-only for structured parsing and UI rendering.

## Tech stack
- **Backend**: FastAPI, LangGraph, LangChain, Pydantic
- **LLM**: Groq (via `langchain-groq`)
- **Frontend**: Next.js (App Router), Tailwind CSS, Framer Motion

## Setup instructions (backend + frontend)

### Backend
1. Create and activate a virtual environment.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file at the project root and add your key:
   ```bash
   GROQ_API_KEY=your_key_here
   ```
4. Run the API:
   ```bash
   uvicorn app.api.main:app --reload
   ```

### Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Set the API URL in `frontend/.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```

## API example

### Request
```bash
curl -X POST http://localhost:8000/career-plan \
  -H "Content-Type: application/json" \
  -d '{
    "user_profile": {"experience": "3 years backend"},
    "skills": ["python", "fastapi"],
    "target_roles": ["Backend Engineer"]
  }'
```

### Response (example)
```json
{
  "skill_analysis": {"summary": "..."},
  "market_analysis": {"market_summary": "..."},
  "strategy_analysis": {"recommended_role": "..."},
  "roadmap": {"duration_months": 4}
}
```

## Screenshots
- _Add screenshots of the UI here_

## Future improvements
- Add streaming responses for long-running agent steps.
- Add caching for repeated analyses.
- Add structured typing for analysis outputs using Pydantic models.
- Add user authentication and saved plans.
- Add evaluation harness for prompt and output quality.
