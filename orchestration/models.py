"""
models.py — per-role model configuration.

Roles map to models so you can tune cost and speed:
  lead    -> claude-opus-4-8   (reasons, plans, coordinates the team)
  helper  -> claude-sonnet-5   (parallel worker agents)
  fast    -> claude-fable-5    (cheap/fast bulk work when you opt in)

Every mapping can be overridden with an environment variable, and every
run_agent() call can override the model per agent. Nothing here is hardcoded
into the agent loop — the loop just asks model_for(name).
"""
import os

# Canonical model ids. Keep these in one place so a model bump is a one-line
# change everywhere the orchestration runs.
OPUS = "claude-opus-4-8"
SONNET = "claude-sonnet-5"
FABLE = "claude-fable-5"

ROLE_MODELS = {
    "lead": os.environ.get("ORCH_LEAD_MODEL", OPUS),
    "helper": os.environ.get("ORCH_HELPER_MODEL", SONNET),
    "fast": os.environ.get("ORCH_FAST_MODEL", FABLE),
}


def model_for(name: str) -> str:
    """Pick a model for an agent by its name/role.

    The lead agent is always the coordinator, so it gets the lead model.
    Anything whose name starts with "fast" runs on the cheap/fast model;
    every other worker runs on the helper model. Callers can still pass an
    explicit model= to run_agent() to override this entirely.
    """
    if name == "lead":
        return ROLE_MODELS["lead"]
    if name.startswith("fast"):
        return ROLE_MODELS["fast"]
    return ROLE_MODELS["helper"]
