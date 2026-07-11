"""
demo.py — runnable entry point for both patterns.

Usage:
  export ANTHROPIC_API_KEY=sk-ant-...
  python -m orchestration.demo team    "Draft a 3-point launch plan for a football academy open day"
  python -m orchestration.demo spawn   "Research 3 grassroots funding sources and summarise each"

Model overrides (optional):
  ORCH_LEAD_MODEL, ORCH_HELPER_MODEL, ORCH_FAST_MODEL
"""
import asyncio
import os
import sys

from .models import ROLE_MODELS
from .patterns import run_spawn_lead, run_team

DEFAULT_TASK = "List three ways a football academy can support players after they are released, with one concrete first step each."


async def _main() -> None:
    mode = sys.argv[1] if len(sys.argv) > 1 else "team"
    task = " ".join(sys.argv[2:]) or DEFAULT_TASK

    if not os.environ.get("ANTHROPIC_API_KEY"):
        sys.exit("Set ANTHROPIC_API_KEY first. The key is read server-side only and never reaches an agent.")

    print(f"mode={mode}")
    print(f"models: lead={ROLE_MODELS['lead']}  helper={ROLE_MODELS['helper']}  fast={ROLE_MODELS['fast']}")
    print(f"task: {task}\n")

    if mode == "team":
        result = await run_team(task)
    elif mode == "spawn":
        result = await run_spawn_lead(task)
    else:
        sys.exit(f"Unknown mode '{mode}'. Use 'team' or 'spawn'.")

    print("\n──── final result ────")
    print(result)


if __name__ == "__main__":
    asyncio.run(_main())
