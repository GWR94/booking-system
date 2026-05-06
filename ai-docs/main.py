#!/usr/bin/env python3
"""
CrewAI CLI for booking-system: docs, tests, changelog, review.

Usage:
  python main.py docs
  python main.py changelog [--since v1.0.0]
  python main.py tests [--target src/app/api/bookings/route.ts]
  python main.py review [--files src/app/api/bookings/route.ts]
"""

import argparse
import hashlib
import os
import re
import subprocess
import sys
from pathlib import Path

# Load .env: project root first, then ai-docs (ai-docs overrides for LM_* vars)
from dotenv import load_dotenv
_ai_docs = Path(__file__).resolve().parent
_root = _ai_docs.parent
if (_root / ".env").exists():
    load_dotenv(_root / ".env")
if (_ai_docs / ".env").exists():
    load_dotenv(_ai_docs / ".env", override=True)


def _is_bad_output(content: str) -> bool:
    """Detect if output looks like tool call JSON instead of markdown."""
    stripped = content.strip()
    return stripped.startswith("{") and '"type"' in stripped and '"function"' in stripped


def _looks_like_placeholder_test(content: str) -> bool:
    lowered = content.lower()
    placeholder_markers = [
        "test code here",
        "todo",
        "placeholder",
        "implement test",
        "coming soon",
        "{ ... }",
        "router.handle(",
        "import { router } from '../route'",
    ]
    if any(marker in lowered for marker in placeholder_markers):
        return True

    # Basic quality gates: assertions and at least one test block.
    has_test_block = any(token in content for token in ("it(", "test("))
    has_expect = "expect(" in content
    return (not has_test_block) or (not has_expect)


def _target_to_test_path(target: str | None) -> Path | None:
    if not target:
        return None
    target_path = Path(target)
    if target_path.suffix != ".ts":
        return None
    if target_path.name == "route.ts":
        return target_path.with_name("route.test.ts")
    return target_path.with_name(f"{target_path.stem}.test.ts")


def _snapshot_api_tests() -> dict[str, str]:
    root = _root / "src" / "app" / "api"
    snapshot: dict[str, str] = {}
    if not root.exists():
        return snapshot
    for file_path in root.rglob("*.test.ts"):
        rel = file_path.relative_to(_root).as_posix()
        content = file_path.read_text(encoding="utf-8", errors="replace")
        snapshot[rel] = hashlib.sha256(content.encode("utf-8")).hexdigest()
    return snapshot


def _snapshot_api_tests_contents() -> dict[str, str]:
    root = _root / "src" / "app" / "api"
    snapshot: dict[str, str] = {}
    if not root.exists():
        return snapshot
    for file_path in root.rglob("*.test.ts"):
        rel = file_path.relative_to(_root).as_posix()
        snapshot[rel] = file_path.read_text(encoding="utf-8", errors="replace")
    return snapshot


def _restore_api_tests(before_contents: dict[str, str]) -> None:
    """
    Restore all src/app/api/**/*.test.ts back to `before_contents`.
    - Deletes newly-created test files
    - Rewrites modified existing ones
    """
    root = _root / "src" / "app" / "api"
    after_files = set()
    if root.exists():
        for fp in root.rglob("*.test.ts"):
            after_files.add(fp.relative_to(_root).as_posix())

    before_files = set(before_contents.keys())

    # Delete newly created test files
    for rel in sorted(after_files - before_files):
        p = _root / rel
        if p.exists():
            p.unlink()

    # Restore prior contents for all previously-existing test files
    for rel, content in before_contents.items():
        p = _root / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(content, encoding="utf-8")


def _diff_snapshots(before: dict[str, str], after: dict[str, str]) -> set[str]:
    changed: set[str] = set()
    all_keys = set(before.keys()) | set(after.keys())
    for key in all_keys:
        if before.get(key) != after.get(key):
            changed.add(key)
    return changed


def _validate_generated_test(test_path: Path) -> tuple[bool, str]:
    abs_path = _root / test_path
    if not abs_path.exists():
        return False, f"Generated test file not found: {test_path}"

    content = abs_path.read_text(encoding="utf-8", errors="replace")
    if _looks_like_placeholder_test(content):
        return False, f"Generated test appears to be a placeholder or has no assertions: {test_path}"

    normalized = str(test_path).replace("\\", "/")
    if normalized.startswith("tests/"):
        return False, (
            "Generated test path is invalid for this project. "
            "Write route tests next to routes (e.g. src/app/api/**/route.test.ts), not under tests/."
        )

    if "import { " not in content or " from './route'" not in content:
        return False, (
            f"Generated test does not import route handlers from './route' in {test_path}. "
            "Use direct handler imports (e.g., import { POST } from './route')."
        )

    if len(re.findall(r"\bexpect\(", content)) < 2:
        return False, f"Generated test has too few assertions (<2): {test_path}"

    vitest_bin = _root / "node_modules" / ".bin" / ("vitest.cmd" if os.name == "nt" else "vitest")
    if vitest_bin.exists():
        cmd = [str(vitest_bin), "run", str(test_path).replace("\\", "/")]
    else:
        # Fallback when local bin is unavailable
        cmd = ["npx.cmd" if os.name == "nt" else "npx", "vitest", "run", str(test_path).replace("\\", "/")]
    proc = subprocess.run(cmd, cwd=_root, capture_output=True, text=True)
    if proc.returncode != 0:
        stderr = (proc.stderr or "").strip()
        stdout = (proc.stdout or "").strip()
        details = stderr if stderr else stdout
        return False, f"Generated test did not pass: {test_path}\n{details}"

    return True, f"Validated generated test: {test_path}"


