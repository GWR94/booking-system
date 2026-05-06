"""Tool to read source files from the project."""

import os
from pathlib import Path
from typing import Type

from crewai.tools import BaseTool
from pydantic import BaseModel, Field


class FileReaderInput(BaseModel):
    """Input schema for FileReaderTool."""

    file_path: str = Field(
        ...,
        description="Full path from project root. Examples: 'src/app/api/bookings/route.ts', 'prisma/schema.prisma', 'docs/README.md'. Use docs/README.md not README.md for documentation.",
    )


class FileReaderTool(BaseTool):
    """Read contents of source files from the project. Use for TypeScript, TSX, Prisma, and config files."""

    name: str = "file_reader"
    description: str = (
        "Read a file. Pass the full path from project root. "
        "Examples: src/app/api/bookings/route.ts, prisma/schema.prisma, docs/api.md, docs/README.md. "
        "For documentation files use docs/ prefix (docs/README.md not README.md)."
    )
    args_schema: Type[BaseModel] = FileReaderInput

    def _run(self, file_path: str) -> str:
        root = Path(__file__).resolve().parent.parent.parent
        full_path = root / file_path.lstrip("/")

        if not full_path.exists():
            return f"Error: File not found: {file_path}"

        if not full_path.is_file():
            return f"Error: Path is not a file: {file_path}"

        try:
            content = full_path.read_text(encoding="utf-8", errors="replace")
            return f"--- {file_path} ---\n{content}"
        except Exception as e:
            return f"Error reading {file_path}: {e}"
