import { GameView } from "./renderer";

export class EndMenuView implements GameView {
  public static create(container: HTMLElement, won: boolean): EndMenuView {
    const view = new EndMenuView(container, won);
    view.init();

    return view;
  }

  private endTextElement: HTMLElement;

  private constructor(private container: HTMLElement, won: boolean) {
    this.endTextElement = document.createElement('div');
    this.endTextElement.className = 'menu-text-container';

    const endText = won ? `Congratulations, you eliminated all the invaders!` : `The patient died before you could eliminate all threats!`;
    this.endTextElement.innerText = endText;

    container.appendChild(this.endTextElement);
  }

  init(): void {
  }
  destroy(): void {
    this.container.removeChild(this.endTextElement);
  }
}
