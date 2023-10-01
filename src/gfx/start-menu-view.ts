import { GameView } from "./renderer";


export class StartMenuView implements GameView {
  public static create(container: HTMLElement): StartMenuView {
    const view = new StartMenuView(container);
    view.init();
    return view;
  }

  private textElement: HTMLElement;

  private constructor(private container: HTMLElement, ) {
    this.textElement = document.createElement('div');
    this.textElement.className = 'menu-text-container';
    this.textElement.innerText = 'Press Any Key to Start!';

    container.appendChild(this.textElement);
  }

  init(): void {
  }

  destroy(): void {
    this.container.removeChild(this.textElement);
  }
}
