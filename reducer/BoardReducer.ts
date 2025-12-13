import actionTypes from "./actionTypes";

export const BoardReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.NEW_MOVE: {
      return {
        ...state,
        position: [...state.position, action.payload],
        turn: state.turn === "w" ? "b" : "w",
      };
    }

    case actionTypes.GENERATE_CANDITATE_MOVES: {
      return {
        ...state,
        canditateMoves: action.payload,
      };
    }

    default:
      return state;
  }

  return state;
};
