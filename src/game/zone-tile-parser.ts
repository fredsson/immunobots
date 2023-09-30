import { Vec2 } from "../utils/vec";
import { TileType } from "./zone";

const OpenTileTokens = ['T', 'S', 'E'];

const getIndexFromCoordinates = (position: Vec2, delta: Vec2, width: number, height: number) => {
  const x = position.x + delta.x;
  const y = position.y + delta.y;

  if (x < 0 || x >= width) {
    return undefined;
  }

  if (y < 0 || y >= height) {
    return undefined;
  }

  return (y * width) + x;
}

const getNeighborToken = (tokens: string[], indexCallback: () => number | undefined) => {
  const index = indexCallback();
  if (index == undefined) {
    return undefined;
  }

  return tokens[index];
}

export class ZoneTileParser  {
  public static StartTileToken = 'S';
  public static EnemyStartTileToken = 'E';

  constructor(private tokens: string[], private width: number, private height: number) {
  }

  public tokenBasedOnNeighbors(token: string, position: Vec2) {
    if (OpenTileTokens.includes(token)) {
      return TileType.Open;
    }

    const neighbors = [
      {x: 1, y: 0, type: TileType.WallOpenRight},
      {x: -1, y: 0, type: TileType.WallOpenLeft},
      {x: 0, y: -1, type: TileType.WallOpenAbove},
      {x: 0, y: 1, type: TileType.WallOpenBelow},
      {x: -1, y: -1, type: TileType.WallOpenLeftAndAbove},
      {x: -1, y: 1, type: TileType.WallOpenLeftAndBelow},
      {x: 1, y: -1, type: TileType.WallOpenRightAndAbove},
      {x: 1, y: 1, type: TileType.WallOpenRightAndBelow},
    ];

    const includedNeighbors = neighbors
      .map(n => {
        const token = getNeighborToken(this.tokens, () => getIndexFromCoordinates(position, {x: n.x, y: n.y}, this.width, this.height));
        return {
          ...n,
          token
        };
      })
      .filter(n => n.token && OpenTileTokens.includes(n.token));

    if (includedNeighbors.length) {

      const diagonals = [
        {neigbors: [TileType.WallOpenLeft, TileType.WallOpenAbove], type: TileType.WallOpenLeftAndAbove},
        {neigbors: [TileType.WallOpenRight, TileType.WallOpenAbove], type: TileType.WallOpenRightAndAbove},
        {neigbors: [TileType.WallOpenLeft, TileType.WallOpenBelow], type: TileType.WallOpenLeftAndBelow},
        {neigbors: [TileType.WallOpenRight, TileType.WallOpenBelow], type: TileType.WallOpenRightAndBelow}
      ];
      for (const diagonal of diagonals) {
        if (diagonal.neigbors.every(d => includedNeighbors.some(n => n.type === d))) {
          return diagonal.type;
        }
      }

      return includedNeighbors[0].type;
    }

    return TileType.Wall;
  }

}
