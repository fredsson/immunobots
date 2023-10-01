import { EventPublisher } from "../utils/event-publisher";
import { Vec2 } from "../utils/vec";
import { Bullet } from "./bullet";
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

  public positionChanged = this.eventPublisher.define<Vec2>('positionChanged');
  public bulletCreated = this.eventPublisher.define<Bullet>('bulletCreated');
  public bulletRemoved = this.eventPublisher.define<number>('bulletRemoved');

  private activeMovement: {key: string, direction: Vec2}[] = [];

  private currentMouseDirection: Vec2 = {x: 0, y: -1};

  private bullets: Bullet[] = [];
  private nextBulletId = 0;

  constructor(private collisionManager: CollisionManager, screenSize: Vec2) {
    this.eventPublisher.emit('positionChanged', this.currentPosition);

    window.addEventListener('mousemove', (event) => {
      // get vector from center of screen
      const center = {
        x: screenSize.x / 2,
        y: screenSize.y / 2
      };

      this.currentMouseDirection = Vec2.normalize(Vec2.sub({x: event.x, y: event.y}, center));
      console.log(this.currentMouseDirection);

    }, {signal: this.abortController.signal});

    window.addEventListener('keydown', (event) => {
      const movement = MovementByKey[event.key];
      const containsKey = this.activeMovement.map(v => v.key).some(v => v === event.key);

      if (movement && !containsKey) {
        this.activeMovement.push({ key: event.key, direction: movement });
      }

      if (event.key === ' ') {
        const bullet = new Bullet(
          ++this.nextBulletId,
          this.collisionManager,
          (id) => this.removeBullet(id),
          this.currentPosition,
          this.currentMouseDirection
        );
        this.bullets.push(bullet);
        this.eventPublisher.emit('bulletCreated', bullet);
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
    this.bullets.forEach(b => b.update(dt));

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

  private removeBullet(id: number): void {
    this.bullets = this.bullets.filter(b => b.id !== id);
    this.eventPublisher.emit('bulletRemoved', id);
  }
}
