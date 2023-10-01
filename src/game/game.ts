import { EventPublisher, Observable, Subscription } from "../utils/event-publisher";
import { Vec2 } from "../utils/vec";
import { Bullet } from "./bullet";
import { CollisionManager } from "./collision-manager";
import { Bacteria, Enemy } from "./enemy";
import { HealthService } from "./health-service";
import { Player } from "./player";
import { Zone } from "./zone";

export class Game {
  private collisionManager = new CollisionManager();

  private player: Player;
  private zone?: Zone;

  private healthService = new HealthService();

  private enemies: Record<number,{enemy: Enemy, sub: Subscription}> = {};

  private eventPublisher = new EventPublisher();

  public playerPositionChanged: Observable<Vec2>;
  public bulletCreated: Observable<Bullet>;
  public bulletRemoved: Observable<number>;
  public healthChanged: Observable<number> = this.healthService.healthChanged;

  public enemyCreated: Observable<Enemy> = this.eventPublisher.define('enemyCreated');
  public enemyKilled: Observable<number> = this.eventPublisher.define('enemyKilled');

  public zoneLoaded: Observable<Zone> = this.eventPublisher.define('zoneLoaded');


  constructor(screenSize: Vec2) {
    this.player = new Player(this.collisionManager, screenSize);
    this.collisionManager.addPlayer(this.player);
    this.playerPositionChanged = this.player.positionChanged;
    this.bulletCreated = this.player.bulletCreated;
    this.bulletRemoved = this.player.bulletRemoved;

    this.player.collision.subscribe(() => {
      this.healthService.remove(10);
    });

    Zone.load('demo', this.collisionManager).then(z => {
      this.zone = z;
      this.player.init(this.zone.playerStartPosition);
      this.eventPublisher.emit('zoneLoaded', this.zone);

      this.spawnEnemy(z);
    });
  }

  public destroy() {
    this.player.destroy();
    this.zone?.destroy();
  }

  public update(dt: number) {
    this.player.update(dt);
    Object.values(this.enemies).forEach(e => e.enemy.update(dt));
  }

  private spawnEnemy(zone: Zone) {
    const enemy = new Bacteria(this.collisionManager, 1, {...zone.randomEnemyStartPosition()});
    const enemySub = enemy.killed.subscribe(id => {
      const entry = this.enemies[id];
      delete this.enemies[id];
      entry.enemy.destroy();
      entry.sub();
      this.eventPublisher.emit('enemyKilled', id);
    });
    this.enemies[enemy.id] = {
      enemy,
      sub: enemySub
    };
    this.eventPublisher.emit('enemyCreated', enemy);
  }
}
