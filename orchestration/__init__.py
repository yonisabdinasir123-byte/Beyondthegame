"""
Async multi-agent orchestration for Beyond the Game.

Faithful implementation of Anthropic's cookbook pattern
(platform.claude.com/cookbook/patterns-agents-async-multi-agent-orchestration):
a message hub delivers peer messages inline with tool results, so agents
coordinate without polling. Models are assigned per role (lead->opus-4-8,
helper->sonnet-5, fast->fable-5) and are fully overridable.
"""
from .agent import BASE_TOOLS, SEND_MESSAGE, WAIT_FOR_MESSAGE, run_agent
from .hub import Hub
from .models import FABLE, OPUS, ROLE_MODELS, SONNET, model_for
from .patterns import SUBAGENT_TOOLS, run_spawn_lead, run_team

__all__ = [
    "Hub",
    "run_agent",
    "run_team",
    "run_spawn_lead",
    "model_for",
    "ROLE_MODELS",
    "OPUS",
    "SONNET",
    "FABLE",
    "BASE_TOOLS",
    "SUBAGENT_TOOLS",
    "SEND_MESSAGE",
    "WAIT_FOR_MESSAGE",
]
