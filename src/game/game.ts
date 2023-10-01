import { EventPublisher, Observable, Subscription } from "../utils/event-publisher";
import { Vec2 } from "../utils/vec";
import { Bullet } from "./bullet";
import { CollisionManager } from "./collision-manager";
import { Bacteria, Enemy } from "./enemy";
import { HealthService } from "./health-service";
import { Player } from "./player";
import { Zone } from "./zone";

export class Game {
  private totalEnemies = 10;

  private collisionManager = new CollisionManager();

  private player: Player;
  private zone?: Zone;

  private healthService = new HealthService(this.totalEnemies);

  private enemies: Record<number,{enemy: Enemy, sub: Subscription}> = {};
  private nextEnemyId = 1;

  private eventPublisher = new EventPublisher();

  // win condition, kill all enemies before health reaches 0
  private noOfEnemiesLeftToSpawn = this.totalEnemies;

  private spawnTimerId: number | undefined;

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

      this.scheduleEnemyToBeSpawned();
    });
  }

  public destroy() {
    this.player.destroy();
    this.zone?.destroy();
    if (this.spawnTimerId) {
      window.clearTimeout(this.spawnTimerId);
    }
  }

  public update(dt: number) {
    this.player.update(dt);
    Object.values(this.enemies).forEach(e => e.enemy.update(dt));

    this.decreaseHealthBasedOnEnemiesAlive(dt);
  }

  private decreaseHealthBasedOnEnemiesAlive(dt: number) {
    const enemiesAlive = Object.values(this.enemies).length;
    this.healthService.removeBasedOnEnemies(enemiesAlive, dt);
  }

  private scheduleEnemyToBeSpawned() {
    if (this.noOfEnemiesLeftToSpawn <= 0) {
      return;
    }
    this.noOfEnemiesLeftToSpawn--;
    this.spawnTimerId = window.setTimeout(() => {
      if (this.zone) {
        this.spawnEnemy(this.zone);
      }
    }, 1000 + (Math.random() * 2500));
  }

  private spawnEnemy(zone: Zone) {
    const enemy = new Bacteria(this.collisionManager, ++this.nextEnemyId, {...zone.nextEnemyStartPosition()});
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
    this.scheduleEnemyToBeSpawned();
  }
}
