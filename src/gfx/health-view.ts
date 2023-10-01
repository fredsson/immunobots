import { Observable, Subscription } from "../utils/event-publisher";
import { GameView } from "./renderer";


export class HealthView implements GameView {
  public static MaxWidthInPixels = 500;
  public static create(container: HTMLElement, healthChanged: Observable<number>): HealthView {
    const view = new HealthView(container, healthChanged);
    view.init();

    return view;
  }

  private healthContainer: HTMLElement;
  private healthbar: HTMLElement;

  private healthChangedSub: Subscription;

  private constructor(private container: HTMLElement, healthChanged: Observable<number>) {
    this.healthContainer = document.createElement('div');
    this.healthContainer.id = 'health-container';

    this.healthbar = document.createElement('div');
    this.healthbar.id = 'health-bar';

    container.appendChild(this.healthContainer);
    container.appendChild(this.healthbar);

    this.healthChangedSub = healthChanged.subscribe(health => {
      const currentHealthInPixels = (health / 100) * HealthView.MaxWidthInPixels;

      this.healthbar.style.width = `${currentHealthInPixels}px`;


    });
  }

  init(): void {
  }

  destroy(): void {
    this.healthChangedSub();

    this.container.removeChild(this.healthContainer);
    this.container.removeChild(this.healthbar);

  }
}
