import { isKingInCheck } from "@/arbiter/attacks";
import { copyPosition } from "@/helper";

const filterLegalMoves = ({ position, piece, rank, file, moves }) => {
  const colour = piece[0];
  const legal = [];

  for (const [r, f] of moves) {
    const next = copyPosition(position);
    next[rank][file] = "";
    next[r][f] = piece;

    if (!isKingInCheck({ position: next, colour })) {
      legal.push([r, f]);
    }
  }

  return legal;
};

export default filterLegalMoves;
