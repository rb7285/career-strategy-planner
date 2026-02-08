"""LangGraph definition for the career strategy workflow."""

from langgraph.graph import StateGraph

from app.graph.nodes import (
    market_node,
    roadmap_node,
    skill_node,
    strategy_node,
)
from app.graph.state import CareerState


def build_graph():
    """Build and compile a sequential graph for career strategy analysis."""

    graph = StateGraph(CareerState)

    # IMPORTANT: Node IDs must match the semantic state keys.
    # If IDs mismatch, downstream steps won't receive the expected state fields.
    graph.add_node("skill_analysis", skill_node)
    graph.add_node("market_analysis", market_node)
    graph.add_node("strategy_analysis", strategy_node)
    graph.add_node("roadmap", roadmap_node)

    # Sequential execution order.
    graph.set_entry_point("skill_analysis")
    graph.add_edge("skill_analysis", "market_analysis")
    graph.add_edge("market_analysis", "strategy_analysis")
    graph.add_edge("strategy_analysis", "roadmap")
    graph.set_finish_point("roadmap")

    return graph.compile()
