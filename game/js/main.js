// main.js — bootstrap for ECHO DUEL. Owns the ui object the renderer and the
// input layer share, runs the AI turn with a readable pace, plays sounds and
// animations for every report, and exposes two hooks used only by screenshots
// and tests: ?screen=title|table|win|loss jumps to a staged screen, and
// ?autoplay=win|loss plays a whole duel on its own. Default load is the title.
import { newGame, drawCard } from './state.js';
import { playCard, endTurn, startPlayerTurn } from './rules.js';
import { pickAiCard } from './ai.js';
import { render, floatNumber, shake } from './render.js';
import { bindInput } from './input.js';
import { sfx, setMuted, isMuted } from './audio.js';
import { cardById } from './cards.js';

const params = new URLSearchParams(window.location.search);
const SEED = Number(params.get('seed') || '7');

let state = newGame(SEED);
const ui = {
  screen: 'title',
  selected: null,
  handIds() { return state.player.hand.slice(); },
  onCardClick(id) { onCardClick(id); },
  onPlaySelected() { if (ui.selected) tryPlay(ui.selected); },
  onStart() { startDuel(); },
  onMenu() { ui.screen = 'title'; ui.selected = null; draw(); },
  onRestart() { startDuel(); },
};

function draw() { render(state, ui); }

function showFloats(report, who) {
  const target = who === 'player' ? 'foe-life' : 'player-life';
  if (report.dmg > 0) {
    floatNumber(target, `-${report.dmg}`, 'dmg');
    if (report.dmg >= 6) shake(true); else shake(false);
  }
  if (report.heal > 0) floatNumber(who === 'player' ? 'player-life' : 'foe-life', `+${report.heal}`, 'heal');
}

function afterPlay(report, who) {
  if (!report) return;
  showFloats(report, who);
  if (report.echo && (report.echo.dmg > 0 || report.echo.heal > 0)) sfx.echo();
  else if (report.dmg >= 6) sfx.bigHit();
  else if (report.dmg > 0) sfx.damage();
  else if (report.heal > 0) sfx.heal();
  else sfx.play();
  if (report.draw > 0) sfx.draw();
  ui.selected = null;
  draw();
  if (state.winner) finishDuel();
}

function tryPlay(cardId) {
  if (state.phase !== 'player' || state.winner) return;
  const report = playCard(state, 'player', cardId);
  if (!report) return;
  afterPlay(report, 'player');
}

function onCardClick(id) {
  if (state.phase !== 'player' || state.winner) return;
  if (ui.selected === id) { tryPlay(id); return; }
  ui.selected = id;
  draw();
}

const sleep = (ms) => new Promise((r) => window.setTimeout(r, ms));

async function runAiTurn() {
  await sleep(650);
  // In autoplay win mode Mira holds her cards, so the scripted duel is a win.
  while (!state.winner && window.__autoplayMode !== 'win') {
    const id = pickAiCard(state);
    if (!id) break;
    const report = playCard(state, 'foe', id);
    afterPlay(report, 'foe');
    await sleep(750);
  }
  if (state.winner) { finishDuel(); return; }
  await sleep(450);
  startPlayerTurn(state);
  sfx.turn();
  draw();
}

function onEndTurn() {
  if (!endTurn(state)) return;
  ui.selected = null;
  draw();
  void runAiTurn();
}

function finishDuel() {
  ui.screen = 'end';
  if (state.winner === 'player') sfx.win(); else sfx.lose();
  draw();
}

function startDuel() {
  state = newGame(SEED + state.turn); // a fresh shuffle each duel
  ui.screen = 'table';
  ui.selected = null;
  draw();
  if (params.get('tutorial') !== '0') {
    ui.screen = 'tutorial';
    draw();
  }
}

