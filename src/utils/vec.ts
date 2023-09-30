export interface Vec2 {
  x: number;
  y: number;
}
export namespace Vec2 {
  export function sub(v1: Vec2, v2: Vec2): Vec2 {
    return {
      x: v1.x - v2.x,
      y: v1.y - v2.y
    };
  }

  export function add(v1: Vec2, v2: Vec2): Vec2 {
    return {
      x: v1.x + v2.x,
      y: v1.y + v2.y,
    };
  }

  export function normalize(v: Vec2): Vec2 {
    const magnitude = Math.sqrt(v.x * v.x + v.y * v.y);
    if (magnitude == 0) {
      return {
        x: 0,
        y: 0,
      };
    }

    return {
      x: v.x / magnitude,
      y: v.y / magnitude
    };
  }
}
