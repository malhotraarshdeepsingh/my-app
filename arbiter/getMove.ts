export const getRookMoves = ({ position, rank, file, piece }) => {
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

export const getKnightMoves = ({ position, rank, file, piece }) => {
  const moves: number[][] = [];
  const colour = piece[0];
  const enemy = colour === "w" ? "b" : "w";

  const offsets = [
    [-2, -1],
    [-2, 1],
    [2, -1],
    [2, 1],
    [-1, 2],
    [1, 2],
    [1, -2],
    [-1, -2],
  ];

  for (const [dr, df] of offsets) {
    const r = rank + dr;
    const f = file + df;

    // bounds check
    if (r < 0 || r > 7 || f < 0 || f > 7) continue;

    const target = position[r][f];

    // empty square
    if (target === "") {
      moves.push([r, f]);
      continue;
    }

    // enemy capture
    if (target.startsWith(enemy)) {
      moves.push([r, f]);
    }
  }

  return moves;
};

export const getBishopMoves = ({ position, rank, file, piece }) => {
  const moves: number[][] = [];
  const colour = piece[0];
  const enemy = colour === "w" ? "b" : "w";

  const directions = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  for (const [dr, df] of directions) {
    for (let step = 1; step < 8; step++) {
      const r = rank + dr * step;
      const f = file + df * step;

      if (r < 0 || r > 7 || f < 0 || f > 7) break;

      const target = position[r][f];

      if (target === "") {
        moves.push([r, f]);
        continue;
      }

      if (target.startsWith(enemy)) {
        moves.push([r, f]);
      }

      break; // blocked after any piece
    }
  }

  return moves;
};

export const getQueenMoves = ({ position, rank, file, piece }) => {
  const moves: number[][] = [];
  const colour = piece[0];
  const enemy = colour === "w" ? "b" : "w";

  const directions = [
    // rook
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    // bishop
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  for (const [dr, df] of directions) {
    for (let step = 1; step < 8; step++) {
      const r = rank + dr * step;
      const f = file + df * step;

      if (r < 0 || r > 7 || f < 0 || f > 7) break;

      const target = position[r][f];

      if (target === "") {
        moves.push([r, f]);
        continue;
      }

      if (target.startsWith(enemy)) {
        moves.push([r, f]);
      }

      break;
    }
  }

  return moves;
};

export const getKingMoves = ({ position, rank, file, piece }) => {
  const moves: number[][] = [];
  const colour = piece[0];
  const enemy = colour === "w" ? "b" : "w";

  const offsets = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];

  for (const [dr, df] of offsets) {
    const r = rank + dr;
    const f = file + df;

    if (r < 0 || r > 7 || f < 0 || f > 7) continue;

    const target = position[r][f];

    if (target === "" || target.startsWith(enemy)) {
      moves.push([r, f]);
    }
  }

  return moves;
};

export const getPawnMoves = ({ position, rank, file, piece }) => {
  const moves: number[][] = [];
  const colour = piece[0];
  const direction = colour === "w" ? -1 : 1;
  const startRank = colour === "w" ? 6 : 1;
  const enemy = colour === "w" ? "b" : "w";

  // one square forward
  const oneStep = rank + direction;
  if (oneStep >= 0 && oneStep <= 7 && position[oneStep][file] === "") {
    moves.push([oneStep, file]);

    // two squares forward from start
    const twoStep = rank + 2 * direction;
    if (
      rank === startRank &&
      position[twoStep][file] === ""
    ) {
      moves.push([twoStep, file]);
    }
  }

  // captures
  for (const df of [-1, 1]) {
    const r = rank + direction;
    const f = file + df;

    if (r < 0 || r > 7 || f < 0 || f > 7) continue;

    const target = position[r][f];
    if (target.startsWith(enemy)) {
      moves.push([r, f]);
    }
  }

  return moves;
};
