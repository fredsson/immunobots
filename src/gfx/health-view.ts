import { Enemy } from "../game/enemy";
import { Observable, Subscription } from "../utils/event-publisher";
import { GameView } from "./renderer";


export class HealthView implements GameView {
  public static MaxWidthInPixels = 500;
  public static create(container: HTMLElement, healthChanged: Observable<number>, enemyCreated: Observable<Enemy>, enemyKilled: Observable<number>): HealthView {
    const view = new HealthView(container, healthChanged, enemyCreated, enemyKilled);
    view.init();

    return view;
  }

  private healthContainer: HTMLElement;
  private healthbar: HTMLElement;

  private enemiesAliveTextElement: HTMLElement;
  private enemiesAliveIconElement: HTMLElement;

  private enemiesAlive = 0;

  private subscriptions: Subscription[] = [];

  private constructor(private container: HTMLElement, healthChanged: Observable<number>, enemyCreated: Observable<Enemy>, enemyKilled: Observable<number>) {
    this.healthContainer = document.createElement('div');
    this.healthContainer.id = 'health-container';

    this.healthbar = document.createElement('div');
    this.healthbar.id = 'health-bar';

    this.enemiesAliveTextElement = document.createElement('div');
    this.enemiesAliveTextElement.innerText = `${this.enemiesAlive}`;
    this.enemiesAliveTextElement.id = 'enemies-alive-text';

    this.enemiesAliveIconElement = document.createElement('div');
    this.enemiesAliveIconElement.id = 'enemies-alive-icon';

    container.appendChild(this.healthContainer);
    container.appendChild(this.healthbar);
    container.appendChild(this.enemiesAliveTextElement);
    container.appendChild(this.enemiesAliveIconElement);

    this.subscriptions.push(healthChanged.subscribe(health => {
      const currentHealthInPixels = (health / 100) * HealthView.MaxWidthInPixels;

      this.healthbar.style.width = `${currentHealthInPixels}px`;
    }));

    this.subscriptions.push(enemyCreated.subscribe(() => {
      this.enemiesAlive++;
      this.enemiesAliveTextElement.innerText = `${this.enemiesAlive}`;
    }));
    this.subscriptions.push(enemyKilled.subscribe(() => {
      this.enemiesAlive--;
      this.enemiesAliveTextElement.innerText = `${this.enemiesAlive}`;
    }));
  }

  init(): void {
  }

  destroy(): void {
    this.enemiesAlive = 0;
    this.subscriptions.forEach(s => s());
    this.subscriptions = [];

    this.container.removeChild(this.healthContainer);
    this.container.removeChild(this.healthbar);
    this.container.removeChild(this.enemiesAliveTextElement);
    this.container.removeChild(this.enemiesAliveIconElement);

  }
}
