import { generateRandomValue } from './generateRandomValue.js';

export const getRandomItem = <T>(items: T[]): T =>
  items[generateRandomValue(0, items.length - 1)];
