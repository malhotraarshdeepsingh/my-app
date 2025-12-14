"use client";

import { useState } from "react";
import Pieces from "./Pieces";
import { useBoard } from "@/contexts/BoardContext";
import { logicalFromDisplay } from "./Pieces";
import { isKingInCheck } from "@/arbiter/attacks";
import { isCheckmate, isStalemate } from "@/arbiter/checkmate";
import { isDraw } from "@/arbiter/draw";

const baseRanks = [1, 2, 3, 4, 5, 6, 7, 8];
const baseFiles = ["h", "g", "f", "e", "d", "c", "b", "a"];

export default function Board() {
  const [isFlipped, setIsFlipped] = useState(false);

  // displayed labels
  const ranksLabels = isFlipped ? [...baseRanks].reverse() : baseRanks;
  const filesLabels = isFlipped ? [...baseFiles].reverse() : baseFiles;

  const { state, dispatch } = useBoard();
  const position = state.position[state.position.length - 1];

  const inCheck = isKingInCheck({
    position,
    colour: state.turn,
  });

  const findKing = (colour: "w" | "b") => {
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        if (position[r][f] === colour + "k") {
          return { rank: r, file: f };
        }
      }
    }
    return null;
  };

  const kingSquare = inCheck ? findKing(state.turn) : null;

  const checkmate = isCheckmate({
    position,
    prevPosition:
      state.position.length > 1
        ? state.position[state.position.length - 2]
        : null,
    castling: state.castling,
    colour: state.turn,
  });

  const stalemate = isStalemate({
    position,
    prevPosition:
      state.position.length > 1
        ? state.position[state.position.length - 2]
        : null,
    castling: state.castling,
    colour: state.turn,
  });

  const draw = isDraw({
    position,
    history: state.position,
    turn: state.turn,
    castling: state.castling,
    halfMoveClock: state.halfMoveClock,
  });

  const getClassName = (i, j) => {
    let c = "tile";
    c += (i + j) % 2 === 0 ? " dark-tile" : " light-tile";

    if (state.canditateMoves.find((m) => m[0] === i && m[1] === j)) {
      if (position[i][j]) c += " attacking";
      else c += " highlight";
    }
  };

  // helper for tile color using display coordinates
  const tileClassByDisplay = (dispRank: number, dispFile: number) => {
    // convert display → logical
    const { rank, file } = logicalFromDisplay(dispRank, dispFile, isFlipped);

    let c = `relative w-[var(--tile-size)] h-[var(--tile-size)]`;

    c +=
      (dispRank + dispFile) % 2 === 0
        ? " bg-[var(--dark-tile)]"
        : " bg-[var(--light-tile)]";

    const isCandidate = state.canditateMoves?.some(
      (m) => m[0] === rank && m[1] === file
    );

    if (isCandidate) {
      if (position[rank][file]) c += " attacking";
      else c += " highlight";
    }

    if (
      inCheck &&
      kingSquare &&
      kingSquare.rank === rank &&
      kingSquare.file === file
    ) {
      c += " check";
    }

    return c;
  };

  return (
    <div className="w-full flex flex-col items-start gap-3">
      <div className="flex">
        {/* Left ranks column */}
        <div className="flex flex-col justify-between mr-1 h-[calc(8*var(--tile-size))]">
          {ranksLabels.map((r) => (
            <span
              key={r}
              className="text-[var(--dark-tile)] leading-none"
              style={{ height: "var(--tile-size)" }}
            >
              {r}
            </span>
          ))}
        </div>

        {/* BOARD */}
        <div className="flex flex-col">
          <div className="relative w-[calc(8*var(--tile-size))] h-[calc(8*var(--tile-size))]">
            {/* TILES */}
            <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
              {Array.from({ length: 8 }).map((_, dispRank) =>
                Array.from({ length: 8 }).map((_, dispFile) => (
                  <div
                    key={`${dispRank}-${dispFile}`}
                    className={tileClassByDisplay(dispRank, dispFile)}
                  />
                ))
              )}
            </div>

            {/* PIECES */}
            <Pieces isFlipped={isFlipped} />
          </div>

          {/* FILE LABELS */}
          <div className="flex justify-between mt-1">
            {filesLabels.map((f, i) => (
              <span
                key={f}
                className="text-[var(--dark-tile)]"
                style={{ width: "var(--tile-size)", textAlign: "center" }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>
      {(checkmate || stalemate || draw) && (
        <div className="mt-4 text-xl font-bold text-red-600">
          {checkmate ? "CHECKMATE" : stalemate ? "STALEMATE" : "DRAW"}
        </div>
      )}
      <button
        onClick={() => setIsFlipped((s) => !s)}
        className="px-3 py-1 bg-gray-700 text-white rounded"
      >
        Flip Board
      </button>
    </div>
  );
}
