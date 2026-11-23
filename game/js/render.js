// render.js — everything the player sees. DOM only, no canvas: cards are divs
// so their values stay crisp at thumbnail size. One render(state) call redraws
// the table; overlays (title, how-to, tutorial, win, loss) are shown and hidden
// by screen. Floating damage numbers and the screen shake live here too.
import { cardById, ARCHETYPES, RARITIES } from './cards.js';
import { chainLabel } from './echo.js';
import { MAX_LIFE } from './state.js';

const ARCHETYPE_ICON = {
  echo: '<svg viewBox="0 0 24 24" width="30" height="30"><circle cx="12" cy="12" r="3" fill="currentColor"/><circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="10.5" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.55"/></svg>',
  silence: '<svg viewBox="0 0 24 24" width="30" height="30"><path d="M12 3 L19 20 L12 16.5 L5 20 Z" fill="currentColor"/><circle cx="12" cy="12" r="2.2" fill="#0f172a"/></svg>',
  thunder: '<svg viewBox="0 0 24 24" width="30" height="30"><path d="M13 2 L4 14 h6 L9 22 L20 9 h-6 Z" fill="currentColor"/></svg>',
};

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text !== undefined) node.textContent = text;
  return node;
}

function lifeBar(side, label) {
  const wrap = el('div', 'lifebar');
  const name = el('span', 'lifebar-name', label);
  const track = el('div', 'lifebar-track');
  const fill = el('div', 'lifebar-fill');
  fill.style.width = `${Math.max(0, (side.life / MAX_LIFE) * 100)}%`;
  if (side.life <= 6) fill.classList.add('low');
  track.appendChild(fill);
  const nums = el('span', 'lifebar-nums', `${side.life} / ${MAX_LIFE}`);
  if (side.shield > 0) nums.textContent += `  🛡 ${side.shield}`;
  wrap.append(name, track, nums);
  return wrap;
}

function cardNode(card, opts) {
  const node = el('div', `card arch-${card.archetype} rarity-${card.rarity}`);
  node.style.setProperty('--rarity', RARITIES[card.rarity].border);
  node.dataset.cardId = card.id;
  const cost = el('div', 'card-cost', String(card.cost));
  const name = el('div', 'card-name', card.name);
  const icon = el('div', 'card-icon');
  icon.style.color = ARCHETYPES[card.archetype].color;
  icon.innerHTML = ARCHETYPE_ICON[card.archetype];
  const arch = el('div', 'card-arch', ARCHETYPES[card.archetype].label);
  const text = el('div', 'card-text', card.text);
  const vals = el('div', 'card-values');
  if (card.dmg > 0) vals.appendChild(el('span', 'val-dmg', `⚔ ${card.dmg}`));
  if (card.heal > 0) vals.appendChild(el('span', 'val-heal', `✚ ${card.heal}`));
  if (card.shield > 0) vals.appendChild(el('span', 'val-shield', `🛡 ${card.shield}`));
  if (card.draw > 0) vals.appendChild(el('span', 'val-draw', `▤ ${card.draw}`));
  if (card.energy > 0) vals.appendChild(el('span', 'val-energy', `◆ ${card.energy}`));
  const rarity = el('div', 'card-rarity', RARITIES[card.rarity].label);
  node.append(cost, name, icon, arch, text, vals, rarity);
  if (opts && opts.selected) node.classList.add('selected');
  if (opts && opts.playable === false) node.classList.add('unplayable');
  return node;
}

function cardBackNode() {
  const node = el('div', 'card card-back');
  node.innerHTML = '<div class="back-mark">◉</div><div class="back-word">ECHO</div>';
  return node;
}

export function render(state, ui) {
  const app = document.getElementById('app');
  // --- opponent row ---
  const foeHand = document.getElementById('foe-hand');
  foeHand.replaceChildren();
  state.foe.hand.forEach(() => foeHand.appendChild(cardBackNode()));
  document.getElementById('foe-life').replaceChildren(lifeBar(state.foe, 'MIRA — Echo Warden'));
  document.getElementById('foe-count').textContent = `${state.foe.hand.length} cards · deck ${state.foe.deck.length}`;
  // --- centre ---
  document.getElementById('echo-chain').textContent = chainLabel(state);
  document.getElementById('echo-count').textContent = state.chain.count > 0 ? `x${state.chain.count}` : '—';
  document.getElementById('turn-label').textContent = state.phase === 'player'
    ? `YOUR TURN — Turn ${state.turn}` : state.phase === 'ai' ? 'MIRA IS THINKING…' : 'DUEL OVER';
  document.getElementById('deck-count').textContent = String(state.player.deck.length);
  document.getElementById('discard-count').textContent = String(state.player.discard.length);
  const logBox = document.getElementById('game-log');
  logBox.replaceChildren();
  state.log.forEach((line) => logBox.appendChild(el('div', 'log-line', line)));
  // --- player row ---
  document.getElementById('player-life').replaceChildren(lifeBar(state.player, 'YOU'));
  const energy = document.getElementById('energy-pips');
  energy.replaceChildren();
  for (let i = 0; i < 3; i += 1) {
    const pip = el('span', 'pip' + (i < state.player.energy ? ' on' : ''), '◆');
    energy.appendChild(pip);
  }
  document.getElementById('player-count').textContent = `${state.player.hand.length} cards · deck ${state.player.deck.length}`;
  const hand = document.getElementById('player-hand');
  hand.replaceChildren();
  state.player.hand.forEach((id) => {
    const card = cardById(id);
    const playable = state.phase === 'player' && card.cost <= state.player.energy;
    const node = cardNode(card, { selected: ui.selected === id, playable });
    node.addEventListener('click', () => ui.onCardClick(id));
    hand.appendChild(node);
  });
  const endBtn = document.getElementById('end-turn');
  endBtn.disabled = state.phase !== 'player';
  endBtn.textContent = state.phase === 'player' ? 'END TURN ⏎' : 'MIRA PLAYS…';
  // --- overlays ---
  document.getElementById('title-screen').classList.toggle('hidden', ui.screen !== 'title');
  document.getElementById('end-screen').classList.toggle('hidden', ui.screen !== 'end');
  document.getElementById('howto-screen').classList.toggle('hidden', ui.screen !== 'howto');
  document.getElementById('tutorial-screen').classList.toggle('hidden', ui.screen !== 'tutorial');
  app.classList.toggle('in-game', ui.screen === 'table' || ui.screen === 'end');
  if (ui.screen === 'end' && state.winner) {
    const win = state.winner === 'player';
    const title = document.getElementById('end-title');
    title.textContent = win ? 'VICTORY' : 'DEFEAT';
    title.className = win ? 'end-title win' : 'end-title lose';
    document.getElementById('end-sub').textContent = win
      ? 'The last echo is yours. Mira bows to the better chain.'
      : 'Mira’s chain outlasted yours. The mist keeps her secret.';
    document.getElementById('end-stats').textContent =
      `${state.turn} turns · longest echo x${state.maxChain} · damage dealt ${state.damageDealt}`;
  }
}

// A floating number over a life bar: damage, healing, or an echo repeat.
export function floatNumber(targetId, text, kind) {
  const anchor = document.getElementById(targetId);
  if (!anchor) return;
  const node = el('span', `float-num ${kind}`, text);
  anchor.appendChild(node);
  window.setTimeout(() => node.remove(), 1300);
}

export function shake(big) {
  const table = document.getElementById('table');
  table.classList.remove('shake', 'shake-big');
  void table.offsetWidth; // restart the animation
  table.classList.add(big ? 'shake-big' : 'shake');
}
