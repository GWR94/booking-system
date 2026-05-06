"""Crew for generating tests."""

from crewai import Agent, Crew, Process, Task

from llm_config import get_llm
from project_context import PROJECT_CONTEXT
from tools import FileReaderTool, FileWriterTool, CodeSearchTool


def create_tests_crew(target: str | None = None):
    """Create the test generation crew. Pass target='src/app/api/bookings/route.ts' to focus on a file."""
    llm = get_llm()
    file_reader = FileReaderTool()
    file_writer = FileWriterTool()
    code_search = CodeSearchTool()

    code_analyst = Agent(
        role="Test Strategy Analyst",
        llm=llm,
        goal="Analyze code to identify test cases, edge cases, and mocking requirements",
        backstory="You understand Vitest, React Testing Library, and Next.js API testing. You identify what needs to be tested and how.",
        tools=[file_reader, code_search],
        verbose=True,
        allow_delegation=False,
    )

    test_writer = Agent(
        role="Test Writer",
        llm=llm,
        goal="Write comprehensive Vitest tests that follow project patterns",
        backstory="You write clean, maintainable tests using Vitest, describe/it blocks, and proper mocks. You match existing test style in the project.",
        tools=[file_reader, file_writer, code_search],
        verbose=True,
        allow_delegation=False,
    )

    target_hint = f"Focus on: {target}" if target else "Focus on API routes in src/app/api that don't have tests yet."

    analyze_task = Task(
        description=(
            PROJECT_CONTEXT
            + "\n\n"
            + f"Use code_search to find route.ts files and their corresponding *.test.ts files. "
            f"{target_hint} "
            "Read the target file(s) and any existing tests. Identify: (1) what's tested, (2) what's missing, (3) mocks needed (auth, Prisma, Stripe)."
        ),
        expected_output="Test plan with cases to add and mock setup needed",
        agent=code_analyst,
    )

    write_task = Task(
        description=(
            "Using the analyst's plan, write or extend tests. Use Vitest with describe/it/expect and realistic mocks. "
            "Match existing project patterns from neighboring API tests. "
            "Use file_writer to create or update the test file.\n\n"
            "Hard requirements (must all be true):\n"
            "1) No placeholder content (e.g. 'Test code here', TODO-only, empty test bodies).\n"
            "2) Every new/updated test file must contain at least 2 meaningful assertions using expect(...).\n"
            "3) Tests must invoke the route handler(s) under test (GET/POST/PATCH/DELETE).\n"
            "4) Include at least one unhappy-path test (validation/auth/error).\n"
            "5) Include required imports or rely on known Vitest globals consistently with nearby files.\n"
            "6) For API routes, import handlers directly from './route' (for example: import { POST } from './route'). "
            "Do NOT use generic router objects or fake imports like '../route'.\n"
            "7) Write tests next to the route file as route.test.ts using full project path "
            "(e.g. src/app/api/bookings/route.test.ts); do not write to top-level tests/ unless explicitly asked.\n"
            "8) If you cannot satisfy these requirements, return a failure explanation instead of writing a stub."
        ),
        expected_output=(
            "A runnable test file (or files) with concrete assertions, route invocation, "
            "and no placeholder text"
        ),
        agent=test_writer,
        context=[analyze_task],
    )

    return Crew(
        agents=[code_analyst, test_writer],
        tasks=[analyze_task, write_task],
        process=Process.sequential,
        verbose=True,
    )
