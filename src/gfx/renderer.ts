import { Application } from "pixi.js";
import { PlayerView } from "./player-view";
import { Camera, CenteredCamera } from "./camera";
import { Observable, Subscription } from "../utils/event-publisher";
import { Vec2 } from "../utils/vec";
import { ZoneView } from "./zone-view";
import { Zone } from "../game/zone";
import { EnemyView } from "./enemy-view";
import { BulletView } from "./bullet-view";
import { Bullet } from "../game/bullet";
import { HealthView } from "./health-view";
import { StartMenuView } from "./start-menu-view";
import { EndMenuView } from "./end-menu-view";
import { TextureManager } from "./texture-manager";

export interface GameView {
  init(): void;
  destroy(): void;
}

export class Renderer {
  private camera: Camera;
  private textureManager = new TextureManager();
  private views: GameView[] = [];

  private enemyViews: Record<number, EnemyView> = {};
  private bulletViews: Record<number, BulletView> = {};

  private startMenuView: StartMenuView | undefined;
  private endMenuView: EndMenuView | undefined;

  private subscriptions: Subscription[] = [];

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
    this.textureManager.loadAll().then(() => {
      this.startMenuView?.destroy();
      this.startMenuView = undefined;
      this.endMenuView?.destroy();
      this.endMenuView = undefined;

      this.application.stage.sortableChildren = true;
      this.views.push(PlayerView.create(this.application.stage, this.camera, this.playerPositionChanged));
      this.zoneLoaded.subscribe(zone => {
        this.views.push(ZoneView.create(this.application.stage, this.camera, zone));
      });

      this.views.push(HealthView.create(this.container, this.healthChanged));

      this.subscriptions.push(this.bulletCreated.subscribe(bullet => {
        this.bulletViews[bullet.id] = BulletView.create(this.application.stage, this.camera, this.textureManager, bullet);
      }));

      this.subscriptions.push(this.bulletRemoved.subscribe(bulletId => {
        const view = this.bulletViews[bulletId];
        view.destroy();

        delete this.bulletViews[bulletId];
      }));
    });

  }

  public destroy() {
    this.startMenuView?.destroy();
    this.startMenuView = undefined;
    this.endMenuView?.destroy();
    this.endMenuView = undefined;
    this.views.forEach(v => v.destroy());
    this.views = [];
    Object.values(this.enemyViews).forEach(v => v.destroy());
    this.enemyViews = [];
    Object.values(this.bulletViews).forEach(v => v.destroy());
    this.bulletViews = {};
    this.subscriptions.forEach(s => s());
    this.subscriptions = [];
  }

  public showStartMenu() {
    this.startMenuView = StartMenuView.create(this.container);
  }

  public showEndMenu(won: boolean, healthLeft: number) {
    this.endMenuView = EndMenuView.create(this.container, won, healthLeft);
  }

  public enemyCreated(id: number, positionChanged: Observable<Vec2>) {
    this.enemyViews[id] = EnemyView.create(this.application.stage, this.camera, this.textureManager, positionChanged);
  }

  public enemyKilled(id: number) {
    const view = this.enemyViews[id];
    delete this.enemyViews[id];

    view.destroy();
  }
}
