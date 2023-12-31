import { Vec2 } from "../utils/vec";

export interface CollisionObject {
  id: number;
  collisionRect: CollisionRect;
  onCollision: () => void;
}

export interface CollisionRect {
  position: Vec2;
  size: Vec2;
}

export class CollisionManager {
  private staticObjects: CollisionRect[] = [];

  private bullets: Record<number, CollisionObject> = {};
  private player?: CollisionObject;

  public addZoneTile(rect: CollisionRect): void {
    this.staticObjects.push(rect);
  }


  public addPlayer(player: CollisionObject): void {
    this.player = player;
  }

  public addBullet(bullet: CollisionObject): void {
    this.bullets[bullet.id] = bullet
  }

  public removeBullet(id: number): void {
    delete this.bullets[id];
  }

  public collides(rect: CollisionRect): boolean {
    const staticCollisions = this.staticObjects.filter(o => this.boxCollision(rect, o));
    return staticCollisions.length > 0;
  }

  public collidesWithBullet(rect: CollisionRect): boolean {
    const bulletCollisions = Object.values(this.bullets).filter(v => this.boxCollision(rect, v.collisionRect));

    if (bulletCollisions.length) {
      bulletCollisions[0].onCollision();
    }
    return bulletCollisions.length > 0;
  }

  public collidesWithPlayer(rect: CollisionRect): boolean {
    if (!this.player) {
      return false;
    }

    const collides = this.boxCollision(rect, this.player.collisionRect);
    if (collides) {
      this.player.onCollision();
    }

    return collides;
  }

  private boxCollision(rect: CollisionRect, o: CollisionRect): boolean {
    const insideX = rect.position.x < o.position.x + o.size.x && rect.position.x + rect.size.x > o.position.x;
    const insideY = rect.position.y < o.position.y + o.size.y && rect.position.y + rect.size.y > o.position.y;

    return insideX && insideY;
  }
}
