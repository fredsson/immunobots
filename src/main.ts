import { Application } from "pixi.js";
import { Game } from "./game/game";
import { Renderer } from "./gfx/renderer";
import { StartMenu } from "./game/start-menu";
import { AudioService } from "./sfx/audio-service";
import { EndMenu } from "./game/end-menu";
import { Subscription } from "./utils/event-publisher";


window.addEventListener('DOMContentLoaded', () => {
  const container: HTMLElement | null = document.querySelector('#app');
  if (!container) {
    console.error('Could not find container for the game!');
    return;
  }

  const app = new Application({ backgroundColor: '#1099bb', resizeTo: container});
  container.appendChild(app.view as any);

  const audioService = new AudioService();

  const game = new Game({x: app.screen.width , y: app.screen.height});
  const renderer = new Renderer(
    container,
    app,
    game.playerPositionChanged,
    game.zoneLoaded,
    game.bulletCreated,
    game.bulletRemoved,
    game.healthChanged
  );

  let startMenu = new StartMenu();
  renderer.showStartMenu();

  let subscriptions: Subscription[] = [];

  const runGame = () => {
    startMenu.destroy();
    game.init();
    renderer.init();

    audioService.startBackground();

    subscriptions.push(game.bulletCreated.subscribe(() => {
      audioService.playShootSound();
    }));

    subscriptions.push(game.enemyKilled.subscribe(() => {
      audioService.playEnemyDeathSound();
    }));

    subscriptions.push(game.enemyCreated.subscribe(enemy => {
      renderer.enemyCreated(enemy.id, enemy.positionChanged);
    }));

    subscriptions.push(game.enemyKilled.subscribe(id => {
      renderer.enemyKilled(id);
    }));

    const ticker = app.ticker.add((dt) => game.update(dt));

    const showEndScreen = (won: boolean, healthLeft: number = 0) => {
      ticker.stop();
      game.destroy();
      renderer.destroy();
      audioService.destroy();

      let endMenu = new EndMenu();

      subscriptions.forEach(s => s());
      subscriptions = [];

      renderer.showEndMenu(won, healthLeft);
      endMenu.anyButtonClicked.subscribe(() => {
        location.reload();
      });
    }

    subscriptions.push(game.playerDied.subscribe(() => showEndScreen(false)));
    subscriptions.push(game.playerWon.subscribe(healthLeft => showEndScreen(true, healthLeft)));
  }


  startMenu.anyButtonClicked.subscribe(() => {
    runGame();
  });

});
