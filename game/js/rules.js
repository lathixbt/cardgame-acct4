// rules.js — the rules of a turn: play a card, resolve its effect plus any
// echo, end the turn, and decide the winner. Pure state changes; the renderer
// reads the state afterwards. Every effect is reported back so the UI can
// animate it (damage numbers, shake, sounds).
import { cardById } from './cards.js';
import { drawCard, pushLog, MAX_LIFE } from './state.js';
import { echoBonus, recordPlay } from './echo.js';

export function canPlay(state, who, cardId) {
  const side = state[who];
  const card = cardById(cardId);
  if (!card || state.phase !== (who === 'player' ? 'player' : 'ai')) return false;
  if (!side.hand.includes(cardId)) return false;
  return side.energy >= card.cost;
}

// Apply damage to a side, shield first. Returns the life actually lost.
export function dealDamage(state, who, amount) {
  const side = state[who];
  let left = amount;
  if (side.shield > 0) {
    const blocked = Math.min(side.shield, left);
    side.shield -= blocked;
    left -= blocked;
  }
  side.life = Math.max(0, side.life - left);
  if (who === 'foe') state.damageDealt += left;
  if (who === 'player') state.damageTaken += left;
  return left;
}

function healSide(state, who, amount) {
  const side = state[who];
  side.life = Math.min(MAX_LIFE, side.life + amount);
}

// Play one card. Returns a report the renderer animates, or null if illegal.
export function playCard(state, who, cardId) {
  if (!canPlay(state, who, cardId)) return null;
  const card = cardById(cardId);
  const side = state[who];
  const foe = who === 'player' ? 'foe' : 'player';
  const echo = echoBonus(state, card);
  side.energy -= card.cost;
  side.hand.splice(side.hand.indexOf(cardId), 1);
  side.discard.push(cardId);

  const report = { card, echo, dmg: 0, heal: 0, draw: 0, energy: 0, shield: 0, broke: false, breakBonus: 0 };
  if (card.dmg > 0) report.dmg += dealDamage(state, foe, card.dmg);
  if (card.heal > 0) { healSide(state, who, card.heal); report.heal += card.heal; }
  if (card.draw > 0) {
    for (let i = 0; i < card.draw; i += 1) if (drawCard(state, who)) report.draw += 1;
  }
  if (card.energy > 0) { side.energy += card.energy; report.energy += card.energy; }
  if (card.shield > 0) { side.shield += card.shield; report.shield += card.shield; }
  if (echo) {
    if (echo.dmg > 0) report.dmg += dealDamage(state, foe, echo.dmg);
    if (echo.heal > 0) { healSide(state, who, echo.heal); report.heal += echo.heal; }
  }
  const rec = recordPlay(state, card);
  report.broke = rec.broke;
  report.breakBonus = rec.breakBonus;
  if (rec.breakBonus > 0) side.energy += rec.breakBonus;

  const whoName = who === 'player' ? 'You' : 'Mira';
  let line = `${whoName} played ${card.name}`;
  if (echo && (echo.dmg > 0 || echo.heal > 0)) line += ` — ECHO x${echo.chainAfter}!`;
  if (rec.broke) line += ' — chain broken!';
  pushLog(state, line);
  checkWinner(state);
  return report;
}

export function endTurn(state) {
  if (state.phase !== 'player' || state.winner) return false;
  state.phase = 'ai';
  state.foe.energy = 3; // Mira refills when her turn begins
  return true;
}

export function startPlayerTurn(state) {
  state.turn += 1;
  state.phase = 'player';
  const side = state.player;
  side.energy = 3;
  drawCard(state, 'player');
  drawCard(state, 'foe');
  pushLog(state, `Turn ${state.turn} — your move.`);
}

export function checkWinner(state) {
  if (state.winner) return;
  if (state.foe.life <= 0 && state.player.life <= 0) state.winner = 'player';
  else if (state.foe.life <= 0) state.winner = 'player';
  else if (state.player.life <= 0) state.winner = 'foe';
  if (state.winner) {
    state.phase = 'over';
    pushLog(state, state.winner === 'player' ? 'You win the duel!' : 'Mira wins the duel.');
  }
}
