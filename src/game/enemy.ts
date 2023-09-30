import { EventPublisher, Observable } from "../utils/event-publisher";
import { Vec2 } from "../utils/vec";

export interface Enemy {
  id: number;
  positionChanged: Observable<Vec2>;
}


export class Bacteria implements Enemy {
  private eventPublisher = new EventPublisher();

  public positionChanged = this.eventPublisher.define<Vec2>('positionChanged');

  constructor(public id: number, private startPosition: Vec2) {
    this.eventPublisher.emit('positionChanged', this.startPosition);
  }
}
