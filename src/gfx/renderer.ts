import { Application } from "pixi.js";
import { PlayerView } from "./player-view";
import { Camera, CenteredCamera } from "./camera";
import { Observable } from "../utils/event-publisher";
import { Vec2 } from "../utils/vec";

export interface GameView {
  init(): void;
  destroy(): void;
}

export class Renderer {
  private camera: Camera;
  private views: GameView[] = [];

  constructor(application: Application, playerPositionChanged: Observable<Vec2>) {
    this.camera = new CenteredCamera(application.screen, playerPositionChanged);
    this.views.push(PlayerView.create(application.stage, this.camera, playerPositionChanged));
  }
}
