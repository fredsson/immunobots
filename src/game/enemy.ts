import { EventPublisher, Observable } from "../utils/event-publisher";
import { Vec2 } from "../utils/vec";
import { CollisionManager } from "./collision-manager";

const EnemeySpeed = 5;

export interface Enemy {
  id: number;
  positionChanged: Observable<Vec2>;

  update(dt: number): void;
  destroy(): void;
}


export class Bacteria implements Enemy {
  private eventPublisher = new EventPublisher();

  public positionChanged = this.eventPublisher.define<Vec2>('positionChanged');
  public killed = this.eventPublisher.define<number>('enemyKilled');

  private movementDirection: Vec2;
  private currentPosition: Vec2;

  private noOfFramesStuck = 0;

  constructor(private collisionManager: CollisionManager, public id: number, startPosition: Vec2) {
    this.currentPosition = startPosition;
    this.movementDirection = Vec2.normalize({
      x: (Math.random() * 2) - 1,
      y: (Math.random() * 2) - 1
    });

    this.eventPublisher.emit('positionChanged', startPosition);
  }

  public update(dt: number): void {
    if (this.collisionWithBullet() || this.collisionWithPlayer()) {
      this.eventPublisher.emit('enemyKilled', this.id);
    }

    const potentialPosition = {
      x: this.currentPosition.x + (this.movementDirection.x * EnemeySpeed * dt),
      y: this.currentPosition.y + (this.movementDirection.y * EnemeySpeed * dt),
    };

    if (this.collisionFromCenter(potentialPosition)) {
      this.noOfFramesStuck++;
      if (this.noOfFramesStuck > 10) {
        this.movementDirection = {
          x: -this.movementDirection.x,
          y: -this.movementDirection.y
        };
      }
      return;
    }
    this.noOfFramesStuck = 0;

    this.currentPosition = potentialPosition;

    this.eventPublisher.emit('positionChanged', this.currentPosition);
  }

  public destroy() {
  }

  private collisionFromCenter(potentialPosition: Vec2) {
    const directions = [
      {position: {x: potentialPosition.x - 32, y: potentialPosition.y}, blah: {x: -1, y: 1}},
      {position: {x: potentialPosition.x + 32, y: potentialPosition.y}, blah: {x: -1, y: 1}},
      {position: {x: potentialPosition.x, y: potentialPosition.y - 32}, blah: {x: 1, y: -1}},
      {position: {x: potentialPosition.x, y: potentialPosition.y + 32}, blah: {x: 1, y: -1}},
    ]

    let collided = false;
    directions.forEach(d => {
      if (this.collisionManager.collides({position: d.position, size: {x: 2, y: 2}})) {
        this.movementDirection = {
          x: d.blah.x * this.movementDirection.x,
          y: d.blah.y * this.movementDirection.y
        }
        collided = true;
      }
    });

    return collided;
  }

  private collisionWithBullet() {
    const offsetedPosition = {
      x: this.currentPosition.x - 32,
      y: this.currentPosition.y - 32,
    };

    return this.collisionManager.collidesWithBullet({position: offsetedPosition, size: {x: 64, y: 64}});
  }

  private collisionWithPlayer() {
    const offsetedPosition = {
      x: this.currentPosition.x - 32,
      y: this.currentPosition.y - 32,
    };

    return this.collisionManager.collidesWithPlayer({position: offsetedPosition, size: {x: 64, y: 64}});
  }
}
