import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Dev-only API middleware.
 * ─────────────────────────
 * The site is a static SPA, but the live-data features (jobs, colleges, events,
 * career suggestions) must call third-party APIs from the SERVER so keys are
 * never exposed in the browser. In production those handlers in /api run on a
 * Node host (Vercel / Netlify Functions / Render / a small Express server).
 *
 * In local `npm run dev` there is no such host, so this plugin mounts the same
 * /api/<name>.js handlers as connect middleware and loads every env var (no
 * prefix) into process.env so the handlers can read their keys exactly as they
 * would in production.
 */
function apiDevServer(mode) {
  return {
    name: 'btg-api-dev-server',
    configureServer(server) {
      // Load ALL env vars (not just VITE_*) so server handlers see their keys.
      const env = loadEnv(mode, process.cwd(), '')
      for (const [k, v] of Object.entries(env)) {
        if (process.env[k] === undefined) process.env[k] = v
      }

      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next()
        const route = req.url.split('?')[0].replace(/^\/api\//, '').replace(/\/$/, '')
        try {
          const mod = await server.ssrLoadModule(`/api/${route}.js`)
          if (!mod?.default) return next()
          await mod.default(req, res)
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, message: 'Dev API route failed to load.', detail: String(err?.message || err) }))
        }
      })
    },
  }
}

// On Vercel the site sits at the domain root, so base must be '/'.
// On GitHub Pages it's served from a sub-path, so base must be '/Beyondthegame/'.
// Vercel injects VERCEL=1 into every build environment automatically.
export default defineConfig(({ command, mode }) => ({
  base: process.env.VERCEL ? '/' : (command === 'build' ? '/Beyondthegame/' : '/'),
  plugins: [react(), apiDevServer(mode)],
}))
