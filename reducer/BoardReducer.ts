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

      let reset = false;

      for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
          if (prev[r][f] !== curr[r][f]) {
            if (prev[r][f]?.endsWith("p")) {
              reset = true;
            }

            // check pieceCounter for captures
            const prevpieces = [];
            const pieces = [];

            for (let r = 0; r < 8; r++) {
              for (let f = 0; f < 8; f++) {
                const p = prev[r][f];
                if (p) prevpieces.push(p);
              }
            }

            for (let r = 0; r < 8; r++) {
              for (let f = 0; f < 8; f++) {
                const p = curr[r][f];
                if (p) pieces.push(p);
              }
            }

            if (pieces.length < prevpieces.length) {
              reset = true;
            }
          }
        }
      }

      return {
        ...state,
        position: [...state.position, action.payload],
        castling: nextCastling,
        turn: state.turn === "w" ? "b" : "w",
        halfMoveClock: reset ? 0 : state.halfMoveClock + 1,
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
