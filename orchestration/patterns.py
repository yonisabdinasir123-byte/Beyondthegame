"""
patterns.py — the two async orchestration patterns from the cookbook.

Pattern 1 (run_team): a fixed team registered upfront. The lead and helpers
coordinate purely through send_message / wait_for_message.

Pattern 2 (run_spawn_lead): a lead that spawns helpers on demand with
create_subagents, watches them with get_status, collects their reports, and
tears them down with kill_subagents.

Both use per-role models via models.model_for (lead->opus, helper->sonnet).
"""
import asyncio

from .agent import BASE_TOOLS, run_agent
from .hub import Hub


# ── Pattern 1: fixed N-agent team ────────────────────────────────────────────

async def run_team(task: str, helper_count: int = 2, max_turns: int = 20) -> str:
    """Lead + N helpers, all registered upfront, coordinating by messaging."""
    hub = Hub()
    lead = "lead"
    helpers = [f"helper{i + 1}" for i in range(helper_count)]
    for n in [lead, *helpers]:
        hub.register(n)

    helper_sys = (
        "You are {name}, a helper agent on a small team. Introduce yourself to the "
        "lead when messaged, do the piece of work you are asked for, and report back "
        "with send_message. Use wait_for_message when you have nothing to do."
    )
    helper_tasks = [
        asyncio.create_task(run_agent(
            hub, n,
            system=helper_sys.format(name=n),
            first_user_turn=(
                f"You are on a team with the lead and {len(helpers) - 1} other helper(s). "
                f"Wait for the lead to assign you part of this task: {task}"
            ),
            max_turns=max_turns,
        ))
        for n in helpers
    ]

    lead_sys = (
        "You are the lead of a small agent team. Break the task into pieces, delegate "
        "each piece to a helper with send_message, collect their replies, and produce "
        "the final answer. The helper ids are: " + ", ".join(helpers) + "."
    )
    try:
        return await run_agent(
            hub, lead,
            system=lead_sys,
            first_user_turn=f"Coordinate the team to complete this task and give the final result:\n{task}",
            max_turns=max_turns,
        )
    finally:
        for t in helper_tasks:
            t.cancel()
        await asyncio.gather(*helper_tasks, return_exceptions=True)


# ── Pattern 2: dynamic async subagents ───────────────────────────────────────

SUBAGENT_TOOLS = [
    {
        "name": "create_subagents",
        "description": "Spawn one or more helper agents that run concurrently in the "
                       "background. Returns immediately with the spawned ids.",
        "input_schema": {
            "type": "object",
            "properties": {
                "per_subagent_instructions": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "One instruction string per helper to spawn.",
                }
            },
            "required": ["per_subagent_instructions"],
        },
    },
    {
        "name": "get_status",
        "description": "Report the status of every spawned helper (active / idling / done / crashed).",
        "input_schema": {"type": "object", "properties": {}},
    },
    {
        "name": "kill_subagents",
        "description": "Cancel the named helpers once you have their results.",
        "input_schema": {
            "type": "object",
            "properties": {"subagent_ids": {"type": "array", "items": {"type": "string"}}},
            "required": ["subagent_ids"],
        },
    },
]


async def run_spawn_lead(task: str, max_turns: int = 20) -> str:
    """A lead that dynamically spawns, monitors, collects, and dismisses helpers."""
    hub = Hub()
    hub.register("lead")
    helpers: dict[str, asyncio.Task] = {}

    async def _create(block):
        instructions = block.input.get("per_subagent_instructions") or [""]
        spawned = []
        for instruction in instructions:
            h = hub.new_name()
            helpers[h] = asyncio.create_task(run_agent(
                hub, h,
                system=f"You are {h}, a background helper. Do the work you are given, "
                       f"then report your result to the lead with send_message(['lead'], ...).",
                first_user_turn=instruction or f"Assist the lead with: {task}",
                max_turns=max_turns,
            ))
            spawned.append(h)
        return f"spawned: {', '.join(spawned)}"

    async def _status(_block):
        if not hub.status:
            return "no subagents yet"
        return "\n".join(f"{n}: {s}" for n, s in hub.status.items() if n != "lead")

    async def _kill(block):
        killed = []
        for sid in block.input.get("subagent_ids", []):
            t = helpers.get(sid)
            if t:
                t.cancel()
                hub.status[sid] = "done"
                killed.append(sid)
        return f"cancelled: {', '.join(killed) or 'none'}"

    lead_sys = (
        "You are a lead orchestrator. Use create_subagents to spawn background helpers "
        "for independent pieces of work, get_status to monitor them, wait_for_message to "
        "collect their reports, and kill_subagents once you have what you need. Then "
        "synthesize the final answer yourself."
    )
    try:
        return await run_agent(
            hub, "lead",
            system=lead_sys,
            first_user_turn=f"Complete this task by spawning and coordinating helpers:\n{task}",
            tools=[*SUBAGENT_TOOLS, *BASE_TOOLS],
            extra_dispatch={
                "create_subagents": _create,
                "get_status": _status,
                "kill_subagents": _kill,
            },
            max_turns=max_turns,
        )
    finally:
        for t in helpers.values():
            t.cancel()
        await asyncio.gather(*helpers.values(), return_exceptions=True)
