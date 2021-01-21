export function roundToTwoDp(n: number) {
  return Math.ceil(n * 100) / 100;
}

export function bytesToMb(bytes: number) {
  return roundToTwoDp(bytes / (1024 * 1024));
}
