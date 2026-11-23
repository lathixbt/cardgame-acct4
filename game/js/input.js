// input.js — mouse and keyboard. Click a card to select it, click again (or
// press Enter) to play it. Number keys 1-7 select a hand card, Enter plays,
// Esc opens the menu (title screen), R restarts the duel.
export function bindInput(ui) {
  document.addEventListener('keydown', (event) => {
    if (ui.screen !== 'table') {
      if (event.key === 'Enter' && (ui.screen === 'title' || ui.screen === 'end')) ui.onStart();
      return;
    }
    if (event.key >= '1' && event.key <= '7') {
      const index = Number(event.key) - 1;
      const id = ui.handIds()[index];
      if (id) ui.onCardClick(id);
    } else if (event.key === 'Enter') {
      if (ui.selected) ui.onPlaySelected();
    } else if (event.key === 'Escape') {
      ui.onMenu();
    } else if (event.key === 'r' || event.key === 'R') {
      ui.onRestart();
    }
  });
}
