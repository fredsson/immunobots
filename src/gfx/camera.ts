import { Rectangle } from "pixi.js";
import { EventPublisher, Observable, Subscription } from "../utils/event-publisher";
import { Vec2 } from "../utils/vec";



export interface Camera {
  toScreenSpace(position: Vec2): Vec2;
  positionChanged: Observable<Vec2>;
}

export class CenteredCamera implements Camera {
  private offset: Vec2 = {
    x: 0,
    y: 0
  };
  private screenCenter: Vec2;
  private positionSubscription: Subscription;

  private eventPublisher: EventPublisher = new EventPublisher();

  public positionChanged = this.eventPublisher.define<Vec2>('positionChanged');

  constructor(screen: Rectangle, target: Observable<Vec2>) {
    this.screenCenter = {
      x: Math.round(screen.width / 2),
      y: Math.round(screen.height / 2),
    };

    this.positionSubscription = target.subscribe((position) => {
      this.offset = Vec2.sub(position, this.screenCenter);
      this.eventPublisher.emit('positionChanged', undefined);
    });
  }

  public toScreenSpace(position: Vec2): Vec2 {
    return Vec2.sub(position, this.offset);
  }

  public destroy() {
    this.positionSubscription();
  }

}
