import { EventPublisher, Observable } from "../utils/event-publisher";
import { Vec2 } from "../utils/vec";

export class Player {
  private eventPublisher: EventPublisher = new EventPublisher();
  private currentPosition: Vec2 = {x: 500, y: 500};

  public positionChanged: Observable<Vec2> = this.eventPublisher.define('positionChanged');

  constructor() {
    this.eventPublisher.emit('positionChanged', this.currentPosition);
    window.addEventListener('keydown', (event) => {
      if (event.key === 'w') {
        this.currentPosition.x += 10;
        this.eventPublisher.emit('positionChanged', this.currentPosition);
      }
    });
  }

}
