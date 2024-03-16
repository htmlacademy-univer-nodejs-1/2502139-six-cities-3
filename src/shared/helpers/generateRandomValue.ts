export const generateRandomValue = (
  min: number,
  max: number,
  numAfterDigit = 0
) => +(Math.random() * (max - min) + min).toFixed(numAfterDigit);
