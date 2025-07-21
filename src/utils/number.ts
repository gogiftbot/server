export const numberToString = (value: number, digits = 2) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

export const findMinAboveN = <T extends { price: number }>(
  arr: T[],
  N: number,
): T => {
  const sorted = [...arr].sort((a, b) => b.price - a.price);
  const last = sorted.findLast((obj) => obj.price > N);
  if (!last) throw new Error("ElementNotFound");
  return last;
};

export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getProbability = (percent: number): boolean => {
  if (percent <= 0) return false;
  if (percent >= 100) return true;
  return Math.random() * 100 < percent;
};

export const getRandomArrayElement = <T>(items: T[]) =>
  items[Math.floor(Math.random() * items.length)];
