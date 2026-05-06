"""Tool to search the codebase for patterns."""

import re
from pathlib import Path
from typing import Type

from crewai.tools import BaseTool
from pydantic import BaseModel, Field


class CodeSearchInput(BaseModel):
    """Input schema for CodeSearchTool."""

    pattern: str = Field(
        ...,
        description="Search pattern (regex or plain text). E.g. 'route\\.ts', 'model Booking', 'export async function'",
    )
    path: str = Field(
        default="src",
        description="Directory to search in (relative to project root). Default: src. Use 'prisma' for schema.",
    )


class CodeSearchTool(BaseTool):
    """Search the codebase for files or patterns."""

    name: str = "code_search"
    description: str = (
        "Search for a pattern in the codebase. Pass a pattern (regex or text) and optional path. "
        "Returns matching file paths and line numbers. Use to find API routes, models, components."
    )
    args_schema: Type[BaseModel] = CodeSearchInput

    def _run(self, pattern: str, path: str = "src") -> str:
        root = Path(__file__).resolve().parent.parent.parent
        search_dir = root / path.lstrip("/")

        if not search_dir.exists():
            return f"Error: Directory not found: {path}"

        try:
            regex = re.compile(pattern, re.IGNORECASE)
        except re.error:
            regex = re.compile(re.escape(pattern), re.IGNORECASE)

        results = []
        for ext in ("*.ts", "*.tsx", "*.prisma", "*.js", "*.jsx"):
            for file_path in search_dir.rglob(ext):
                if file_path.is_file():
                    try:
                        for i, line in enumerate(file_path.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
                            if regex.search(line):
                                rel = file_path.relative_to(root)
                                results.append(f"{rel}:{i}: {line.strip()[:100]}")
                    except Exception:
                        pass

        if not results:
            return f"No matches for '{pattern}' in {path}"
        return "\n".join(results[:100])
