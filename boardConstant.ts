import { createPosition, copyPosition } from "@/helper";

export const initGame = {
  position: [createPosition()],
  turn: "w",
  canditateMoves: [],
};
