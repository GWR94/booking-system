"""Crew for generating changelog and release notes."""

import subprocess
from pathlib import Path

from crewai import Agent, Crew, Process, Task

from llm_config import get_llm
from project_context import PROJECT_CONTEXT
from tools import FileWriterTool


def _get_git_log(since: str | None = None) -> str:
    """Get git log output for changelog context."""
    root = Path(__file__).resolve().parent.parent.parent
    cmd = ["git", "log", "--oneline", "-50"]
    if since:
        cmd.extend([f"--since={since}", "--"])
    try:
        result = subprocess.run(cmd, cwd=root, capture_output=True, text=True, timeout=10)
        return result.stdout or "No commits found"
    except Exception as e:
        return f"Could not get git log: {e}"


def create_changelog_crew(since: str | None = None):
    """Create the changelog crew. Pass since='v1.0.0' or '2025-01-01' to scope commits."""
    llm = get_llm()
    file_writer = FileWriterTool()

    git_analyst = Agent(
        role="Git History Analyst",
        llm=llm,
        goal="Analyze git commits and changes to identify notable updates",
        backstory="You understand commit messages, conventional commits, and can identify features, fixes, and breaking changes.",
        tools=[],
        verbose=True,
        allow_delegation=False,
    )

    changelog_writer = Agent(
        role="Changelog Writer",
        llm=llm,
        goal="Write clear, user-friendly changelog entries",
        backstory="You write changelogs in Keep a Changelog format: Added, Changed, Fixed, Removed, Security. You group related changes and use plain language.",
        tools=[file_writer],
        verbose=True,
        allow_delegation=False,
    )

    git_log = _get_git_log(since)

    analyze_task = Task(
        description=(
            PROJECT_CONTEXT
            + "\n\n"
            + f"Analyze these recent git commits and categorize them:\n\n{git_log}\n\n"
            "Identify: new features, bug fixes, breaking changes, dependencies, refactors. "
            "Note the scope (API, UI, auth, payments, etc.)."
        ),
        expected_output="Categorized list of changes with scope and type",
        agent=git_analyst,
    )

    write_task = Task(
        description=(
            "Using the analyst's categorization, write a changelog entry. "
            "Format as markdown with ## [Unreleased] or ## [X.Y.Z] - YYYY-MM-DD. "
            "Use Added, Changed, Fixed sections. Use file_writer to append to CHANGELOG.md or create it."
        ),
        expected_output="Changelog entry written to CHANGELOG.md",
        agent=changelog_writer,
        context=[analyze_task],
    )

    return Crew(
        agents=[git_analyst, changelog_writer],
        tasks=[analyze_task, write_task],
        process=Process.sequential,
        verbose=True,
    )
