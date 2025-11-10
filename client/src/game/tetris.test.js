import {describe, test, expect} from '@jest/globals';
import * as tetris from './tetris.js';


describe('Tetris Module', () => {
  test('createGrid creates a grid of correct dimensions', () => {
    const width = 5;
    const height = 10;
    const grid = tetris.createGrid(width, height);

    expect(grid.length).toBe(height);
    expect(grid[0].length).toBe(width);
    grid.forEach(row => {
      expect(row.length).toBe(width);
    });
  });


});