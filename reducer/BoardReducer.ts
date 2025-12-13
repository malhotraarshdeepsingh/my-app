import actionTypes from "./actionTypes";

export const BoardReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.NEW_MOVE: {
      const prev = state.position[state.position.length - 1];
      const curr = action.payload;

      const nextCastling = {
        w: { ...state.castling.w },
        b: { ...state.castling.b },
      };

      // ---- KING MOVES ----
      if (prev[7][3] === "wk" && curr[7][3] !== "wk") {
        nextCastling.w.kingSide = false;
        nextCastling.w.queenSide = false;
      }

      if (prev[0][3] === "bk" && curr[0][3] !== "bk") {
        nextCastling.b.kingSide = false;
        nextCastling.b.queenSide = false;
      }

      // ---- ROOK MOVES / CAPTURES ----
      if (prev[7][7] === "wr" && curr[7][7] !== "wr")
        nextCastling.w.kingSide = false;

      if (prev[7][0] === "wr" && curr[7][0] !== "wr")
        nextCastling.w.queenSide = false;

      if (prev[0][7] === "br" && curr[0][7] !== "br")
        nextCastling.b.kingSide = false;

      if (prev[0][0] === "br" && curr[0][0] !== "br")
        nextCastling.b.queenSide = false;

      return {
        ...state,
        position: [...state.position, action.payload],
        castling: nextCastling,
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
};
