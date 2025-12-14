import arbiter from "./arbiter";
import { isKingInCheck } from "./attacks";

export const hasAnyLegalMove = ({
  position,
  prevPosition,
  castling,
  colour,
}) => {
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = position[r][f];
      if (!piece || piece[0] !== colour) continue;

      const moves = arbiter.getRegularMoves({
        piece,
        position,
        prevPosition,
        rank: r,
        file: f,
        castling,
      });

      if (moves.length > 0) {
        return true; // at least one legal move exists
      }
    }
  }

  return false;
};

export const isCheckmate = ({
  position,
  prevPosition,
  castling,
  colour,
}) => {
  if (!isKingInCheck({ position, colour })) return false;

  return !hasAnyLegalMove({
    position,
    prevPosition,
    castling,
    colour,
  });
};

export const isStalemate = ({
  position,
  prevPosition,
  castling,
  colour,
}) => {
  // king must NOT be in check
  if (isKingInCheck({ position, colour })) return false;

  // no legal moves available
  return !hasAnyLegalMove({
    position,
    prevPosition,
    castling,
    colour,
  });
};
