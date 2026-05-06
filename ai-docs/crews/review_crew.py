"""Crew for code review."""

from crewai import Agent, Crew, Process, Task

from llm_config import get_llm
from project_context import PROJECT_CONTEXT
from tools import FileReaderTool, CodeSearchTool


def create_review_crew(files: list[str] | None = None):
    """Create the code review crew. Pass files=['src/app/api/bookings/route.ts'] to review specific files."""
    llm = get_llm()
    file_reader = FileReaderTool()
    code_search = CodeSearchTool()

    code_analyst = Agent(
        role="Code Reviewer",
        llm=llm,
        goal="Review code for correctness, consistency, security, and best practices",
        backstory="You are an expert at reviewing TypeScript/Next.js code. You check for auth, error handling, input validation, Stripe usage, and consistency with project patterns.",
        tools=[file_reader, code_search],
        verbose=True,
        allow_delegation=False,
    )

    file_list = ", ".join(files) if files else "all route.ts files in src/app/api"
    file_instructions = (
        f"Review these specific files: {file_list}"
        if files
        else "Review ALL API routes in src/app/api. Use code_search to find every route.ts file, then file_reader to read each one. Do not skip any routes - include admin, user, bookings, slots, webhook, auth, etc."
    )

    review_task = Task(
        description=(
            PROJECT_CONTEXT
            + "\n\n"
            + f"{file_instructions} "
            "Check: (1) auth/session handling, (2) input validation, (3) error handling, (4) Stripe/webhook safety, "
            "(5) consistency with other routes. Provide a structured review with findings and suggestions. "
            "CRITICAL: Your final response must be ONLY the markdown document. Start with # heading. Never output JSON or tool call syntax."
        ),
        expected_output="Structured code review with findings, severity, and recommendations",
        agent=code_analyst,
        output_file="docs/code-review.md",
    )

    return Crew(
        agents=[code_analyst],
        tasks=[review_task],
        process=Process.sequential,
        verbose=True,
    )
