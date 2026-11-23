// echo.js — the echo chain, the one mechanic that makes ECHO DUEL its own game.
// Playing a card whose archetype matches the last card played repeats that
// last card's main effect at half strength. Playing a different archetype
// breaks the chain; breaking a chain of 2 or more pays 1 bonus energy.
// The chain counter is shown on the table so both players can read it.
import { cardById } from './cards.js';

export function echoBonus(state, card) {
  const chain = state.chain;
  if (!chain.archetype || chain.archetype !== card.archetype) return null;
  return {
    dmg: Math.floor(chain.lastDmg / 2),
    heal: Math.floor(chain.lastHeal / 2),
    chainAfter: chain.count + 1,
  };
}

// Record a played card on the chain. Returns { broke, breakBonus }.
export function recordPlay(state, card) {
  const chain = state.chain;
  let broke = false;
  let breakBonus = 0;
  if (chain.archetype && chain.archetype !== card.archetype) {
    broke = true;
    if (chain.count >= 2) breakBonus = 1;
    chain.count = 0;
  }
  chain.archetype = card.archetype;
  chain.count += 1;
  chain.lastCardId = card.id;
  chain.lastDmg = card.dmg;
  chain.lastHeal = card.heal;
  if (chain.count > state.maxChain) state.maxChain = chain.count;
  return { broke, breakBonus };
}

export function chainLabel(state) {
  const chain = state.chain;
  if (!chain.archetype) return 'No echo yet — play any card to start the chain.';
  const card = cardById(chain.lastCardId);
  const name = card ? card.name : '—';
  return `ECHO x${chain.count} — last: ${name} (${chain.archetype.toUpperCase()}). Match it to repeat its effect at half power.`;
}
