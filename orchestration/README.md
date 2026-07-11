# Async multi-agent orchestration

A faithful implementation of Anthropic's cookbook pattern
[patterns-agents-async-multi-agent-orchestration](https://platform.claude.com/cookbook/patterns-agents-async-multi-agent-orchestration).

A **message hub** delivers peer messages *inline with tool results*, so agents
coordinate without polling: whenever an agent calls any tool, its accumulated
inbox rides along on the tool result and it reads its messages on the next turn.

## What's here

| File | Purpose |
|---|---|
| `hub.py` | `Hub` — inboxes, per-agent `asyncio.Event`s, status, `post` / `drain` / `render` |
| `agent.py` | `run_agent()` unified loop + the base `send_message` / `wait_for_message` tools |
| `patterns.py` | `run_team()` (fixed team) and `run_spawn_lead()` (dynamic subagents) |
| `models.py` | per-role model mapping |
| `demo.py` | runnable entry point for both patterns |

## Per-role models (all modes)

Models are assigned by role and can be overridden per call or via env vars:

| Role | Default model | Env override |
|---|---|---|
| `lead` (coordinator) | `claude-opus-4-8` | `ORCH_LEAD_MODEL` |
| `helper` (workers) | `claude-sonnet-5` | `ORCH_HELPER_MODEL` |
| `fast*` (bulk work) | `claude-fable-5` | `ORCH_FAST_MODEL` |

So Opus, Sonnet, and Fable 5 are all wired in out of the box. To run the whole
team on one model, e.g. Fable 5:

```bash
export ORCH_LEAD_MODEL=claude-fable-5
export ORCH_HELPER_MODEL=claude-fable-5
```

Or per agent in code: `run_agent(hub, "helper1", ..., model="claude-opus-4-8")`.

## Run it

```bash
pip install -r orchestration/requirements.txt
export ANTHROPIC_API_KEY=sk-ant-...          # read only here, never sent to an agent

# Pattern 1 — fixed lead + 2 helpers coordinating by messaging
python -m orchestration.demo team  "Draft a 3-point open-day plan for a football academy"

# Pattern 2 — lead spawns/monitors/collects/dismisses helpers on demand
python -m orchestration.demo spawn "Summarise 3 grassroots funding sources, one first step each"
```

## Notes

- `ANTHROPIC_API_KEY` is read from the environment by the SDK only. It is never
  placed in a prompt or passed to any agent — same key-safety posture as the
  `/api/*` routes in this repo.
- Tunables: `ORCH_WAIT_TIMEOUT` (default 60s for `wait_for_message`),
  `ORCH_MAX_TOKENS` (default 1024 per turn).
- This is a standalone Python package. It does not touch the Vite/React site or
  its build, and is not imported by the frontend.
