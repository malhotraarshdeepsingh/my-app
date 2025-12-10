"use client";

import { useState } from "react";
import Pieces from "./Pieces";

const baseRanks = [8, 7, 6, 5, 4, 3, 2, 1];
const baseFiles = ["a", "b", "c", "d", "e", "f", "g", "h"];

export default function Board() {
  const [isFlipped, setIsFlipped] = useState(false);

  // displayed labels (top->bottom and left->right)
  const ranksLabels = isFlipped ? [...baseRanks].reverse() : baseRanks;
  const filesLabels = isFlipped ? [...baseFiles].reverse() : baseFiles;

  // helper for tile color using display coordinates (so pattern flips visually)
  const tileClassByDisplay = (dispRank: number, dispFile: number) =>
    `relative w-[var(--tile-size)] h-[var(--tile-size)] ${
      (dispRank + dispFile) % 2 === 0
        ? "bg-[var(--dark-tile)]"
        : "bg-[var(--light-tile)]"
    }`;

  return (
    <div className="w-full flex flex-col items-start gap-3">
      <div className="flex">
        {/* Left ranks column - size locked to 8 * tile-size */}
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

        {/* BOARD (tiles + pieces) */}
        <div className="flex flex-col">
          {/* board container = reference area for pieces. this MUST match Pieces overlay bounding box */}
          <div className="relative w-[calc(8*var(--tile-size))] h-[calc(8*var(--tile-size))]">
            {/* TILES: render by display coords so board pattern is correct when flipped */}
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

            {/* PIECES overlay receives isFlipped so it uses the same mapping */}
            <Pieces isFlipped={isFlipped} />
          </div>

          {/* FILE LABELS - below board */}
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
      <button
        onClick={() => setIsFlipped((s) => !s)}
        className="px-3 py-1 bg-gray-700 text-white rounded"
      >
        Flip Board
      </button>
    </div>
  );
}
