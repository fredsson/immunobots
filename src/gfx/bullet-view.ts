import { AnimatedSprite, Container, DisplayObject } from "pixi.js";
import { GameView } from "./renderer";
import { Camera } from "./camera";
import { Subscription } from "../utils/event-publisher";
import { Vec2 } from "../utils/vec";
import { Bullet } from "../game/bullet";
import { TextureManager } from "./texture-manager";

export class BulletView implements GameView {
  public static create(stage: Container<DisplayObject>, camera: Camera, textureManager: TextureManager, bullet: Bullet): BulletView {
    const view = new BulletView(stage, camera, textureManager, bullet);
    view.init();

    return view;
  }

  private position?: Vec2;
  private sprite?: AnimatedSprite;

  private cameraPositionChangedSub?: Subscription;
  private modelPositionChangedSub?: Subscription;

  private constructor(private stage: Container<DisplayObject>, private camera: Camera, private textureManager: TextureManager, private bullet: Bullet) {
  }

  public init(): void {
    const animations = this.textureManager.getAnimationByPath('assets/gfx/bullet_1.json');

    this.sprite = new AnimatedSprite(animations);
    this.sprite.animationSpeed = 0.3;
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    this.sprite.zIndex = 2;
    this.sprite.play();
    this.stage.addChild(this.sprite);

    this.cameraPositionChangedSub = this.camera.positionChanged.subscribe(() => {
      if (this.sprite && this.position) {
        const screenPosition = this.camera.toScreenSpace(this.position);
        this.sprite.x = screenPosition.x;
        this.sprite.y = screenPosition.y;
      }
    });

    this.modelPositionChangedSub = this.bullet.positionChanged.subscribe(position => {
      this.position = position;
      if (this.sprite) {
        const screenPosition = this.camera.toScreenSpace(position);

        this.sprite.x = screenPosition.x;
        this.sprite.y = screenPosition.y;
      }
    });
  }

  public destroy(): void {
    if (this.sprite) {
      this.stage.removeChild(this.sprite);
    }
    this.cameraPositionChangedSub?.();
    this.modelPositionChangedSub?.();
  }
}
