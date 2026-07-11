"""
agent.py — the unified agent loop plus the base messaging tools.

A single run_agent() coroutine runs ANY agent (lead or helper). It drives the
Anthropic Messages API in a tool-use loop, routes the two base tools
(send_message / wait_for_message) through the Hub, dispatches any custom tools
via extra_dispatch, and — critically — appends the agent's drained inbox onto
the last tool result so peer messages arrive inline with no polling.
"""
import asyncio
import os

from .hub import Hub
from .models import model_for

# One shared async client, created lazily on first use. Reads ANTHROPIC_API_KEY
# from the environment; the key is never passed to or seen by any agent. Lazy
# init means the package imports fine (hub/models/patterns inspectable) even
# before `pip install anthropic`.
_client = None


def _get_client():
    global _client
    if _client is None:
        from anthropic import AsyncAnthropic  # imported on demand
        _client = AsyncAnthropic()
    return _client

SEND_MESSAGE = {
    "name": "send_message",
    "description": "Send a message to one or more other agents by id. "
                   "Delivery is asynchronous; the recipient sees it inline on its next turn.",
    "input_schema": {
        "type": "object",
        "properties": {
            "recipient_ids": {"type": "array", "items": {"type": "string"}},
            "content": {"type": "string"},
        },
        "required": ["recipient_ids", "content"],
    },
}

WAIT_FOR_MESSAGE = {
    "name": "wait_for_message",
    "description": "Block until another agent messages you. Use this when you have "
                   "nothing to do until a reply arrives.",
    "input_schema": {"type": "object", "properties": {}},
}

BASE_TOOLS = [SEND_MESSAGE, WAIT_FOR_MESSAGE]

WAIT_TIMEOUT = float(os.environ.get("ORCH_WAIT_TIMEOUT", "60"))
MAX_TOKENS = int(os.environ.get("ORCH_MAX_TOKENS", "1024"))


def _text_of(content) -> str:
    return "".join(b.text for b in content if getattr(b, "type", None) == "text")


async def run_agent(
    hub: Hub,
    name: str,
    system: str,
    first_user_turn: str,
    tools: list | None = None,
    extra_dispatch: dict | None = None,
    model: str | None = None,
    max_turns: int = 20,
) -> str:
    """Run one agent to completion. Returns its final text.

    model defaults to models.model_for(name) — lead->opus, helpers->sonnet,
    fast*->fable — but any caller can override it per agent.
    """
    model = model or model_for(name)
    tools = list(BASE_TOOLS) if tools is None else tools
    extra_dispatch = extra_dispatch or {}
    messages = [{"role": "user", "content": first_user_turn}]
    hub.register(name)
    hub.status[name] = "active"
    final_text = ""

    try:
        for _ in range(max_turns):
            resp = await _get_client().messages.create(
                model=model,
                max_tokens=MAX_TOKENS,
                system=system,
                tools=tools,
                messages=messages,
            )
            messages.append({"role": "assistant", "content": resp.content})

            text = _text_of(resp.content)
            if text:
                final_text = text

            if resp.stop_reason != "tool_use":
                hub.status[name] = "done"
                return final_text

            results = []
            for block in resp.content:
                if getattr(block, "type", None) != "tool_use":
                    continue
                if block.name == "send_message":
                    hub.post(name, block.input["recipient_ids"], block.input["content"])
                    out = "delivered"
                elif block.name == "wait_for_message":
                    hub.status[name] = "idling"
                    try:
                        await asyncio.wait_for(hub.event[name].wait(), timeout=WAIT_TIMEOUT)
                        out = "message received"
                    except asyncio.TimeoutError:
                        out = "timed out with no message"
                    hub.status[name] = "active"
                elif block.name in extra_dispatch:
                    out = await extra_dispatch[block.name](block)
                else:
                    out = f"unknown tool: {block.name}"
                results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": out,
                })

            # The breakthrough: drained inbox rides along on the last tool result,
            # so the agent reads its messages inline on the next turn — no polling.
            inbox = hub.drain(name)
            if inbox and results:
                results[-1]["content"] += hub.render(inbox)
            messages.append({"role": "user", "content": results})

        hub.status[name] = "done"
        return final_text
    except asyncio.CancelledError:
        hub.status[name] = "done"
        raise
    except Exception:
        hub.status[name] = "crashed"
        raise
