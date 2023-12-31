import { EventPublisher } from "../utils/event-publisher";

export class EndMenu {
  private eventPublisher = new EventPublisher();
  private abortController = new AbortController();

  public anyButtonClicked = this.eventPublisher.define('buttonClicked');

  constructor() {
    window.addEventListener('keyup', event => {
      if (event.key === 'Enter') {
        this.eventPublisher.emit('buttonClicked', undefined);
      }
    }, {signal: this.abortController.signal});
  }

  public destroy() {
    this.abortController.abort();
  }
}
