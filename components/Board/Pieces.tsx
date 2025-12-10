"use client";

import { useRef, useState } from "react";
import { createPosition, copyPosition } from "@/helper"; // keep your helper as-is

const pieceImages: Record<string, string> = {
  bk: "/assets/bk.png",
  bq: "/assets/bq.png",
  br: "/assets/br.png",
  bb: "/assets/bb.png",
  bn: "/assets/bn.png",
  bp: "/assets/bp.png",
  wk: "/assets/wk.png",
  wq: "/assets/wq.png",
  wr: "/assets/wr.png",
  wb: "/assets/wb.png",
  wn: "/assets/wn.png",
  wp: "/assets/wp.png",
};

/**
 * Mapping helpers:
 *
 * displayFromLogical(logicalRank, logicalFile, isFlipped)
 *    -> returns { dispRank, dispFile } used for rendering (0..7 top->bottom, left->right)
 *
 * logicalFromDisplay(dispRank, dispFile, isFlipped)
 *    -> returns { rank, file } used for state updates (logical coordinates in your position array)
 *
 * These are exact inverses of each other.
 */

const displayFromLogical = (rank: number, file: number, isFlipped: boolean) => {
  // original createPosition has rank 0 = white back row (logical top)
  // we want white visually at bottom when not flipped, so:
  if (!isFlipped) {
    // not flipped: displayRank = 7 - logicalRank ; displayFile = logicalFile
    return { dispRank: 7 - rank, dispFile: file };
  } else {
    // flipped: displayRank = logicalRank ; displayFile = 7 - logicalFile
    return { dispRank: rank, dispFile: 7 - file };
  }
};

const logicalFromDisplay = (dispRank: number, dispFile: number, isFlipped: boolean) => {
  if (!isFlipped) {
    // inverse of not-flipped mapping
    return { rank: 7 - dispRank, file: dispFile };
  } else {
    // inverse of flipped mapping
    return { rank: dispRank, file: 7 - dispFile };
  }
};

const PieceView = ({
  rank,
  file,
  piece,
  isFlipped,
}: {
  rank: number;
  file: number;
  piece: string;
  isFlipped: boolean;
}) => {
  const onDragStart = (e: any) => {
    // store logical coords + piece id as CSV (keeps state logic)
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${piece},${rank},${file}`);
    // hide while dragging a little
    setTimeout(() => (e.target.style.opacity = "0"), 0);
  };

  const onDragEnd = (e: any) => {
    e.target.style.opacity = "1";
  };

  const { dispRank, dispFile } = displayFromLogical(rank, file, isFlipped);

  return (
    <div
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="absolute w-[12.5%] h-[12.5%] bg-no-repeat bg-center bg-contain"
      style={{
        // use display coords to place piece exactly over the tile
        transform: `translate(${dispFile * 100}%, ${dispRank * 100}%)`,
        backgroundImage: `url(${pieceImages[piece]})`,
      }}
    />
  );
};

const Pieces = ({ isFlipped }: { isFlipped: boolean }) => {
  const boardRef = useRef<HTMLDivElement | null>(null);

  // use your helper initial state (logical coordinates)
  const [position, setPosition] = useState(createPosition());

  // get display square under mouse and convert to logical coordinates
  const getCoords = (e: any) => {
    const rect = boardRef.current!.getBoundingClientRect();
    const size = rect.width / 8;

    // clamp to 0..7 to avoid out-of-board drops
    let dispFile = Math.floor((e.clientX - rect.left) / size);
    let dispRank = Math.floor((e.clientY - rect.top) / size);

    if (dispFile < 0) dispFile = 0;
    if (dispFile > 7) dispFile = 7;
    if (dispRank < 0) dispRank = 0;
    if (dispRank > 7) dispRank = 7;

    // convert displayed square -> logical coords (inverse mapping)
    const { rank, file } = logicalFromDisplay(dispRank, dispFile, isFlipped);
    return { rank, file };
  };

  const onDrop = (e: any) => {
    e.preventDefault();

    const raw = e.dataTransfer.getData("text/plain");
    if (!raw) return;

    const [pieceId, oldRankStr, oldFileStr] = raw.split(",");
    const oldRank = Number(oldRankStr);
    const oldFile = Number(oldFileStr);

    const { rank: newRank, file: newFile } = getCoords(e);

    // do nothing if same square
    if (newRank === oldRank && newFile === oldFile) return;

    const next = copyPosition(position);
    next[oldRank][oldFile] = "";
    next[newRank][newFile] = pieceId;

    setPosition(next);
  };

  const onDragOver = (e: any) => e.preventDefault();

  return (
    // boardRef must be attached to the board container (the same area where tiles render)
    <div ref={boardRef} onDrop={onDrop} onDragOver={onDragOver} className="absolute inset-0 pointer-events-auto">
      {position.map((row, r) =>
        row.map((p, f) =>
          p ? <PieceView key={`${r}-${f}`} rank={r} file={f} piece={p} isFlipped={isFlipped} /> : null
        )
      )}
    </div>
  );
};

export default Pieces;
