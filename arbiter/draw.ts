import { isThreefoldRepetition } from "./repetition";
import { isInsufficientMaterial } from "./insufficient";

const isFiftyMoveRule = (halfMoveClock) => {
  return halfMoveClock >= 100;
};

export const isDraw = ({
  position,
  history,
  turn,
  halfMoveClock,
  castling,
}) => {
  return (
    isThreefoldRepetition({ history, turn, castling }) ||
    isFiftyMoveRule(halfMoveClock) ||
    isInsufficientMaterial(position)
  );
};
