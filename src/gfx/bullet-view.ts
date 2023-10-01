import { AnimatedSprite, Assets, Container, DisplayObject, Texture } from "pixi.js";
import { GameView } from "./renderer";
import { Camera } from "./camera";
import { Subscription } from "../utils/event-publisher";
import { Vec2 } from "../utils/vec";
import { Bullet } from "../game/bullet";

export class BulletView implements GameView {
  public static create(stage: Container<DisplayObject>, camera: Camera, bullet: Bullet): BulletView {
    const view = new BulletView(stage, camera, bullet);
    view.init();

    return view;
  }


  private animations?: Texture[];
  private position?: Vec2;
  private sprite?: AnimatedSprite;

  private cameraPositionChangedSub?: Subscription;
  private modelPositionChangedSub?: Subscription;

  private constructor(private stage: Container<DisplayObject>, private camera: Camera, private bullet: Bullet) {
  }

  public init(): void {
    Assets.load('assets/gfx/bullet_1.json').then((b: {data: {animations: Record<string, string[]>}}) => {
      this.animations = b.data.animations['default'].map(textureName => {
        return Texture.from(textureName);
      });

      this.sprite = new AnimatedSprite(this.animations);
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
