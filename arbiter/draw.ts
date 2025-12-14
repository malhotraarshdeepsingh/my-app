import { isThreefoldRepetition } from "./repetition";
import { isInsufficientMaterial } from "./insufficient";

export const isDraw = ({
  position,
  history,
  turn,
  castling,
}) => {
  return (
    isThreefoldRepetition({ history, turn, castling }) ||
    isInsufficientMaterial(position)
  );
};

