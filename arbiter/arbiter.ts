import {
  getRookMoves,
  getKnightMoves,
  getBishopMoves,
  getQueenMoves,
  getKingMoves,
  getPawnMoves,
} from "@/arbiter/getMove";

const arbiter = {
  getRegularMoves({
    piece,
    position,
    prevPosition,
    rank,
    file,
    castling,
  }: any) {
    if (!piece) return [];

    if (piece.endsWith("r"))
      return getRookMoves({ piece, position, rank, file });
    if (piece.endsWith("n"))
      return getKnightMoves({ piece, position, rank, file });
    if (piece.endsWith("b"))
      return getBishopMoves({ piece, position, rank, file });
    if (piece.endsWith("q"))
      return getQueenMoves({ piece, position, rank, file });
    if (piece.endsWith("k"))
      return getKingMoves({ piece, position, rank, file, castling });
    if (piece.endsWith("p"))
      return getPawnMoves({ piece, position, prevPosition, rank, file });

    return [];
  },
};

export default arbiter;
