"""Quick smoke test for the LangGraph career workflow."""

from app.graph.graph import build_graph
from app.graph.state import CareerState


def main() -> None:
    # Build the compiled graph (sequential pipeline).
    graph = build_graph()

    # Minimal initial state. Node functions will enrich this in-place.
    initial_state: CareerState = {
        "user_profile": {"name": "Test User", "experience_years": 3},
        "skills": ["python", "fastapi"],
        "target_roles": ["Backend Engineer"],
        "skill_analysis": {},
        "market_analysis": {},
        "strategy_analysis": {},
        "roadmap": {},
    }

    # Invoke the graph to get the final state after all nodes run.
    final_state = graph.invoke(initial_state)

    # Expected: analysis fields filled with mock data and timestamps.
    # print(final_state)

    import json
    print(json.dumps(final_state, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
