import {expect, test} from 'vitest';
import { ZoneTileParser } from './zone-tile-parser';
import { TileType } from './zone';

const zoneTileParser = new ZoneTileParser([
  '*', '*', '*', '*',
  '*', 'T', '*', '*',
  '*', '*', '*', '*',
], 4, 3);

test('should be created', () => {
  expect(zoneTileParser).toBeTruthy();
});

test('should return open for T token', () => {
  expect(zoneTileParser.tokenBasedOnNeighbors('T', {x: 1, y: 1})).toBe(TileType.Open);
});

test('should return wall when no open neighbors', () => {
  expect(zoneTileParser.tokenBasedOnNeighbors('*', {x: 0, y: 3})).toBe(TileType.Wall);
});

test('should return correct token when open to left', () => {
  expect(zoneTileParser.tokenBasedOnNeighbors('*', {x: 2, y: 1})).toBe(TileType.WallOpenLeft);
});

test('should return correct token when open to the right', () => {
  expect(zoneTileParser.tokenBasedOnNeighbors('*', {x: 0, y: 1})).toBe(TileType.WallOpenRight);
});

test('should return correct token when open above', () => {
  expect(zoneTileParser.tokenBasedOnNeighbors('*', {x: 1, y: 2})).toBe(TileType.WallOpenAbove);
});

test('should return correct token when open below', () => {
  expect(zoneTileParser.tokenBasedOnNeighbors('*', {x: 1, y: 0})).toBe(TileType.WallOpenBelow);
});


const data = [
  {position: {x: 2, y: 2}, expected: TileType.WallOpenLeftAndAbove},
  {position: {x: 2, y: 0}, expected: TileType.WallOpenLeftAndBelow},
  {position: {x: 0, y: 2}, expected: TileType.WallOpenRightAndAbove},
  {position: {x: 0, y: 0}, expected: TileType.WallOpenRightAndBelow},
];
data.forEach(({position, expected}) => {
  test(`should return correct tokens when open diagonally (${position.x},${position.y}) | expected: ${expected}`, () => {
    expect(zoneTileParser.tokenBasedOnNeighbors('*', position)).toBe(expected);
  });
});


test('should return correct token when there are corners', () => {
  const zoneTileParser = new ZoneTileParser([
    '*', 'T', '*',
    'T', 'T', '*',
    '*', '*', '*',
  ], 3, 3);

  expect(zoneTileParser.tokenBasedOnNeighbors('*', {x: 0, y: 0})).toBe(TileType.WallOpenRightAndBelow);
});

test('should return correct token when there are corners', () => {
  const zoneTileParser = new ZoneTileParser([
    '*', 'T', '*',
    '*', 'T', 'T',
    '*', '*', '*',
  ], 3, 3);

  expect(zoneTileParser.tokenBasedOnNeighbors('*', {x: 2, y: 0})).toBe(TileType.WallOpenLeftAndBelow);
});

test('should return correct token when there are corners', () => {
  const zoneTileParser = new ZoneTileParser([
    '*', '*', '*',
    'T', 'T', 'T',
    '*', '*', 'T',
  ], 3, 3);

  expect(zoneTileParser.tokenBasedOnNeighbors('*', {x: 1, y: 2})).toBe(TileType.WallOpenRightAndAbove);
});
