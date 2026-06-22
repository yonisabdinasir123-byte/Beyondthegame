/**
 * api/generate-cv.js — server-side football CV generation.
 *
 * The CV is written by the Anthropic Messages API (ANTHROPIC_API_KEY), called
 * from the server so the key is never exposed in the browser. With no key it
 * returns an honest "needs a key to go live" state; it never fakes a CV.
 *
 * Body: the CV form { name, age, positions, preferredFoot, height, currentClub,
 *        previousClubs, appearances, goals, assists, cleanSheets, achievements, bio }
 * Returns: { ok, configured, cv } or an honest unavailable state.
 */
import { sendJson, sendNeedsKey, readJsonBody } from './_lib.js'

function buildPrompt(f) {
  const positions = Array.isArray(f.positions) ? f.positions : []
  const isGK = positions.includes('Goalkeeper')
  return `You are an expert football CV writer. Create a polished, professional football CV for the following player:

NAME: ${f.name}
AGE: ${f.age}
POSITION(S): ${positions.join(', ') || 'Not specified'}
PREFERRED FOOT: ${f.preferredFoot}
HEIGHT: ${f.height || 'Not provided'}

CAREER HISTORY:
Current Club: ${f.currentClub || 'Not specified'}
Previous Clubs: ${f.previousClubs || 'None listed'}

KEY STATISTICS:
Appearances: ${f.appearances || 'Not provided'}
Goals: ${f.goals || 'Not provided'}
Assists: ${f.assists || 'Not provided'}${isGK || f.cleanSheets ? `\nClean Sheets: ${f.cleanSheets || 'Not provided'}` : ''}

ACHIEVEMENTS AND HONOURS:
${f.achievements || 'None listed'}

PLAYER'S OWN WORDS:
"${f.bio || 'Not provided'}"

Format the CV as plain text with no markdown symbols and no dashes. Use these sections in order: a header line with the player's name and key facts, PROFILE SUMMARY (3 to 4 selling sentences), PLAYING ATTRIBUTES (7 to 9 bullets relevant to the position), CAREER HISTORY (most recent first), KEY STATISTICS${isGK ? ' including clean sheets' : ''}, and ACHIEVEMENTS AND HONOURS. Tone: confident and professional, suitable for a player seeking opportunities at semi-professional or professional academy level.`
}

export default async function handler(req, res) {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return sendNeedsKey(res, 'the CV builder', 'ANTHROPIC_API_KEY')

  const form = await readJsonBody(req)
  if (!form || !form.name) {
    return sendJson(res, 400, { ok: false, configured: true, message: 'Add your details first so we can build your CV.' })
  }

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
        max_tokens: 1600,
        messages: [{ role: 'user', content: buildPrompt(form) }],
      }),
    })
    if (!r.ok) throw new Error(`Anthropic responded ${r.status}`)
    const data = await r.json()
    const cv = data.content?.[0]?.text ?? ''
    return sendJson(res, 200, { ok: true, configured: true, cv })
  } catch {
    return sendJson(res, 502, { ok: false, configured: true, message: 'The CV builder is temporarily unavailable. Your answers are saved, please try again shortly.' })
  }
}
