"use client";

import { useBoard } from "@/contexts/BoardContext";
import { takeBack } from "@/reducer/actions/move";

const MovesPanel = () => {
  const {
    state,
    dispatch,
  } = useBoard();
    const movesList = state.movesList;

  return (
    <div className="flex flex-col h-full w-full">
      {/* MOVES LIST */}
      <div className="flex flex-wrap content-start overflow-auto text-[1.1em] text-[var(--dark-tile)] flex-1">
        {movesList?.map((move: string, i: number) => {
          const moveNumber = Math.floor(i / 2) + 1;
          const showNumber = i % 2 === 0;

          return (
            <div
              key={i}
              className="relative basis-[35%] pl-[15%] pb-[5px] text-left"
            >
              {showNumber && (
                <span className="absolute left-0 opacity-50">
                  {moveNumber}
                </span>
              )}
              {move}
            </div>
          );
        })}
      </div>

      {/* TAKE BACK BUTTON */}
      <button
        onClick={() => dispatch(takeBack())}
        className="
          mt-2
          px-4 py-2
          rounded-md
          bg-gray-700
          text-white
          hover:bg-gray-600
          active:bg-gray-800
          transition
        "
      >
        Take Back
      </button>
    </div>
  );
};

export default MovesPanel;
