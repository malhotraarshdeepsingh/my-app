"use client";

import Pieces from "./Pieces";

const Board = () => {
  const ranks = [8,7,6,5,4,3,2,1];
  const files = ["a","b","c","d","e","f","g","h"];

  const tileClass = (i:number, j:number) =>
    `relative w-[var(--tile-size)] h-[var(--tile-size)] ${
      (i + j) % 2 === 0 ? "bg-[var(--dark-tile)]" : "bg-[var(--light-tile)]"
    }`;

  return (
    <div className="w-full flex justify-start items-start">
      {/* BOARD WRAPPER */}
      <div className="flex">
        {/* LEFT RANKS */}
        <div className="flex flex-col justify-between mr-1 h-[calc(8*var(--tile-size))]">
          {ranks.map((r) => (
            <span
              key={r}
              className="text-[var(--dark-tile)] leading-none"
              style={{ height: "var(--tile-size)" }}
            >
              {r}
            </span>
          ))}
        </div>

        {/* BOARD + FILES */}
        <div className="flex flex-col">
          {/* BOARD (tiles + pieces) */}
          <div className="relative w-[calc(8*var(--tile-size))] h-[calc(8*var(--tile-size))]">
            {/* TILES */}
            <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
              {ranks.map((rank, i) =>
                files.map((file, j) => (
                  <div key={`${file}${rank}`} className={tileClass(i, j)} />
                ))
              )}
            </div>

            {/* PIECES OVERLAY */}
            <Pieces />
          </div>

          {/* FILE LETTERS */}
          <div className="flex justify-between mt-1">
            {files.map((f) => (
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
    </div>
  );
};

export default Board;
