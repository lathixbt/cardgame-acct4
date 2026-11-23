// cards.js — the 30 distinct cards of ECHO DUEL.
// Three archetypes: echo (violet, repeats the chain), silence (teal, defence
// and chain-breaking), thunder (amber, raw damage). Rarity drives the frame:
// common, rare, epic, legendary. Every card is data only; rules live in rules.js.
export const ARCHETYPES = {
  echo: { label: 'ECHO', color: '#8b5cf6', dark: '#5b21b6' },
  silence: { label: 'SILENCE', color: '#2dd4bf', dark: '#0f766e' },
  thunder: { label: 'THUNDER', color: '#f59e0b', dark: '#92400e' },
};

export const RARITIES = {
  common: { label: 'COMMON', border: '#94a3b8' },
  rare: { label: 'RARE', border: '#38bdf8' },
  epic: { label: 'EPIC', border: '#c084fc' },
  legendary: { label: 'LEGENDARY', border: '#fbbf24' },
};

// dmg: damage to the foe. heal: life restored to you. draw: cards drawn.
// energy: energy gained this turn. shield: damage blocked from the next hit.
// text is the one-line rule shown on the card.
export const CARDS = [
  // ---- ECHO (violet) — chain cards ----
  { id: 'echo-01', name: 'First Whisper', archetype: 'echo', cost: 1, dmg: 2, heal: 0, draw: 0, energy: 0, shield: 0, rarity: 'common', text: 'Deal 2. Starts the echo.' },
  { id: 'echo-02', name: 'Mirror Step', archetype: 'echo', cost: 1, dmg: 1, heal: 0, draw: 1, energy: 0, shield: 0, rarity: 'common', text: 'Deal 1. Draw a card.' },
  { id: 'echo-03', name: 'Twin Strike', archetype: 'echo', cost: 2, dmg: 4, heal: 0, draw: 0, energy: 0, shield: 0, rarity: 'common', text: 'Deal 4 damage.' },
  { id: 'echo-04', name: 'Reverb', archetype: 'echo', cost: 2, dmg: 3, heal: 0, draw: 0, energy: 1, shield: 0, rarity: 'rare', text: 'Deal 3. Gain 1 energy.' },
  { id: 'echo-05', name: 'Fading Chant', archetype: 'echo', cost: 1, dmg: 0, heal: 3, draw: 0, energy: 0, shield: 0, rarity: 'common', text: 'Restore 3 life.' },
  { id: 'echo-06', name: 'Second Voice', archetype: 'echo', cost: 2, dmg: 2, heal: 0, draw: 1, energy: 0, shield: 0, rarity: 'rare', text: 'Deal 2. Draw a card.' },
  { id: 'echo-07', name: 'Hall of Mirrors', archetype: 'echo', cost: 3, dmg: 6, heal: 0, draw: 0, energy: 0, shield: 0, rarity: 'epic', text: 'Deal 6 damage.' },
  { id: 'echo-08', name: 'Round Song', archetype: 'echo', cost: 2, dmg: 0, heal: 4, draw: 1, energy: 0, shield: 0, rarity: 'rare', text: 'Restore 4. Draw a card.' },
  { id: 'echo-09', name: 'Infinite Corridor', archetype: 'echo', cost: 3, dmg: 5, heal: 0, draw: 1, energy: 0, shield: 0, rarity: 'epic', text: 'Deal 5. Draw a card.' },
  { id: 'echo-10', name: 'The Last Word', archetype: 'echo', cost: 3, dmg: 8, heal: 0, draw: 0, energy: 0, shield: 0, rarity: 'legendary', text: 'Deal 8 damage. The echo ends here.' },
  // ---- SILENCE (teal) — defence and chain-breaking ----
  { id: 'sil-01', name: 'Hush', archetype: 'silence', cost: 1, dmg: 0, heal: 0, draw: 0, energy: 0, shield: 3, rarity: 'common', text: 'Gain 3 shield.' },
  { id: 'sil-02', name: 'Still Water', archetype: 'silence', cost: 1, dmg: 0, heal: 4, draw: 0, energy: 0, shield: 0, rarity: 'common', text: 'Restore 4 life.' },
  { id: 'sil-03', name: 'Muted Blade', archetype: 'silence', cost: 2, dmg: 3, heal: 0, draw: 0, energy: 0, shield: 2, rarity: 'common', text: 'Deal 3. Gain 2 shield.' },
  { id: 'sil-04', name: 'Deep Breath', archetype: 'silence', cost: 1, dmg: 0, heal: 0, draw: 2, energy: 0, shield: 0, rarity: 'common', text: 'Draw 2 cards.' },
  { id: 'sil-05', name: 'Ward of Mist', archetype: 'silence', cost: 2, dmg: 0, heal: 0, draw: 0, energy: 0, shield: 6, rarity: 'rare', text: 'Gain 6 shield.' },
  { id: 'sil-06', name: 'Quiet Rooms', archetype: 'silence', cost: 2, dmg: 0, heal: 5, draw: 0, energy: 1, shield: 0, rarity: 'rare', text: 'Restore 5. Gain 1 energy.' },
  { id: 'sil-07', name: 'Cut the Thread', archetype: 'silence', cost: 2, dmg: 4, heal: 0, draw: 0, energy: 0, shield: 0, rarity: 'rare', text: 'Deal 4. Breaks the echo chain.' },
  { id: 'sil-08', name: 'Sanctuary', archetype: 'silence', cost: 3, dmg: 0, heal: 8, draw: 0, energy: 0, shield: 0, rarity: 'epic', text: 'Restore 8 life.' },
  { id: 'sil-09', name: 'Soundless Vault', archetype: 'silence', cost: 3, dmg: 0, heal: 0, draw: 1, energy: 0, shield: 9, rarity: 'epic', text: 'Gain 9 shield. Draw a card.' },
  { id: 'sil-10', name: 'The Long Quiet', archetype: 'silence', cost: 3, dmg: 6, heal: 6, draw: 0, energy: 0, shield: 0, rarity: 'legendary', text: 'Deal 6. Restore 6 life.' },
  // ---- THUNDER (amber) — raw damage ----
  { id: 'thu-01', name: 'Spark', archetype: 'thunder', cost: 1, dmg: 3, heal: 0, draw: 0, energy: 0, shield: 0, rarity: 'common', text: 'Deal 3 damage.' },
  { id: 'thu-02', name: 'Static Snap', archetype: 'thunder', cost: 1, dmg: 2, heal: 0, draw: 1, energy: 0, shield: 0, rarity: 'common', text: 'Deal 2. Draw a card.' },
  { id: 'thu-03', name: 'Storm Call', archetype: 'thunder', cost: 2, dmg: 5, heal: 0, draw: 0, energy: 0, shield: 0, rarity: 'common', text: 'Deal 5 damage.' },
  { id: 'thu-04', name: 'Chain Lightning', archetype: 'thunder', cost: 2, dmg: 4, heal: 0, draw: 0, energy: 1, shield: 0, rarity: 'rare', text: 'Deal 4. Gain 1 energy.' },
  { id: 'thu-05', name: 'Overcharge', archetype: 'thunder', cost: 2, dmg: 0, heal: 0, draw: 0, energy: 2, shield: 0, rarity: 'rare', text: 'Gain 2 energy.' },
  { id: 'thu-06', name: 'Thunderhead', archetype: 'thunder', cost: 3, dmg: 7, heal: 0, draw: 0, energy: 0, shield: 0, rarity: 'rare', text: 'Deal 7 damage.' },
  { id: 'thu-07', name: 'Rolling Peal', archetype: 'thunder', cost: 2, dmg: 3, heal: 3, draw: 0, energy: 0, shield: 0, rarity: 'rare', text: 'Deal 3. Restore 3 life.' },
  { id: 'thu-08', name: 'Sky Splitter', archetype: 'thunder', cost: 3, dmg: 9, heal: 0, draw: 0, energy: 0, shield: 0, rarity: 'epic', text: 'Deal 9 damage.' },
  { id: 'thu-09', name: 'Tempest', archetype: 'thunder', cost: 3, dmg: 6, heal: 0, draw: 1, energy: 0, shield: 0, rarity: 'epic', text: 'Deal 6. Draw a card.' },
  { id: 'thu-10', name: 'The Storm Itself', archetype: 'thunder', cost: 3, dmg: 12, heal: 0, draw: 0, energy: 0, shield: 0, rarity: 'legendary', text: 'Deal 12 damage. Feel the sky break.' },
];

export function cardById(id) {
  return CARDS.find((c) => c.id === id);
}

// One 30-card deck: every distinct card once. A fresh copy per player.
export function buildDeck() {
  return CARDS.map((c) => c.id);
}
