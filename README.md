[![make.fun](https://make.fun/badge/best-card-game-20261122-1826.svg)](https://make.fun/bounty/best-card-game-20261122-1826)
[![rank](https://make.fun/badge/best-card-game-20261122-1826/lathixbt/cardgame-acct4/rank.svg)](https://make.fun/bounty/best-card-game-20261122-1826)
[![reward](https://make.fun/badge/best-card-game-20261122-1826/lathixbt/cardgame-acct4/reward.svg)](https://make.fun/bounty/best-card-game-20261122-1826)

# ECHO DUEL — a memory duel

A card duel where playing a card **echoes** the one before it. Match the
archetype of the last card played and its effect repeats at half power — chain
matches to grow the echo, or break the chain before Mira does. You and Mira
the Echo Warden both have 20 life and 3 energy a turn; 30 distinct cards in
three archetypes (Echo, Silence, Thunder) decide who remembers best.

## Concept

Every hand is a decision about order, not just power: a weak card played at
the right moment echoes a strong one, and a chain-break at the right moment
denies the opponent the same. Mira scores every card she could play —
damage, healing when hurt, drawing, energy, and the echo bonus — so her
choices are readable and counterable.

## How to run

Serve `game/` with any static server and open it in desktop Chrome, for
example `node serve.ts` (or `python3 -m http.server` inside `game/`), then
open http://localhost:8080. The game loads nothing from the network: all
scripts, styles and sounds are files under `game/` or synthesised in code.

## Rules

- **Goal:** reduce Mira to 0 life. Both sides start at 20 life, 3 energy.
- **Play a card** by clicking it (or keys 1–7 to select, Enter to play).
  It costs energy; you draw a card at the start of your turn.
- **The echo:** a card matching the last card's archetype repeats that
  card's main effect at half strength. The echo counter grows with matches.
- **Breaking the chain:** a different archetype resets the chain; breaking
  a chain of 2 or more pays 1 bonus energy.
- **Shield** blocks damage. An empty deck reshuffles your discard pile.
- **End your turn** to let Mira play. First to 0 life loses.
- Keyboard: 1–7 select, Enter play, Esc menu, R restart. Mute toggle
  in the top bar. Sounds are synthesised with WebAudio — no audio files.

## Files

- `game/index.html` — the page; `game/css/style.css` — the violet/mist look.
- `game/js/cards.js` — the 30 cards; `game/js/state.js` — state and shuffle.
- `game/js/echo.js` — the echo chain; `game/js/rules.js` — turns and effects.
- `game/js/ai.js` — Mira's heuristic; `game/js/render.js` — the table.
- `game/js/input.js` — mouse and keyboard; `game/js/audio.js` — synth sounds.
- `game/js/main.js` — bootstrap, AI turns, screenshot hooks.
- `main.ts` — hands the game in (copies `game/` + `screenshots/`, writes
  `dossier.json` with the vendored `vendor/makefun-game.ts`).