function stageScreen(name) {
  // Deterministic staged states for screenshots — the same real renderer.
  if (name === 'title') { ui.screen = 'title'; draw(); return; }
  if (name === 'table') {
    state = newGame(11);
    // A fixed mid-game board: force the hands, then play a real two-card
    // thunder line so the echo chain and the log are alive on the table.
    state.player.hand = ['thu-03', 'thu-01', 'echo-03', 'sil-01', 'echo-02'];
    state.foe.hand = ['echo-01', 'sil-02', 'thu-02', 'echo-04', 'sil-03'];
    state.player.deck = state.player.deck.filter((id) => !state.player.hand.includes(id));
    state.foe.deck = state.foe.deck.filter((id) => !state.foe.hand.includes(id));
    state.player.discard = ['echo-01', 'sil-04'];
    state.foe.discard = ['thu-01'];
    playCard(state, 'player', 'thu-03');
    playCard(state, 'player', 'thu-01');
    state.player.life = 14; state.foe.life = 11;
    state.player.energy = 2;
    ui.screen = 'table';
    draw();
    return;
  }
  if (name === 'win' || name === 'loss') {
    state = newGame(23);
    state.turn = 9;
    state.maxChain = 4;
    state.damageDealt = name === 'win' ? 22 : 13;
    if (name === 'win') { state.foe.life = 0; state.player.life = 9; state.winner = 'player'; }
    else { state.player.life = 0; state.foe.life = 6; state.winner = 'foe'; }
    state.phase = 'over';
    ui.screen = 'end';
    draw();
  }
}

// ---- wire the buttons ----
document.getElementById('start-btn').addEventListener('click', startDuel);
document.getElementById('howto-btn').addEventListener('click', () => { ui.screen = 'howto'; draw(); });
document.getElementById('howto-close').addEventListener('click', () => { ui.screen = 'title'; draw(); });
document.getElementById('tutorial-close').addEventListener('click', () => { ui.screen = 'table'; draw(); });
document.getElementById('end-turn').addEventListener('click', onEndTurn);
document.getElementById('again-btn').addEventListener('click', startDuel);
document.getElementById('menu-btn').addEventListener('click', () => { ui.screen = 'title'; draw(); });
document.getElementById('mute-btn').addEventListener('click', (event) => {
  setMuted(!isMuted());
  event.currentTarget.textContent = isMuted() ? '🔇 MUTED' : '🔊 SOUND';
});
bindInput(ui);

// Expose the live state for play-tests (read-only use in tests).
window.__game = { get state() { return state; }, get screen() { return ui.screen; } };
window.__shotReady = false;

// ---- autoplay: plays whole duels through the real input path ----
async function autoplay(mode) {
  window.__autoplayMode = mode;
  ui.screen = 'table';
  draw();
  const smart = mode === 'win'; // win: player smart, Mira holds; loss: player weak
  while (!state.winner) {
    if (state.phase === 'player') {
      // One card, then end the turn — a real turn, not a hand dump.
      const hand = state.player.hand.slice();
      if (smart) hand.sort((a, b) => (cardById(b).dmg - cardById(a).dmg) || (cardById(a).cost - cardById(b).cost));
      // Loss mode: never match the chain (no echo for the player), lowest
      // damage first, so Mira's heuristic wins the duel for real.
      else hand.sort((a, b) => {
        const am = state.chain.archetype === cardById(a).archetype ? 1 : 0;
        const bm = state.chain.archetype === cardById(b).archetype ? 1 : 0;
        return (am - bm) || (cardById(a).dmg - cardById(b).dmg) || (cardById(b).cost - cardById(a).cost);
      });
      let played = false;
      for (const id of hand) {
        const card = cardById(id);
        if (!card || card.cost > state.player.energy) continue;
        if (smart && (card.dmg >= 2 || card.heal > 0)) { tryPlay(id); played = true; break; }
        if (!smart) { tryPlay(id); played = true; break; }
      }
      if (state.winner) break;
      onEndTurn();
      await sleep(150);
    } else {
      await sleep(150);
    }
  }
  window.__campaignDone = true;
}

const screenParam = params.get('screen');
if (screenParam) {
  stageScreen(screenParam);
  window.__shotReady = true;
} else if (params.get('autoplay')) {
  draw();
  void autoplay(params.get('autoplay'));
  window.__shotReady = true;
} else {
  draw();
  window.__shotReady = true;
}
