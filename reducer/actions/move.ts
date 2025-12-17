import actionTypes from "../actionTypes";

export const makeNextPosition = ({next, newMove}) => ({
  type: actionTypes.NEW_MOVE,
  payload: {next, newMove},
});

export const generateCanditateMoves = ({ canditateMoves }) => ({
  type: actionTypes.GENERATE_CANDITATE_MOVES,
  payload: canditateMoves,
});

export const takeBack = () => ({
  type: actionTypes.TAKE_BACK,
});
