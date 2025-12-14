export const isInsufficientMaterial = (position) => {
  const pieces = [];

  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const p = position[r][f];
      if (p) pieces.push(p);
    }
  }

  // only kings
  if (pieces.length === 2) return true;

  // K + minor vs K
  if (
    pieces.length === 3 &&
    pieces.some((p) => p.endsWith("b") || p.endsWith("n"))
  ) {
    return true;
  }

  // K+B vs K+B same color bishops
  if (pieces.length === 4) {
    const bishops = pieces.filter((p) => p.endsWith("b"));
    if (bishops.length === 2) return true;
  }

  // K + 2N vs K
  if (
    pieces.length === 4 &&
    pieces.filter((p) => p.endsWith("n")).length === 2
  ) {
    return true;
  }

  return false;
};
