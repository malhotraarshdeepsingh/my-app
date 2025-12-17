import { createPosition, copyPosition } from "@/helper/BoardHelper";

export const initGame = {
  position: [createPosition()],
  turn: "w",
  canditateMoves: [],
  movesList: [],
  castling: {
    w: { kingSide: true, queenSide: true },
    b: { kingSide: true, queenSide: true },
  },
  halfMoveClock: 0,
};
