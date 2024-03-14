import { generateRandomValue } from './generateRandomValue.js';

export const getRandomItems = <T>(items: T[]): T[] => {
  const startIndex = generateRandomValue(0, items.length - 1);
  const endIndex =
    startIndex + generateRandomValue(startIndex, items.length);
  return items.slice(startIndex, endIndex);
};
