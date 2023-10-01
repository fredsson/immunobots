import { EventPublisher, Observable } from "../utils/event-publisher";
import { Vec2 } from "../utils/vec";
import { CollisionManager } from "./collision-manager";

const PlayerSpeed = 5;

const MovementByKey: Record<string, Vec2> = {
  w: {x: 0, y: -1},
  a: {x: -1, y: 0},
  s: {x: 0, y: 1},
  d: {x: 1, y: 0},
}

export class Player {
  private eventPublisher: EventPublisher = new EventPublisher();
  private currentPosition: Vec2 = {x: 800, y: 800};

  private abortController = new AbortController();

  public positionChanged: Observable<Vec2> = this.eventPublisher.define('positionChanged');

  private activeMovement: {key: string, direction: Vec2}[] = [];

  constructor(private collisionManager: CollisionManager) {
    this.eventPublisher.emit('positionChanged', this.currentPosition);
    window.addEventListener('keydown', (event) => {
      const movement = MovementByKey[event.key];
      const containsKey = this.activeMovement.map(v => v.key).some(v => v === event.key);

      if (movement && !containsKey) {
        this.activeMovement.push({ key: event.key, direction: movement });
      }
    }, {signal: this.abortController.signal});

    window.addEventListener('keyup', (event) => {
      this.activeMovement = this.activeMovement.filter(am => am.key !== event.key);
    }, {signal: this.abortController.signal});
  }

  public init(startPosition: Vec2) {
    this.currentPosition = startPosition;

    this.eventPublisher.emit('positionChanged', this.currentPosition);
  }

  public update(dt: number): void {
    const {x: dx, y: dy} = this.calculateMovement();
    if (dx !== 0 || dy !== 0) {
      const potentialPosition = {
        x: Math.round(this.currentPosition.x + PlayerSpeed * dx * dt),
        y: Math.round(this.currentPosition.y + PlayerSpeed * dy * dt),
      };

      if(!this.collisionFromCenter(potentialPosition)) {
        this.currentPosition = potentialPosition;
        this.eventPublisher.emit('positionChanged', this.currentPosition);
      }
    }
  }

  public destroy(): void {
    this.abortController.abort();
  }

  private calculateMovement(): Vec2 {
    return Vec2.normalize(this.activeMovement
      .map(v => v.direction)
      .reduce((acc, value) => Vec2.add(acc, value), {x: 0, y: 0}));
  }

  private collisionFromCenter(potentialPosition: Vec2) {
    const offsetedPosition = {
      x: potentialPosition.x - 32,
      y: potentialPosition.y - 32,
    };

    return this.collisionManager.collides({position: offsetedPosition, size: {x: 64, y: 64}})
  }
}
