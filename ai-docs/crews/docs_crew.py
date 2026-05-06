"""Crew for generating technical documentation."""

from crewai import Agent, Crew, Process, Task

from llm_config import get_llm
from project_context import PROJECT_CONTEXT
from tools import FileReaderTool, CodeSearchTool


def create_docs_crew():
    """Create the technical documentation crew."""
    llm = get_llm()
    file_reader = FileReaderTool()
    code_search = CodeSearchTool()

    code_analyst = Agent(
        role="Senior Code Analyst",
        llm=llm,
        goal="Analyze codebase structure, API routes, and data models to extract accurate technical information",
        backstory="You are an expert at reading TypeScript, Next.js, and Prisma code. You understand API routes, database schemas, and application architecture.",
        tools=[file_reader, code_search],
        verbose=True,
        allow_delegation=False,
    )

    api_doc_writer = Agent(
        role="API Documentation Writer",
        llm=llm,
        goal="Write clear, accurate API documentation from code analysis",
        backstory="You create developer-friendly API docs with endpoints, request/response shapes, auth requirements, and usage examples.",
        tools=[file_reader, code_search],
        verbose=True,
        allow_delegation=False,
    )

    schema_doc_writer = Agent(
        role="Database Schema Documentation Writer",
        llm=llm,
        goal="Document Prisma models, relations, and data structures",
        backstory="You translate Prisma schemas into clear data model documentation with entities, relationships, and field descriptions.",
        tools=[file_reader, code_search],
        verbose=True,
        allow_delegation=False,
    )

    features_doc_writer = Agent(
        role="Features Documentation Writer",
        llm=llm,
        goal="Document feature modules and their components",
        backstory="You document React feature modules: booking, checkout, admin, profile, membership, auth, landing. You describe each feature's purpose, main components, and user flows.",
        tools=[file_reader, code_search],
        verbose=True,
        allow_delegation=False,
    )

    server_doc_writer = Agent(
        role="Server Modules Documentation Writer",
        llm=llm,
        goal="Document server-side modules and services",
        backstory="You document server modules: auth, bookings, admin (users, slots, dashboard), membership. You describe services, their responsibilities, and how they're used by API routes.",
        tools=[file_reader, code_search],
        verbose=True,
        allow_delegation=False,
    )

    editor = Agent(
        role="Technical Documentation Editor",
        llm=llm,
        goal="Review and polish documentation for consistency and clarity",
        backstory="You ensure docs are well-structured, consistent in style, and free of redundancy. You write markdown directly from context - never output JSON or tool calls.",
        tools=[],  # Editor uses only task context; no tools to avoid JSON output
        verbose=True,
        allow_delegation=False,
    )

    analyze_task = Task(
        description=(
            PROJECT_CONTEXT
            + "\n\n"
            + "Use code_search and file_reader to analyze the full codebase. Cover: "
            "(1) API routes in src/app/api, (2) Prisma schema, (3) features in src/features and pages in src/app (page.tsx, not index.ts), "
            "(4) server modules in src/server (auth, modules/admin, modules/bookings, modules/membership). "
            "Summarize structure, key files, and how they connect."
        ),
        expected_output="A structured summary of the codebase for documentation purposes",
        agent=code_analyst,
    )

    api_doc_task = Task(
        description=(
            "Using the analyst's summary and file_reader/code_search, create the API documentation. "
            "Document each API route: path, method, purpose, auth requirements, request/response. "
            "CRITICAL: Your final response must be ONLY the markdown document. Start with # heading. Never output JSON, curly braces, or tool call syntax."
        ),
        expected_output="Complete markdown document with all API endpoints documented",
        agent=api_doc_writer,
        context=[analyze_task],
        output_file="docs/api.md",
    )

    schema_doc_task = Task(
        description=(
            "Using the analyst's summary and prisma/schema.prisma, create the data model documentation. "
            "Document each model, fields, relations, enums. "
            "CRITICAL: Your final response must be ONLY the markdown document. Start with # heading. Never output JSON or tool call syntax."
        ),
        expected_output="Complete markdown document with Prisma schema documentation",
        agent=schema_doc_writer,
        context=[analyze_task],
        output_file="docs/data-model.md",
    )

    features_doc_task = Task(
        description=(
            "Using the analyst's summary and file_reader/code_search, create the features documentation. "
            "Document each feature in src/features and pages in src/app (page.tsx). Features: booking, checkout, admin, profile, membership, auth, landing, about, contact, help-center, legal. "
            "For each: purpose, main components, key flows. "
            "CRITICAL: Your final response must be ONLY the markdown document. Start with # heading. Never output JSON or tool call syntax."
        ),
        expected_output="Complete markdown document with feature module documentation",
        agent=features_doc_writer,
        context=[analyze_task],
        output_file="docs/features.md",
    )

    server_doc_task = Task(
        description=(
            "Using the analyst's summary and file_reader/code_search, create the server documentation. "
            "Document server modules: auth, db client, lib (stripe, zod, recaptcha), modules/admin (users, slots, bookings, dashboard), modules/bookings, modules/membership. "
            "Describe each module's role and how API routes use them. "
            "CRITICAL: Your final response must be ONLY the markdown document. Start with # heading. Never output JSON or tool call syntax."
        ),
        expected_output="Complete markdown document with server module documentation",
        agent=server_doc_writer,
        context=[analyze_task],
        output_file="docs/server.md",
    )

    architecture_doc_task = Task(
        description=(
            "Using the analyst's summary and all other docs in context, create the architecture overview. "
            "High-level: app structure, request flow (user -> API -> server -> DB), key integrations (Stripe, NextAuth), and how features/API/server connect. "
            "CRITICAL: Your final response must be ONLY the markdown document. Start with # heading. Never output JSON or tool call syntax. Use the context - do not call tools."
        ),
        expected_output="Complete markdown document with high-level architecture",
        agent=editor,
        context=[analyze_task, api_doc_task, schema_doc_task, features_doc_task, server_doc_task],
        output_file="docs/architecture.md",
    )

    edit_task = Task(
        description=(
            "Review the context from api_doc_task, schema_doc_task, features_doc_task, server_doc_task, architecture_doc_task. "
            "Create docs/README.md that links to all five docs (api.md, data-model.md, features.md, server.md, architecture.md) and explains the structure. "
            "CRITICAL: Your final response must be ONLY the markdown document. Start with # heading. Never output JSON or tool call syntax."
        ),
        expected_output="Complete docs/README.md with links to all documentation",
        agent=editor,
        context=[api_doc_task, schema_doc_task, features_doc_task, server_doc_task, architecture_doc_task],
        output_file="docs/README.md",
    )

    return Crew(
        agents=[code_analyst, api_doc_writer, schema_doc_writer, features_doc_writer, server_doc_writer, editor],
        tasks=[analyze_task, api_doc_task, schema_doc_task, features_doc_task, server_doc_task, architecture_doc_task, edit_task],
        process=Process.sequential,
        verbose=True,
    )
