# Beyond the Game — session notes

## Git push fallback (remote sessions)

In remote (cloud) sessions, `git push` normally goes through a local git proxy
that the platform points `origin` at with per-session credentials. If the
container restarts mid-session, `origin` can revert to plain
`https://github.com/...` with no credentials and `git push` fails with:

    fatal: could not read Username for 'https://github.com'

When that happens, do NOT retry the CLI push or probe the proxy. Instead:

1. Push via the GitHub MCP `push_files` tool (it is independently
   authenticated) with the exact file contents and commit message.
2. Then reconcile local state:
   `git fetch origin <branch> && git reset --hard origin/<branch>`
   (fetch works unauthenticated because the repo is public).

The proxy usually re-arms on the next fresh session, so try a normal
`git push` first each session before falling back.

## Branches & deploys

- Development branch: `claude/football-academy-homepage-tr4DF`; production: `main`.
- Vercel production deploys from `main` (base path `/`, via `VERCEL=1`).
- GitHub Pages deploys via `.github/workflows/deploy.yml` to the `gh-pages`
  branch (base path `/Beyondthegame/`, via `DEPLOY_TARGET=github-pages`).
- Base-path logic lives at the bottom of `vite.config.js` — keep it env-driven.

## Repo conventions

- Live-data features call `/api/*.js` server-side; API keys are read from
  `process.env` only and must never reach the browser bundle or prompts.
- No em/en dashes in visible copy; do not describe features with the word "AI"
  in user-facing text, filenames, or env var names.
- `orchestration/` is a standalone Python package (async multi-agent pattern);
  it is not imported by the frontend and must not affect the Vite build.
