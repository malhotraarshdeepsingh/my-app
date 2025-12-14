import {
  getRookMoves,
  getKnightMoves,
  getBishopMoves,
  getQueenMoves,
  getPawnMoves,
  getKingMovesNoCastle,
} from "@/arbiter/getMove";

const getPseudoMoves = ({ piece, position, rank, file, prevPosition }) => {
  if (piece.endsWith("p"))
    return getPawnMoves({ piece, position, rank, file, prevPosition });

  if (piece.endsWith("r")) return getRookMoves({ piece, position, rank, file });

  if (piece.endsWith("n"))
    return getKnightMoves({ piece, position, rank, file });

  if (piece.endsWith("b"))
    return getBishopMoves({ piece, position, rank, file });

  if (piece.endsWith("q"))
    return getQueenMoves({ piece, position, rank, file });

  if (piece.endsWith("k"))
    return getKingMovesNoCastle({ piece, position, rank, file });

  return [];
};

export default getPseudoMoves;
