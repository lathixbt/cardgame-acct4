// state.js — the whole game state and the seeded shuffle that fills it.
// One state object, plain data: both sides' life, energy, shield, hand, deck
// and discard, the echo chain, the turn counter and the log. No DOM here.
import { buildDeck } from './cards.js';

export const MAX_LIFE = 20;
export const HAND_LIMIT = 7;
export const START_HAND = 5;
export const ENERGY_PER_TURN = 3;

// Small deterministic RNG (mulberry32) so a screenshot seed replays one board.
export function makeRng(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(deck, rng) {
  const d = deck.slice();
  for (let i = d.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = d[i]; d[i] = d[j]; d[j] = t;
  }
  return d;
}

function makeSide(deck) {
  return { life: MAX_LIFE, energy: ENERGY_PER_TURN, shield: 0, hand: [], deck, discard: [] };
}

export function newGame(seed) {
  const rng = makeRng(seed);
  const state = {
    seed,
    turn: 1,
    phase: 'player', // 'player' | 'ai' | 'over'
    player: makeSide(shuffle(buildDeck(), rng)),
    foe: makeSide(shuffle(buildDeck(), rng)),
    chain: { archetype: null, count: 0, lastCardId: null, lastDmg: 0, lastHeal: 0 },
    maxChain: 0,
    damageDealt: 0,
    damageTaken: 0,
    log: [],
    winner: null, // 'player' | 'foe' | null
    muted: false,
  };
  for (let i = 0; i < START_HAND; i += 1) {
    drawCard(state, 'player');
    drawCard(state, 'foe');
  }
  return state;
}

export function drawCard(state, who) {
  const side = state[who];
  if (side.hand.length >= HAND_LIMIT) return null;
  if (side.deck.length === 0) {
    if (side.discard.length === 0) return null;
    side.deck = shuffle(side.discard, makeRng(state.seed + state.turn * 7 + side.hand.length));
    side.discard = [];
  }
  const id = side.deck.pop();
  side.hand.push(id);
  return id;
}

export function pushLog(state, text) {
  state.log.unshift(text);
  if (state.log.length > 5) state.log.length = 5;
}
