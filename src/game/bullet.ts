import { EventPublisher, Observable } from "../utils/event-publisher";
import { Vec2 } from "../utils/vec";
import { CollisionManager, CollisionRect } from "./collision-manager";
const BulletSpeed = 10;

export class Bullet {
  private eventPublisher: EventPublisher = new EventPublisher();

  public positionChanged: Observable<Vec2> = this.eventPublisher.define('positionChanged');

  private currentPosition: Vec2;

  public size: Vec2 = {
    x: 0,
    y: 0
  }

  constructor(
    public readonly id: number,
    private collisionManager: CollisionManager,
    private destroyCallback: (id: number) => void,
    startPosition: Vec2,
    private movementDirection: Vec2
  ) {
    this.currentPosition = startPosition;
  }

  public update(dt: number): void {
    const potentialPosition = {
      x: this.currentPosition.x + (BulletSpeed * this.movementDirection.x * dt),
      y: this.currentPosition.y + (BulletSpeed * this.movementDirection.y * dt)
    }

    if (this.collisionFromCenter(potentialPosition)) {
      this.destroyCallback(this.id);
      return;
    }

    this.currentPosition = potentialPosition;
    this.eventPublisher.emit('positionChanged', this.currentPosition);
  }

  public get collisionRect(): CollisionRect {
    return {
      position: this.currentPosition,
      size: {x: 32, y: 32}
    };
  }

  public onCollision() {
    this.destroyCallback(this.id);
  }

  private collisionFromCenter(potentialPosition: Vec2) {
    const offsetedPosition = {
      x: potentialPosition.x - 16,
      y: potentialPosition.y - 16,
    };

    return this.collisionManager.collides({position: offsetedPosition, size: {x: 32, y: 32}})
  }
};
