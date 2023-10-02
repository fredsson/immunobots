import { GameView } from "./renderer";

export class EndMenuView implements GameView {
  public static create(container: HTMLElement, won: boolean, healthLeft: number): EndMenuView {
    const view = new EndMenuView(container, won, healthLeft);
    view.init();

    return view;
  }

  private endTextElement: HTMLElement;
  private restartTextElement: HTMLElement;

  private constructor(private container: HTMLElement, won: boolean, healthLeft: number) {
    this.endTextElement = document.createElement('div');
    this.endTextElement.className = 'menu-text-container';

    const endText = won ? `Congratulations, you eliminated all the invaders with ${Math.round(healthLeft)} health left!` : `The patient died before you could eliminate all threats!`;
    this.endTextElement.innerText = endText;

    container.appendChild(this.endTextElement);

    this.restartTextElement = document.createElement('div');
    this.restartTextElement.className = 'menu-text-container menu-text-container--second';
    this.restartTextElement.innerText = 'Press Enter to play again!';
    container.appendChild(this.restartTextElement);
  }

  init(): void {
  }
  destroy(): void {
    this.container.removeChild(this.endTextElement);
    this.container.removeChild(this.restartTextElement);
  }
}
