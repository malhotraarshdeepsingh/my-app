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

export const getKingMoves = ({ position, rank, file, piece, castling }: any) => {
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

  if (file === 3 && (rank === 0 || rank === 7)) {
    if (castling[colour].kingSide === true &&
        position[rank][4] === "" &&
        position[rank][5] === "" &&
        position[rank][6] === "" &&
        position[rank][7] === colour + "r") {
      moves.push([rank, 5]);
    }
    if (castling[colour].queenSide === true &&
        position[rank][1] === "" &&
        position[rank][2] === "" &&
        position[rank][0] === colour + "r") {
      moves.push([rank, 1]);
    }
  }

  return moves;
};

export const getPawnMoves = ({ position, prevPosition, rank, file, piece }) => {
  const moves: number[][] = [];
  const colour = piece[0];
  const enemy = colour === "w" ? "b" : "w";

  const direction = colour === "w" ? -1 : 1;
  const startRank = colour === "w" ? 6 : 1;

  // ---------- FORWARD ----------
  const oneStep = rank + direction;
  if (oneStep >= 0 && oneStep <= 7 && position[oneStep][file] === "") {
    moves.push([oneStep, file]);

    const twoStep = rank + 2 * direction;
    if (
      rank === startRank &&
      position[twoStep][file] === ""
    ) {
      moves.push([twoStep, file]);
    }
  }

  // ---------- NORMAL CAPTURES ----------
  for (const df of [-1, 1]) {
    const r = rank + direction;
    const f = file + df;

    if (r < 0 || r > 7 || f < 0 || f > 7) continue;

    const target = position[r][f];
    if (target !== "" && target.startsWith(enemy)) {
      moves.push([r, f]);
    }
  }

  // ---------- EN PASSANT ----------
  if (prevPosition) {
    const epRank = colour === "w" ? 3 : 4;

    if (rank === epRank) {
      for (const df of [-1, 1]) {
        const adjFile = file + df;
        if (adjFile < 0 || adjFile > 7) continue;

        const enemyPawn = position[rank][adjFile];
        if (enemyPawn !== enemy + "p") continue;

        const enemyStartRank = colour === "w" ? 1 : 6;
        const enemyEndRank = rank;

        if (
          prevPosition[enemyStartRank][adjFile] === enemy + "p" &&
          prevPosition[enemyEndRank][adjFile] === ""
        ) {
          moves.push([rank + direction, adjFile]);
        }
      }
    }
  }

  return moves;
};
