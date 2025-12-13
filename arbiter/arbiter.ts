import { getKnightMoves, getRookMoves } from "@/arbiter/getMove";

const arbiter = {
  getRegularMoves: function ({ piece, position, rank, file }) {
    if (piece.endsWith("r")) {
      return getRookMoves({ piece, position, rank, file });
    }
    if (piece.endsWith("n")) {
      return getKnightMoves({ piece, position, rank, file });
    }
    return [];
  },
};

export default arbiter;
