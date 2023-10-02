import { GameView } from "./renderer";


export class StartMenuView implements GameView {
  public static create(container: HTMLElement): StartMenuView {
    const view = new StartMenuView(container);
    view.init();
    return view;
  }

  private textElement: HTMLElement;
  private titleElement: HTMLImageElement;

  private constructor(private container: HTMLElement, ) {
    this.textElement = document.createElement('div');
    this.textElement.className = 'menu-text-container';
    this.textElement.innerText = 'Press Any Key to Start!';

    container.appendChild(this.textElement);

    this.titleElement = document.createElement('img');
    this.titleElement.src = 'assets/gfx/title.png';
    this.titleElement.className = 'menu-image';

    container.appendChild(this.titleElement);
  }

  init(): void {
  }

  destroy(): void {
    this.container.removeChild(this.textElement);
    this.container.removeChild(this.titleElement);
  }
}
