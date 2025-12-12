import actionTypes from "../actionTypes";

export const makeNextPosition = (next) => ({
  type: actionTypes.NEW_MOVE,
  payload: next,
});
