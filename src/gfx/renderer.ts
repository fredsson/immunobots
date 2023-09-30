import { Application } from "pixi.js";
import { PlayerView } from "./player-view";
import { Camera, CenteredCamera } from "./camera";
import { Observable } from "../utils/event-publisher";
import { Vec2 } from "../utils/vec";
import { ZoneView } from "./zone-view";
import { Zone } from "../game/zone";
import { EnemyView } from "./enemy-view";

export interface GameView {
  init(): void;
  destroy(): void;
}

export class Renderer {
  private camera: Camera;
  private views: GameView[] = [];

  private enemyViews: Record<number, EnemyView> = []

  constructor(private application: Application, playerPositionChanged: Observable<Vec2>, zoneLoaded: Observable<Zone>) {
    this.camera = new CenteredCamera(application.screen, playerPositionChanged);
    application.stage.sortableChildren = true;
    this.views.push(PlayerView.create(application.stage, this.camera, playerPositionChanged));
    zoneLoaded.subscribe(zone => {
      this.views.push(ZoneView.create(application.stage, this.camera, zone));
    });
  }

  public enemyCreated(id: number, positionChanged: Observable<Vec2>) {
    this.enemyViews[id] = EnemyView.create(this.application.stage, this.camera, positionChanged);
  }
}
