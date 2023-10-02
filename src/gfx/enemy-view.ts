import { AnimatedSprite, Container, DisplayObject } from "pixi.js";
import { GameView } from "./renderer";
import { Camera } from "./camera";
import { Observable, Subscription } from "../utils/event-publisher";
import { Vec2 } from "../utils/vec";
import { TextureManager } from "./texture-manager";

export class EnemyView implements GameView {
  public static create(stage: Container<DisplayObject>, camera: Camera, textureManager: TextureManager, positionChanged: Observable<Vec2>) {
    const view = new EnemyView(stage, camera, textureManager, positionChanged);
    view.init();
    return view;
  }

  private sprite?: AnimatedSprite;
  private currentPosition?: Vec2;

  private cameraSub?: Subscription;
  private positionChangedSub?: Subscription;

  private constructor(private stage: Container<DisplayObject>, private camera: Camera, private textureManager: TextureManager, private positionChanged: Observable<Vec2>) {
  }

  public init(): void {
    const textures = this.textureManager.getAnimationByPath('assets/gfx/enemy_1.json');

    this.sprite = new AnimatedSprite(textures);
    this.sprite.zIndex = 2;
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    this.sprite.animationSpeed = 0.2;
    this.sprite.play();
    this.stage.addChild(this.sprite);
    this.cameraSub = this.camera.positionChanged.subscribe(() => {
      if (this.currentPosition && this.sprite) {
        const screenSpace = this.camera.toScreenSpace(this.currentPosition);
        this.sprite.x = screenSpace.x;
        this.sprite.y = screenSpace.y;
      }
    });
    this.positionChanged.subscribe(position => {
      this.currentPosition = position;
      if (this.sprite) {
        const screenSpace = this.camera.toScreenSpace(position);
        this.sprite.x = screenSpace.x;
        this.sprite.y = screenSpace.y;
      }
    });
  }

  public destroy() {
    this.cameraSub?.();
    this.positionChangedSub?.();
    if (this.sprite) {
      this.stage.removeChild(this.sprite);
    }
  }

}
