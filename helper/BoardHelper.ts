export const getCharacter = (file) => String.fromCharCode(file + 96);

export const createPosition = () => {
  const position = new Array(8).fill("").map(() => new Array(8).fill(""));

  // pawns (FIXED)
  for (let i = 0; i < 8; i++) {
    position[6][i] = "wp";
    position[1][i] = "bp";
  }

  // white pieces (bottom)
  position[7][0] = "wr";
  position[7][1] = "wn";
  position[7][2] = "wb";
  position[7][3] = "wk";
  position[7][4] = "wq";
  position[7][5] = "wb";
  position[7][6] = "wn";
  position[7][7] = "wr";

  // black pieces (top)
  position[0][0] = "br";
  position[0][1] = "bn";
  position[0][2] = "bb";
  position[0][3] = "bk";
  position[0][4] = "bq";
  position[0][5] = "bb";
  position[0][6] = "bn";
  position[0][7] = "br";

  return position;
};

export const copyPosition = (position) => {
  const newPosition = new Array(8).fill("").map((x) => new Array(8).fill(""));

  for (let rank = 0; rank < position.length; rank++) {
    for (let file = 0; file < position[0].length; file++) {
      newPosition[rank][file] = position[rank][file];
    }
  }

  return newPosition;
};

type MoveNotationArgs = {
  piece: string;
  rank: number;
  file: number;
  x: number;
  y: number;
  position: string[][];
  promotesTo?: string; // ✅ optional
};

export const getNewMoveNotation = ({
  piece,
  rank,
  file,
  x,
  y,
  position,
  promotesTo,
}: {
  piece?: string;
  rank: number;
  file: number;
  x: number;
  y: number;
  position: string[][];
  promotesTo?: string;
}) => {
  if (!piece) return "";

  const pieceType = piece[1];
  const isCapture = Boolean(position[x][y]);

  // 1️⃣ Castling
  if (isCastle(pieceType, file, y)) {
    return getCastleNotation(file, y);
  }

  // 2️⃣ Pawn move
  if (pieceType === "p") {
    return getPawnNotation({
      fromFile: file,
      toX: x,
      toY: y,
      isCapture: file !== y,
      promotesTo,
    });
  }

  // 3️⃣ Normal piece
  return getPieceNotation({
    pieceType,
    isCapture,
    toX: x,
    toY: y,
  });
};

const getPawnNotation = ({
  fromFile,
  toX,
  toY,
  isCapture,
  promotesTo,
}: {
  fromFile: number;
  toX: number;
  toY: number;
  isCapture: boolean;
  promotesTo?: string;
}) => {
  let note = "";

  if (isCapture) {
    note += getCharacter(fromFile + 1) + "x";
  }

  note += square(toX, toY);

  if (promotesTo) {
    note += "=" + promotesTo.toUpperCase();
  }

  return note;
};

const getPieceNotation = ({
  pieceType,
  isCapture,
  toX,
  toY,
}: {
  pieceType: string;
  isCapture: boolean;
  toX: number;
  toY: number;
}) => {
  let note = pieceType.toUpperCase();
  if (isCapture) note += "x";
  note += square(toX, toY);
  return note;
};

const toChessSquare = (x: number, y: number) => {
    const rank = 8 - x; // flip vertically
    if (y === 0) return `h${rank}`;
    else if (y === 1) return `g${rank}`;
    else if (y === 2) return `f${rank}`;
    else if (y === 3) return `e${rank}`;
    else if (y === 4) return `d${rank}`;
    else if (y === 5) return `c${rank}`;
    else if (y === 6) return `b${rank}`;
    else if (y === 7) return `a${rank}`;
};

const square = (x: number, y: number) => toChessSquare(x, y);

const getCastleNotation = (fromFile: number, toFile: number) =>
  fromFile < toFile ? "O-O" : "O-O-O";

const isCastle = (pieceType: string, fromFile: number, toFile: number) =>
  pieceType === "k" && Math.abs(fromFile - toFile) === 2;

const isPromotion = (pieceType: string, toRank: number) =>
  pieceType === "p" && (toRank === 0 || toRank === 7);

const getDisambiguation = ({
  pieceType,
  fromX,
  fromY,
  toX,
  toY,
  board,
  allMoves,
}: any) => {
  const conflicts = allMoves.filter(
    (m: any) =>
      m.piece[1] === pieceType &&
      m.toX === toX &&
      m.toY === toY &&
      !(m.fromX === fromX && m.fromY === fromY)
  );

  if (!conflicts.length) return "";

  const sameFile = conflicts.some((m: any) => m.fromY === fromY);
  const sameRank = conflicts.some((m: any) => m.fromX === fromX);

  if (!sameFile) return getCharacter(fromY + 1);
  if (!sameRank) return `${8 - fromX}`;
  return getCharacter(fromY + 1) + (8 - fromX);
};
