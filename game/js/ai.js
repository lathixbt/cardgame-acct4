// ai.js — Mira, the opponent. A heuristic, not a random player: every card in
// her hand is scored (damage, healing when hurt, drawing, energy, and the
// echo bonus for matching the chain), the best affordable card is played, and
// she stops when nothing scores above the bar. The player can read her
// choices and break the chain to deny her echoes.
import { cardById } from './cards.js';
import { echoBonus } from './echo.js';

function scoreCard(state, card) {
  const foe = state.foe;
  let score = 0;
  score += card.dmg * 2;
  if (card.dmg >= 9) score += 2; // finishers are tempting
  if (foe.life < 10) score += card.heal * 3; // hurt: heal matters
  else score += card.heal * 0.5;
  score += card.draw * 2.5;
  score += card.energy * 2;
  score += card.shield * (state.player.life > 12 ? 1 : 0.4);
  const echo = echoBonus(state, card);
  if (echo) score += (echo.dmg + echo.heal) * 2 + 3; // chaining is the game
  if (state.chain.archetype && state.chain.archetype !== card.archetype && state.chain.count >= 2) score += 2; // break a long chain
  score -= card.cost * 0.6;
  return score;
}

// One AI move: the best card she can afford, or null when she should pass.
export function pickAiCard(state) {
  let best = null;
  let bestScore = 4; // below this, passing beats playing
  for (const id of state.foe.hand) {
    const card = cardById(id);
    if (!card || card.cost > state.foe.energy) continue;
    const s = scoreCard(state, card);
    if (s > bestScore) { bestScore = s; best = id; }
  }
  return best;
}
