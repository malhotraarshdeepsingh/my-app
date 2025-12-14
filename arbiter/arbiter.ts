import {
  getRookMoves,
  getKnightMoves,
  getBishopMoves,
  getQueenMoves,
  getKingMoves,
  getPawnMoves,
} from "@/arbiter/getMove";
import filterLegalMoves from "./legality";

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

    let pseudo = [];

    if (piece.endsWith("r"))
      pseudo = getRookMoves({ piece, position, rank, file });
    if (piece.endsWith("n"))
      pseudo = getKnightMoves({ piece, position, rank, file });
    if (piece.endsWith("b"))
      pseudo = getBishopMoves({ piece, position, rank, file });
    if (piece.endsWith("q"))
      pseudo = getQueenMoves({ piece, position, rank, file });
    if (piece.endsWith("k"))
      pseudo = getKingMoves({ piece, position, rank, file, castling });
    if (piece.endsWith("p"))
      pseudo = getPawnMoves({ piece, position, prevPosition, rank, file });

    return filterLegalMoves({
      position,
      piece,
      rank,
      file,
      moves: pseudo,
    });
  },
};

export default arbiter;
