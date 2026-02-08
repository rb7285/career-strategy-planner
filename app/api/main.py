"""FastAPI application entrypoint for the AI Career Strategy Planner."""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.api.schemas import CareerPlanRequest, CareerPlanResponse
from app.graph.graph import build_graph

# Create the FastAPI app instance.
# Additional routers will be attached here as the API grows.
app = FastAPI(title="AI Career Strategy Planner")

# CORS is required so the Next.js frontend (different origin) can call the API
# without the browser blocking cross-origin requests.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check() -> dict:
    """Basic health check endpoint."""

    # No business logic here; return a simple status payload.
    return {"status": "ok"}


@app.post("/career-plan", response_model=CareerPlanResponse)
def create_career_plan(payload: CareerPlanRequest) -> CareerPlanResponse:
    """Generate a career plan using the LangGraph workflow."""

    try:
        # Build the graph (sequential pipeline of analysis nodes).
        graph = build_graph()

        # Prepare the initial state expected by the graph.
        initial_state = {
            "user_profile": payload.user_profile,
            "skills": payload.skills,
            "target_roles": payload.target_roles,
            "skill_analysis": {},
            "market_analysis": {},
            "strategy_analysis": {},
            "roadmap": {},
        }

        # Invoke the graph and get the final state.
        final_state = graph.invoke(initial_state)

        # Return only the response fields defined by the API schema.
        return CareerPlanResponse(
            skill_analysis=final_state.get("skill_analysis", {}),
            market_analysis=final_state.get("market_analysis", {}),
            strategy_analysis=final_state.get("strategy_analysis", {}),
            roadmap=final_state.get("roadmap", {}),
        )
    except Exception as exc:  # pragma: no cover - runtime errors only
        # Gracefully map internal errors to an HTTP 500 response.
        raise HTTPException(status_code=500, detail=str(exc)) from exc
