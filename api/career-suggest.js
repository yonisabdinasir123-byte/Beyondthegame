/**
 * api/career-suggest.js — optional enrichment for the career suggester.
 *
 * Server-side proxy to the Anthropic Messages API (ANTHROPIC_API_KEY), so the
 * key is never exposed in the browser. The page already shows rule-based
 * matches instantly; this only adds extra, tailored suggestions when a key is
 * present. With no key it returns an honest unavailable state and the page
 * keeps showing its own database results.
 *
 * Body: { subjects, hobbies, skills, freeText }
 * Returns: { ok, configured, suggestions: [{ job, why, firstStep }] }
 */
import { sendJson, sendNeedsKey, readJsonBody } from './_lib.js'

export default async function handler(req, res) {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return sendNeedsKey(res, 'tailored career suggestions', 'ANTHROPIC_API_KEY')

  const { subjects = [], hobbies = [], skills = [], freeText = '' } = await readJsonBody(req)
  const interests = [...subjects, ...hobbies, ...skills, freeText].filter(Boolean).join(', ')

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 900,
        messages: [{
          role: 'user',
          content:
            `A young person (16 to 21) who has just left a UK football academy lists these interests: ${interests}. ` +
            `Suggest 4 realistic UK career paths that build on what they already have. ` +
            `Reply ONLY with JSON: {"suggestions":[{"job":"","why":"","firstStep":""}]}. ` +
            `Keep each field plain, encouraging, and free of dashes.`,
        }],
      }),
    })
    if (!r.ok) throw new Error(`Anthropic responded ${r.status}`)
    const data = await r.json()
    const text = data.content?.[0]?.text ?? '{}'
    let suggestions = []
    try { suggestions = JSON.parse(text).suggestions ?? [] } catch { /* ignore */ }
    return sendJson(res, 200, { ok: true, configured: true, suggestions })
  } catch {
    return sendJson(res, 502, { ok: false, configured: true, suggestions: [], message: 'Tailored suggestions are unavailable right now. Showing database matches instead.' })
  }
}
