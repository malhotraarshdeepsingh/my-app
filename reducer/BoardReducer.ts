import actionTypes from "./actionTypes";

export const BoardReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.NEW_MOVE: {
      let { turn, position } = state;

      turn = turn === "white" ? "black" : "white";
      position = [...position, action.payload];

      return {
        turn,
        ...state,
        position,
      };
    }

    default:
      return state;
  }

  return state;
};
