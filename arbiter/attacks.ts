import getPseudoMoves from "@/arbiter/pseudo";

export const isSquareAttacked = ({ position, rank, file, byColour }) => {
  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      const piece = position[r][f];
      if (!piece || piece[0] !== byColour) continue;

      // generate pseudo-legal moves (ignore check)
      const moves = getPseudoMoves({
        piece,
        position,
        rank: r,
        file: f,
      });

      if (moves.some(([mr, mf]) => mr === rank && mf === file)) {
        return true;
      }
    }
  }
  return false;
};

export const isKingInCheck = ({ position, colour }) => {
  let kingRank = -1;
  let kingFile = -1;

  for (let r = 0; r < 8; r++) {
    for (let f = 0; f < 8; f++) {
      if (position[r][f] === colour + "k") {
        kingRank = r;
        kingFile = f;
        break;
      }
    }
  }

  const enemy = colour === "w" ? "b" : "w";

  return isSquareAttacked({
    position,
    rank: kingRank,
    file: kingFile,
    byColour: enemy,
  });
};
