import { EventPublisher, Observable } from "../utils/event-publisher";
import { Vec2 } from "../utils/vec";
import { Bullet } from "./bullet";
import { CollisionManager } from "./collision-manager";
import { Bacteria, Enemy } from "./enemy";
import { Player } from "./player";
import { Zone } from "./zone";

export class Game {
  private collisionManager = new CollisionManager();

  private player: Player;
  private zone?: Zone;

  private enemies: Enemy[] = [];

  private eventPublisher = new EventPublisher();

  public playerPositionChanged: Observable<Vec2>;
  public bulletCreated: Observable<Bullet>;
  public bulletRemoved: Observable<number>;

  public enemyCreated: Observable<Enemy> = this.eventPublisher.define('enemyCreated');

  public zoneLoaded: Observable<Zone> = this.eventPublisher.define('zoneLoaded');


  constructor(screenSize: Vec2) {
    this.player = new Player(this.collisionManager, screenSize);
    this.playerPositionChanged = this.player.positionChanged;
    this.bulletCreated = this.player.bulletCreated;
    this.bulletRemoved = this.player.bulletRemoved;

    Zone.load('demo', this.collisionManager).then(z => {
      this.zone = z;
      this.player.init(this.zone.playerStartPosition);
      this.eventPublisher.emit('zoneLoaded', this.zone);

      const enemy = new Bacteria(1, {...this.zone.randomEnemyStartPosition()});
      this.enemies.push(enemy);
      this.eventPublisher.emit('enemyCreated', enemy);
    });

  }

  public destroy() {
    this.player.destroy();
    this.zone?.destroy();
  }

  public update(dt: number) {
    this.player.update(dt);
  }

}
