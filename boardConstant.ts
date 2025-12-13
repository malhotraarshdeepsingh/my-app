import { createPosition, copyPosition } from "@/helper";

export const initGame = {
  position: [createPosition()],
  turn: "w",
  canditateMoves: [],
  castling: {
    w: { kingSide: true, queenSide: true },
    b: { kingSide: true, queenSide: true },
  },
};
