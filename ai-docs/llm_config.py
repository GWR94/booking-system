"""
LLM configuration for CrewAI crews.
Supports OpenAI, Anthropic, Ollama, and LM Studio (local).
"""

import os

from crewai import LLM


def get_llm() -> LLM:
    """
    Return the appropriate LLM based on environment variables.
    Priority: LM_STUDIO_MODEL > OLLAMA_MODEL > OPENAI_API_KEY > ANTHROPIC_API_KEY
    """
    lm_studio_model = os.getenv("LM_STUDIO_MODEL")
    if lm_studio_model:
        base_url = os.getenv("LM_STUDIO_BASE_URL", "http://localhost:1234/v1")
        return LLM(
            model=lm_studio_model,
            base_url=base_url.rstrip("/"),
            temperature=0.2,
            api_key="lm-studio",  # LM Studio doesn't require auth; placeholder for compatibility
        )

    ollama_model = os.getenv("OLLAMA_MODEL")
    if ollama_model:
        base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        return LLM(
            model=f"ollama/{ollama_model}",
            base_url=base_url,
            temperature=0.2,
        )

    if os.getenv("OPENAI_API_KEY"):
        model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        if not model.startswith("openai/"):
            model = f"openai/{model}"
        return LLM(
            model=model,
            api_key=os.getenv("OPENAI_API_KEY"),
            temperature=0.2,
        )

    if os.getenv("ANTHROPIC_API_KEY"):
        model = os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet-20241022")
        if not model.startswith("anthropic/"):
            model = f"anthropic/{model}"
        return LLM(
            model=model,
            api_key=os.getenv("ANTHROPIC_API_KEY"),
            temperature=0.2,
        )

    raise ValueError(
        "No LLM configured. Set one of: LM_STUDIO_MODEL, OLLAMA_MODEL, OPENAI_API_KEY, or ANTHROPIC_API_KEY in .env"
    )
