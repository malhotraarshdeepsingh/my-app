export const getRookMoves = ({position, rank, file, piece}) => {
  const moves: number[][] = [];
  const colour = piece[0];
  const enemy = colour === "w" ? "b" : "w";

  const directions = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  for (const [dr, df] of directions) {
    for (let step = 1; step < 8; step++) {
      const r = rank + dr * step;
      const f = file + df * step;

      if (r < 0 || r > 7 || f < 0 || f > 7) break;

      if (position[r][f]?.startsWith(colour)) break;

      moves.push([r, f]);

      if (position[r][f]?.startsWith(enemy)) break;
    }
  }
  return moves;
};
