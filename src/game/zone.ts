import { Vec2 } from "../utils/vec";
import { CollisionManager, CollisionRect } from "./collision-manager";
import { ZoneTileParser } from "./zone-tile-parser";

export enum TileType {
  Wall = 'Wall',
  Open = 'Open',
  WallOpenLeft = 'WallOpenLeft',
  WallOpenRight = 'WallOpenRight',
  WallOpenAbove = 'WallOpenAbove',
  WallOpenBelow = 'WallOpenBelow',
  WallOpenLeftAndAbove = 'WallOpenLeftAndAbove',
  WallOpenLeftAndBelow = 'WallOpenLeftAndBelow',
  WallOpenRightAndAbove = 'WallOpenRightAndAbove',
  WallOpenRightAndBelow = 'WallOpenRightAndBelow',
}

function collisionRectFromTileType(tileType: TileType, position: Vec2): CollisionRect {
  switch(tileType) {
    case TileType.Open:
      return {position, size: {x: 0, y: 0}};
    case TileType.Wall:
      return {position, size: {x: 128, y: 128}};
    case TileType.WallOpenAbove:
      return {position: {x: position.x , y: position.y + 10}, size: {x: 128, y: 118}};
    case TileType.WallOpenBelow:
      return {position: {x: position.x , y: position.y}, size: {x: 128, y: 118}};
    case TileType.WallOpenLeft:
      return {position: {x: position.x + 10 , y: position.y}, size: {x: 118, y: 128}};
    case TileType.WallOpenRight:
      return {position: {x: position.x , y: position.y}, size: {x: 118, y: 128}};
    case TileType.WallOpenLeftAndAbove:
      return {position: {x: position.x + 10, y: position.y + 10}, size: {x: 118, y: 118}};
    case TileType.WallOpenLeftAndBelow:
      return {position: {x: position.x + 10, y: position.y}, size: {x: 118, y: 118}};
    case TileType.WallOpenRightAndAbove:
      return {position: {x: position.x, y: position.y + 10}, size: {x: 118, y: 118}};
    case TileType.WallOpenRightAndBelow:
      return {position: {x: position.x, y: position.y}, size: {x: 118, y: 118}};
  }
}

class ZoneTile {
  constructor(public readonly type: TileType) {
  }
}

export class Zone {
  public static async load(zoneName: string, collisionManager: CollisionManager): Promise<Zone> {
    return new Promise(resolve => {
      fetch(`assets/zones/${zoneName}.txt`)
        .then(response => response.text())
        .then(data => {

          const tiles: ZoneTile[] = [];
          let startPosition: Vec2 = {
            x: 0,
            y: 0,
          };

          const tokens = data.split('');
          const tileParser = new ZoneTileParser(tokens, 100, 100);

          const enemyStartPositions: Vec2[] = [];

          tokens.forEach((v, index) => {
            const x = index % 100;
            const y = Math.floor(index / 100);

            if (v === ZoneTileParser.StartTileToken) {
              startPosition = {
                x: (x * 128) + (128 / 2),
                y: (y * 128) + (128 / 2)
              }
            }

            if (v === ZoneTileParser.EnemyStartTileToken) {
              enemyStartPositions.push({
                x: (x * 128) + (128 / 2),
                y: (y * 128) + (128 / 2)
              })
            }

            const tileType = tileParser.tokenBasedOnNeighbors(v, {x, y});
            if (!ZoneTileParser.OpenTileTokens.includes(v)) {
              collisionManager.addZoneTile(collisionRectFromTileType(tileType, {x: x*128, y: y*128}));
            }

            tiles.push(new ZoneTile(tileType));
          });

          resolve(new Zone(startPosition, enemyStartPositions, tiles));
        })
    });
  }

  private currentStartPositionIndex = 0;

  constructor(
    public readonly playerStartPosition: Vec2,
    private enemyStartPositions: Vec2[],
    public readonly tiles: ZoneTile[],
  ) {
  }

  public destroy(): void {
  }

  public nextEnemyStartPosition() {
    return this.enemyStartPositions[this.currentStartPositionIndex++];
  }

}
