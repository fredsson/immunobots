import { Assets, Container, DisplayObject, Sprite, Texture } from "pixi.js";
import { GameView } from "./renderer";
import { Camera } from "./camera";
import { Vec2 } from "../utils/vec";
import { Subscription } from "../utils/event-publisher";
import { TileType, Zone } from "../game/zone";

export class TileView implements GameView {
  private sprite: Sprite;

  constructor(texture: Texture, private stage: Container<DisplayObject>, private camera: Camera, private startPosition: Vec2) {
    this.sprite = new Sprite(texture);
    const {x, y} = camera.toScreenSpace(startPosition);
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.zIndex = 1;
    this.stage.addChild(this.sprite);
  }

  public positionChanged() {
    const {x, y} = this.camera.toScreenSpace(this.startPosition);
    this.sprite.x = x;
    this.sprite.y = y;
  }

  public init(): void {
  }


  public destroy(): void {
    if (this.sprite) {
      this.stage.removeChild(this.sprite);
    }
  }
}

function textureNameFromTileType(tileType: TileType): string {
  switch(tileType) {
    case TileType.Open:
      return 'tiles0.png';
    case TileType.Wall:
      return 'tiles4.png';
    case TileType.WallOpenAbove:
      return 'tiles9.png';
    case TileType.WallOpenBelow:
      return 'tiles11.png';
    case TileType.WallOpenLeft:
      return 'tiles10.png';
    case TileType.WallOpenRight:
      return 'tiles8.png';
    case TileType.WallOpenLeftAndAbove:
      return 'tiles14.png';
    case TileType.WallOpenLeftAndBelow:
      return 'tiles15.png';
    case TileType.WallOpenRightAndAbove:
      return 'tiles13.png';
    case TileType.WallOpenRightAndBelow:
      return 'tiles12.png';
  }
}

export class ZoneView implements GameView {
  tiles: TileView[] = [];

  positionChangedSub?: Subscription;

  public static create(stage: Container<DisplayObject>, camera: Camera, zone: Zone) {
    const view = new ZoneView(stage, camera, zone);
    view.init();
    return view;
  }

  private constructor(private stage: Container<DisplayObject>, private camera: Camera, private zone: Zone) {
  }

  public init(): void {
    Assets.load('/assets/gfx/tiles.json').then(b => {
      this.zone.tiles.forEach((t, index) => {
        const x = index % 100;
        const y = Math.floor(index / 100);

        const textureName = textureNameFromTileType(t.type);
        this.tiles.push(new TileView(
          b.textures[textureName],
          this.stage,
          this.camera,
          { x: x * 128, y: y * 128 }
        ));
      });

      this.positionChangedSub = this.camera.positionChanged.subscribe(() => this.tiles.forEach(t => t.positionChanged()));
    });
  }

  public destroy(): void {
    this.positionChangedSub?.();
    this.tiles.forEach(t => t.destroy());
  }
}
