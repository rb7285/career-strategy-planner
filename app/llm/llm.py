"""Reusable Groq LLM loader for LangGraph workflows.

Usage:
    from app.llm.llm import get_llm

    llm = get_llm()  # uses default model
    llm = get_llm(model_name="llama-3.1-8b-instant")
"""

import os
from typing import Optional

from dotenv import load_dotenv
from langchain_groq import ChatGroq


def get_llm(model_name: Optional[str] = None) -> ChatGroq:
    """Create a configured ChatGroq instance.

    Loads GROQ_API_KEY from the environment (supports .env via python-dotenv).
    The model can be overridden via the model_name argument.
    """

    # Load environment variables from a local .env file if present.
    load_dotenv()

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY is not set in the environment.")

    return ChatGroq(
        api_key=api_key,
        # Default updated per Groq deprecations.
        model=model_name or "llama-3.3-70b-versatile",
    )
