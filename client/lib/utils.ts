export function roundToTwoDp(n: number) {
  return Math.ceil(n * 100) / 100;
}

export function bytesToMb(bytes: number) {
  return roundToTwoDp(bytes / (1024 * 1024));
}

export function sum(numbers: number[]) {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}
