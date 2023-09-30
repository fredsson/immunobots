import { Rectangle } from "pixi.js";
import { Observable, Subscription } from "../utils/event-publisher";
import { Vec2 } from "../utils/vec";



export interface Camera {
  toScreenSpace(position: Vec2): Vec2;
}

export class CenteredCamera implements Camera {
  private offset: Vec2 = {
    x: 0,
    y: 0
  };
  private screenCenter: Vec2;
  private positionSubscription: Subscription;

  constructor(screen: Rectangle, target: Observable<Vec2>) {
    this.screenCenter = {
      x: screen.width / 2,
      y: screen.height / 2,
    };

    this.positionSubscription = target.subscribe((position) => {
      this.offset = Vec2.sub(position, this.screenCenter);
    });
  }

  public toScreenSpace(position: Vec2): Vec2 {
    return Vec2.sub(position, this.offset);
  }

  public destroy() {
    this.positionSubscription();
  }

}
