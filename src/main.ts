import { Application } from "pixi.js";
import { Game } from "./game/game";
import { Renderer } from "./gfx/renderer";


window.addEventListener('DOMContentLoaded', () => {
  const container: HTMLElement | null = document.querySelector('#app');
  if (!container) {
    console.error('Could not find container for the game!');
    return;
  }
  const app = new Application({ backgroundColor: '#1099bb', resizeTo: container});
  container.appendChild(app.view as any);
  const game = new Game();
  const renderer = new Renderer(app, game.playerPositionChanged);

  app.ticker.add((dt) => game.update(dt));
})
