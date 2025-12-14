import actionTypes from "../actionTypes";

export const makeNextPosition = (next) => ({
  type: actionTypes.NEW_MOVE,
  payload: next,
});

export const generateCanditateMoves = ({ canditateMoves }) => ({
  type: actionTypes.GENERATE_CANDITATE_MOVES,
  payload: canditateMoves,
});
