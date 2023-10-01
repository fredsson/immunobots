import { Vec2 } from "../utils/vec";

export interface CollisionObject {
  id: number;
  rect: CollisionRect;
  callback: () => void;
}

export interface CollisionRect {
  position: Vec2;
  size: Vec2;
}

export class CollisionManager {
  private staticObjects: CollisionRect[] = [];

  public addZoneTile(rect: CollisionRect): void {
    this.staticObjects.push(rect);
  }

  public collides(rect: CollisionRect): boolean {
    const staticCollisions = this.staticObjects.filter(o => {
      const insideX = rect.position.x < o.position.x + o.size.x && rect.position.x + rect.size.x > o.position.x;
      const insideY = rect.position.y < o.position.y + o.size.y && rect.position.y + rect.size.y > o.position.y;

      return insideX && insideY;
    });
    return staticCollisions.length > 0;
  }
}
