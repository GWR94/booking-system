# CrewAI Crews for booking-system

AI-powered documentation, tests, changelog, and code review using [CrewAI](https://crewai.com).

**Project context:** Edit `project_context.py` to customize the system prompt (domain, tech stack, patterns) that agents receive. This improves output relevance.

## Setup

1. **Create virtualenv and install dependencies**

   ```bash
   cd ai-docs
   python -m venv .venv
   .venv/Scripts/activate   # Windows
   # source .venv/bin/activate  # macOS/Linux
   pip install -r requirements.txt
   ```

2. **Configure LLM** (choose one)

   Copy `.env.example` to `.env` and set one of:

   - **OpenAI**: `OPENAI_API_KEY=sk-...`
   - **Anthropic**: `ANTHROPIC_API_KEY=sk-ant-...`
   - **LM Studio (local)**: `LM_STUDIO_MODEL=<model-name>` — no API key. Load a model in LM Studio, start the server (Developer tab), then set the model name in `.env`.
   - **Ollama (local)**: `OLLAMA_MODEL=llama3` — no API key. Install [Ollama](https://ollama.ai), run `ollama pull llama3`.

## Commands

| Command | Description |
|---------|-------------|
| `python main.py docs` | Generate `docs/api.md`, `docs/data-model.md`, `docs/README.md` |
| `python main.py changelog [--since v1.0.0]` | Generate changelog from git history |
| `python main.py tests [--target path/to/route.ts]` | Generate Vitest tests for API routes (strict validation when target is provided) |
| `python main.py review [--files path/to/file.ts]` | Code review for auth, validation, patterns |

## From project root (npm)

```bash
npm run ai:docs
npm run ai:changelog
npm run ai:tests
npm run ai:review
```

> **Note:** npm scripts use `.venv/Scripts/python` (Windows). On macOS/Linux, edit `package.json` to use `.venv/bin/python`.

## LM Studio (local) setup

1. Open [LM Studio](https://lmstudio.ai), load a model, and start the server (Developer tab → "Start server")
2. Note the model name shown in LM Studio (e.g. `llama-3.1-8b-instruct`)
3. In `ai-docs/.env` add:
   ```
   LM_STUDIO_MODEL=llama-3.1-8b-instruct
   LM_STUDIO_BASE_URL=http://localhost:1234/v1
   ```
4. Run any crew: `python main.py docs`

No API key required. LM Studio exposes an OpenAI-compatible API on port 1234.

## Ollama (local) setup

1. Install [Ollama](https://ollama.ai) and start it
2. Pull a model: `ollama pull llama3` (or `llama3.1`, `mistral`, etc.)
3. In `ai-docs/.env` add:
   ```
   OLLAMA_MODEL=llama3
   OLLAMA_BASE_URL=http://localhost:11434
   ```
4. Run any crew: `python main.py docs`

No API key required.

## Output

- **docs**: `docs/api.md`, `docs/data-model.md`, `docs/features.md`, `docs/server.md`, `docs/architecture.md`, `docs/README.md`
- **review**: `docs/code-review.md`
- **changelog**: `CHANGELOG.md` (created or appended)
- **tests**: Creates or updates `*.test.ts` next to target files

### Test crew quality gate

- When running `python main.py tests --target <route.ts>`, the CLI now enforces:
  - no placeholder/stub test content
  - at least two `expect(...)` assertions
  - the generated `*.test.ts` passes `vitest`
- If validation fails, the command exits non-zero so bad output is not silently accepted.
