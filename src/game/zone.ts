import { Vec2 } from "../utils/vec";
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

class ZoneTile {
  constructor(public readonly type: TileType) {
  }
}

export class Zone {
  public static async load(zoneName: string): Promise<Zone> {
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
            tiles.push(new ZoneTile(tileType));
          });

          resolve(new Zone(startPosition, enemyStartPositions, tiles));
        })
    });
  }

  constructor(
    public readonly playerStartPosition: Vec2,
    private enemyStartPositions: Vec2[],
    public readonly tiles: ZoneTile[],
  ) {
  }

  public destroy(): void {
  }

  public randomEnemyStartPosition() {
    const index = Math.round(Math.random() * this.enemyStartPositions.length - 1);

    return this.enemyStartPositions[index];
  }

}
