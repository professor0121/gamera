export interface Point {
  x: number;
  y: number;
}

export const GRID_SIZE = 15;

export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

// Spawn food node at a random cell not occupied by the snake body
export const spawnFood = (snakeBody: Point[]): Point => {
  let attempts = 0;
  while (attempts < 100) {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    const isOccupied = snakeBody.some(segment => segment.x === x && segment.y === y);
    if (!isOccupied) {
      return { x, y };
    }
    attempts++;
  }
  // Fallback
  return { x: 7, y: 7 };
};

// Check if the next head position results in a collision (walls or tail)
export const checkCollision = (head: Point, body: Point[]): boolean => {
  // Wall collision
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    return true;
  }

  // Self collision (body segments starting from index 1 since head is index 0)
  for (let i = 1; i < body.length; i++) {
    if (head.x === body[i].x && head.y === body[i].y) {
      return true;
    }
  }

  return false;
};
