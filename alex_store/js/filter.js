// filter.js — simple appropriateness filter for kid-submitted text.
// Parent can extend BANNED_WORDS. We deliberately keep this small and obvious.

const BANNED_WORDS = [
  // Profanity (mild list — extend as needed)
  'damn', 'hell', 'crap', 'stupid', 'idiot', 'shut up',
  'fuck', 'shit', 'bitch', 'asshole', 'bastard', 'piss',
  // Violence
  'kill', 'murder', 'blood', 'gun', 'shoot', 'knife', 'stab', 'weapon',
  'die', 'dead', 'death',
  // Adult / scary themes
  'sex', 'sexy', 'naked', 'nude', 'porn', 'drug', 'drugs', 'beer', 'alcohol',
  'cigarette', 'smoking',
  // Hate / bullying
  'hate', 'racist', 'loser',
];

export function isAppropriate(text) {
  if (!text) return { ok: true };
  const lower = String(text).toLowerCase();
  for (const word of BANNED_WORDS) {
    // word-boundary-ish match: word can appear surrounded by non-letters
    const pattern = new RegExp(`(^|[^a-z])${escapeRegExp(word)}([^a-z]|$)`, 'i');
    if (pattern.test(lower)) {
      return { ok: false, reason: word };
    }
  }
  return { ok: true };
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
