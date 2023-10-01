import { Application } from "pixi.js";
import { PlayerView } from "./player-view";
import { Camera, CenteredCamera } from "./camera";
import { Observable } from "../utils/event-publisher";
import { Vec2 } from "../utils/vec";
import { ZoneView } from "./zone-view";
import { Zone } from "../game/zone";
import { EnemyView } from "./enemy-view";
import { BulletView } from "./bullet-view";
import { Bullet } from "../game/bullet";
import { HealthView } from "./health-view";
import { StartMenuView } from "./start-menu-view";

export interface GameView {
  init(): void;
  destroy(): void;
}

export class Renderer {
  private camera: Camera;
  private views: GameView[] = [];

  private enemyViews: Record<number, EnemyView> = {};
  private bulletViews: Record<number, BulletView> = {};

  private startMenuView: StartMenuView | undefined;

  constructor(
    private container: HTMLElement,
    private application: Application,
    private playerPositionChanged: Observable<Vec2>,
    private zoneLoaded: Observable<Zone>,
    private bulletCreated: Observable<Bullet>,
    private bulletRemoved: Observable<number>,
    private healthChanged: Observable<number>
  ) {
    this.camera = new CenteredCamera(this.application.screen, this.playerPositionChanged);
  }

  public init() {
    this.startMenuView?.destroy();

    this.application.stage.sortableChildren = true;
    this.views.push(PlayerView.create(this.application.stage, this.camera, this.playerPositionChanged));
    this.zoneLoaded.subscribe(zone => {
      this.views.push(ZoneView.create(this.application.stage, this.camera, zone));
    });

    this.views.push(HealthView.create(this.container, this.healthChanged));

    this.bulletCreated.subscribe(bullet => {
      this.bulletViews[bullet.id] = BulletView.create(this.application.stage, this.camera, bullet);
    });

    this.bulletRemoved.subscribe(bulletId => {
      const view = this.bulletViews[bulletId];
      view.destroy();

      delete this.bulletViews[bulletId];
    });
  }

  public showStartMenu() {
    this.startMenuView = StartMenuView.create(this.container);
  }

  public enemyCreated(id: number, positionChanged: Observable<Vec2>) {
    this.enemyViews[id] = EnemyView.create(this.application.stage, this.camera, positionChanged);
  }

  public enemyKilled(id: number) {
    const view = this.enemyViews[id];
    delete this.enemyViews[id];

    view.destroy();
  }
}
