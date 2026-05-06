"""Tool to write content to files in the project."""

from pathlib import Path
from typing import Type

from crewai.tools import BaseTool
from pydantic import BaseModel, Field


class FileWriterInput(BaseModel):
    """Input schema for FileWriterTool."""

    file_path: str = Field(
        default="",
        description="Relative path from project root. Example: 'docs/api.md'",
    )
    content: str = Field(
        default="",
        description="The full file content as a string (markdown, code, or text).",
    )


class FileWriterTool(BaseTool):
    """Write content to a file. You MUST provide both file_path and content. Example: file_writer(file_path='docs/api.md', content='# API Documentation\\n\\n...')"""

    name: str = "file_writer"
    description: str = (
        "Write content to a file. REQUIRED: file_path (e.g. 'docs/api.md') and content (the full text). "
        "Always pass both arguments. Creates parent directories if needed."
    )
    args_schema: Type[BaseModel] = FileWriterInput

    def _run(self, file_path: str, content: str) -> str:
        normalized_path = (file_path or "").strip().replace("\\", "/")
        normalized_content = content if content is not None else ""

        if not normalized_path:
            return (
                "Error: file_path is required. "
                "Example: file_writer(file_path='src/app/api/bookings/route.test.ts', content='...')"
            )

        if not normalized_content.strip():
            return (
                "Error: content is required and cannot be empty/whitespace. "
                "Provide complete file contents."
            )

        # Normalize common model mistakes and prevent path traversal.
        while normalized_path.startswith("./"):
            normalized_path = normalized_path[2:]
        if normalized_path.startswith("/"):
            normalized_path = normalized_path[1:]
        if ".." in Path(normalized_path).parts:
            return "Error: file_path cannot contain '..' path traversal."

        # For this repo, API route unit tests should only be written next to routes
        # under `src/app/api/**/route.test.ts`. Block any other location.
        if normalized_path.endswith("route.test.ts") and not normalized_path.startswith(
            "src/app/api/"
        ):
            return (
                "Error: API route tests must be written next to routes under "
                "'src/app/api/**/route.test.ts'. "
                f"Received: '{file_path}'"
            )

        root = Path(__file__).resolve().parent.parent.parent
        full_path = root / normalized_path.lstrip("/")

        try:
            full_path.parent.mkdir(parents=True, exist_ok=True)
            full_path.write_text(normalized_content, encoding="utf-8")
            return f"Successfully wrote {len(normalized_content)} characters to {normalized_path}"
        except Exception as e:
            return f"Error writing to {normalized_path}: {e}"
