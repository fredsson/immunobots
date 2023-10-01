import { beforeEach, describe, expect, test } from "vitest";
import { CollisionManager } from "./collision-manager";


describe('collisionManager', () => {
  let collisionManager: CollisionManager;
  beforeEach(() => {
    collisionManager = new CollisionManager();
  });

  test('should be created', () => {
    expect(collisionManager).toBeTruthy();
  });

  test('should collide with zone', () => {
    collisionManager.addZoneTile({position: {x: 0, y: 0}, size: {x: 32, y: 32}});

    expect(collisionManager.collides({position:{x: 10, y: 10}, size: {x: 32, y: 32}})).toBe(true);
  });

  test('should not collide when outside zone', () => {
    collisionManager.addZoneTile({position: {x: 0, y: 0}, size: {x: 32, y: 32}});

    expect(collisionManager.collides({position:{x: 100, y: 0}, size: {x: 32, y: 32}})).toBe(false);
  });

  test('should not collide when outside zone', () => {
    collisionManager.addZoneTile({position: {x: 0, y: 0}, size: {x: 32, y: 32}});

    expect(collisionManager.collides({position:{x: 0, y: 100}, size: {x: 32, y: 32}})).toBe(false);
  });
});