def run_docs():
    from crews import create_docs_crew
    os.chdir(_root)  # output_file writes relative to cwd; use project root for docs/
    crew = create_docs_crew()
    result = crew.kickoff()
    print("\n--- Docs crew complete ---")
    print(result)
    # Warn if any doc file contains tool-call JSON (common with local models)
    docs_dir = _root / "docs"
    if docs_dir.exists():
        for f in docs_dir.glob("*.md"):
            try:
                if _is_bad_output(f.read_text(encoding="utf-8")):
                    print(f"\nWarning: {f.name} may contain invalid output (tool call JSON). Try a larger model or OpenAI.", file=sys.stderr)
            except Exception:
                pass
    return 0


def run_changelog(since: str | None):
    from crews import create_changelog_crew
    crew = create_changelog_crew(since=since)
    result = crew.kickoff()
    print("\n--- Changelog crew complete ---")
    print(result)
    return 0


def run_tests(target: str | None):
    from crews import create_tests_crew
    os.chdir(_root)
    before = _snapshot_api_tests()
    before_contents = _snapshot_api_tests_contents()
    crew = create_tests_crew(target=target)
    result = crew.kickoff()
    print("\n--- Tests crew complete ---")
    print(result)
    test_path = _target_to_test_path(target)
    if test_path:
        after = _snapshot_api_tests()
        changed = _diff_snapshots(before, after)
        expected = test_path.as_posix()
        unexpected = sorted(p for p in changed if p != expected)
        if unexpected:
            print(
                "\nValidation failed: Unexpected API test files were modified.\n"
                f"Expected only: {expected}\n"
                f"Unexpected: {', '.join(unexpected)}",
                file=sys.stderr,
            )
            _restore_api_tests(before_contents)
            return 1

        ok, message = _validate_generated_test(test_path)
        if not ok:
            print(f"\nValidation failed: {message}", file=sys.stderr)
            _restore_api_tests(before_contents)
            return 1
        print(f"\n{message}")
    else:
        print(
            "\nNote: No --target provided; strict post-validation is skipped. "
            "Use --target to enforce non-placeholder and passing-test checks.",
            file=sys.stderr,
        )
    return 0


def run_review(files: list[str] | None):
    from crews import create_review_crew
    os.chdir(_root)  # output_file writes relative to cwd
    crew = create_review_crew(files=files)
    result = crew.kickoff()
    print("\n--- Review crew complete ---")
    print(result)
    return 0


def main():
    parser = argparse.ArgumentParser(description="CrewAI crews for booking-system")
    subparsers = parser.add_subparsers(dest="command", required=True)

    docs_parser = subparsers.add_parser("docs", help="Generate technical documentation (API, data model)")
    docs_parser.set_defaults(func=lambda _: run_docs())

    changelog_parser = subparsers.add_parser("changelog", help="Generate changelog from git history")
    changelog_parser.add_argument("--since", type=str, default=None, help="Scope commits (e.g. v1.0.0 or 2025-01-01)")
    changelog_parser.set_defaults(func=lambda ns: run_changelog(ns.since))

    tests_parser = subparsers.add_parser("tests", help="Generate tests for API routes")
    tests_parser.add_argument("--target", type=str, default=None, help="Target file (e.g. src/app/api/bookings/route.ts)")
    tests_parser.set_defaults(func=lambda ns: run_tests(ns.target))

    review_parser = subparsers.add_parser("review", help="Code review")
    review_parser.add_argument("--files", type=str, nargs="+", default=None, help="Files to review")
    review_parser.set_defaults(func=lambda ns: run_review(ns.files))

    args = parser.parse_args()
    has_llm = (
        os.getenv("LM_STUDIO_MODEL")
        or os.getenv("OLLAMA_MODEL")
        or os.getenv("OPENAI_API_KEY")
        or os.getenv("ANTHROPIC_API_KEY")
    )
    if not has_llm:
        print(
            "Error: Configure an LLM in .env: LM_STUDIO_MODEL, OLLAMA_MODEL, OPENAI_API_KEY, or ANTHROPIC_API_KEY",
            file=sys.stderr,
        )
        sys.exit(1)
    sys.exit(args.func(args))


if __name__ == "__main__":
    main()
