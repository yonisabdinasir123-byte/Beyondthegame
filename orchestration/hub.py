"""
hub.py — the message hub that makes async multi-agent coordination pollless.

Every agent has an inbox and an asyncio.Event. When one agent posts a message
to another, the recipient's Event is set, which wakes it if it is waiting. The
key trick (see agent.run_agent) is that drained inbox messages are appended to
the LAST tool result of the recipient's next turn, so agents receive peer
messages inline with normal tool output and never have to poll.
"""
import asyncio
from collections import defaultdict


class Hub:
    def __init__(self):
        # name -> list of pending messages {"from": str, "content": str}
        self.inbox: dict[str, list[dict]] = defaultdict(list)
        # name -> Event, set when a new message lands, cleared on drain
        self.event: dict[str, asyncio.Event] = defaultdict(asyncio.Event)
        # name -> "active" | "idling" | "done" | "crashed"
        self.status: dict[str, str] = {}
        self._counter = 0

    def register(self, name: str) -> None:
        """Make an agent known to the hub before it starts running."""
        _ = self.inbox[name]   # touch defaultdicts so keys exist
        _ = self.event[name]
        self.status.setdefault(name, "active")

    def new_name(self) -> str:
        """Auto-generate and register the next helper name (helper1, helper2...)."""
        self._counter += 1
        name = f"helper{self._counter}"
        self.register(name)
        return name

    def post(self, sender: str, recipients: list[str], content: str) -> None:
        """Deliver a message to each recipient and wake anyone waiting."""
        msg = {"from": sender, "content": content}
        for r in recipients:
            self.inbox[r].append(msg)
            self.event[r].set()

    def drain(self, name: str) -> list[dict]:
        """Empty an agent's inbox and reset its event. No await in between, so
        this is atomic under asyncio's cooperative scheduling."""
        msgs = self.inbox[name][:]
        self.inbox[name].clear()
        self.event[name].clear()
        return msgs

    @staticmethod
    def render(msgs: list[dict]) -> str:
        """Format drained messages as XML to append onto a tool result."""
        if not msgs:
            return ""
        lines = ["\n\n<messages>"]
        for m in msgs:
            lines.append(f'  <message from="{m["from"]}">{m["content"]}</message>')
        lines.append("</messages>")
        return "\n".join(lines)
