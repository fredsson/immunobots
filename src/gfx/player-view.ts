import { Assets, Container, DisplayObject, Sprite } from "pixi.js";
import { GameView } from "./renderer";
import { Observable } from "../utils/event-publisher";
import { Vec2 } from "../utils/vec";
import { Camera } from "./camera";


export class PlayerView implements GameView {
  public static create(stage: Container<DisplayObject>, camera: Camera, playerPositionChanged: Observable<Vec2>) {
    const view = new PlayerView(stage, camera, playerPositionChanged);
    view.init();
    return view;
  }

  private sprite?: Sprite;

  private constructor(private stage: Container<DisplayObject>, private camera: Camera, private playerPositionChanged: Observable<Vec2>) {
  }

  public init(): void {
    Assets.load('/assets/gfx/bot.png').then(b => {
      this.sprite = new Sprite(b);
      this.sprite.zIndex = 2;
      this.sprite.anchor.x = 0.5;
      this.sprite.anchor.y = 0.5;
      this.stage.addChild(this.sprite);
      this.playerPositionChanged.subscribe(position => {
        if (this.sprite) {
          const screenSpace = this.camera.toScreenSpace(position);
          this.sprite.x = screenSpace.x;
          this.sprite.y = screenSpace.y;
        }
      });
    });
  }

  public destroy() {
    if (this.sprite) {
      this.stage.removeChild(this.sprite);
    }
  }

}
