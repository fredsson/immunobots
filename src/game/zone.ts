import { Vec2 } from "../utils/vec";

const OpenTileTokens = ['T', 'S'];

export enum TileType {
  Wall,
  Open,
  WallOpenLeft,
  WallOpenRight,
  WallOpenAbove,
  WallOpenBelow,
  WallOpenLeftAndAbove,
  WallOpenLeftAndBelow,
  WallOpenRightAndAbove,
  WallOpenRightAndBelow
}

function calculateTileTypeFromTokens(token: string, tokens: string[], position: Vec2): TileType {
  if (OpenTileTokens.includes(token)) {
    return TileType.Open;
  }

  const tokenMapper = (d: {position: number[], type: TileType}) => {
    const [dx, dy] = d.position;

    const x = position.x + dx;
    const y = position.y + dy;

    if (x < 0 || x >= 100) {
      return undefined;
    }
    if (y < 0 || y >= 100) {
      return undefined;
    }

    return {
      token: tokens[(y * 100) + x],
      type: d.type,
    };
  };
  // check above and below neighbor
  const vertical: {type: TileType}[] = [
    {position: [0, -1], type: TileType.WallOpenAbove},
    {position: [0, -1], type: TileType.WallOpenAbove},
  ].map<any>(tokenMapper).filter(v => v != undefined && v.token != '*');

  const horizontal: {type: TileType}[] = [
    {position: [-1, 0], type: TileType.WallOpenLeft},
    {position: [1, 0], type: TileType.WallOpenRight},
  ].map<any>(tokenMapper).filter(v => v != undefined && v.token != '*');


  // check left right neighbors
  if (!vertical.length) {
    // if no above / below neighbor
  if (!horizontal.length) {
      return TileType.Wall;
    }
    //    return left or right or none
    return horizontal[0].type;
  }

  if (!horizontal.length) {
    if (!vertical.length) {
      return TileType.Wall;
    }

    return vertical[0].type;
  }

  if (vertical[0].type === TileType.WallOpenAbove) {
    return horizontal[0].type === TileType.WallOpenLeft ? TileType.WallOpenLeftAndAbove : TileType.WallOpenRightAndAbove;
  }

  if (vertical[0].type === TileType.WallOpenBelow) {
    return horizontal[0].type === TileType.WallOpenLeft ? TileType.WallOpenLeftAndBelow : TileType.WallOpenRightAndBelow;
  }

  return TileType.Wall;
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

          data.split('').forEach((v, index, arr) => {
            const x = index % 100;
            const y = Math.floor(index / 100);

            if (v === 'S') {
              startPosition = {
                x: (x * 128) - (128 / 2),
                y: (y * 128) + (128 / 2)
              }
            }

            const tileType = calculateTileTypeFromTokens(v, arr, {x: x, y: y});
            tiles.push(new ZoneTile(tileType));
          });

          console.log(tiles);

          resolve(new Zone(startPosition, tiles));
        })
    });
  }

  constructor(public readonly playerStartPosition: Vec2, public readonly tiles: ZoneTile[]) {
  }

  public destroy(): void {
  }

}
