"use client";

import { useRef, useState } from "react";
import { createPosition, copyPosition } from "@/helper"; 

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

const displayFromLogical = (rank: number, file: number, isFlipped: boolean) => {
  if (!isFlipped) {
    return { dispRank: 7 - rank, dispFile: file };
  } else {
    return { dispRank: rank, dispFile: 7 - file };
  }
};

const logicalFromDisplay = (dispRank: number, dispFile: number, isFlipped: boolean) => {
  if (!isFlipped) {
    return { rank: 7 - dispRank, file: dispFile };
  } else {
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
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${piece},${rank},${file}`);
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
        transform: `translate(${dispFile * 100}%, ${dispRank * 100}%)`,
        backgroundImage: `url(${pieceImages[piece]})`,
      }}
    />
  );
};

const Pieces = ({ isFlipped }: { isFlipped: boolean }) => {
  const boardRef = useRef<HTMLDivElement | null>(null);

  const [position, setPosition] = useState(createPosition());

  const getCoords = (e: any) => {
    const rect = boardRef.current!.getBoundingClientRect();
    const size = rect.width / 8;

    let dispFile = Math.floor((e.clientX - rect.left) / size);
    let dispRank = Math.floor((e.clientY - rect.top) / size);

    if (dispFile < 0) dispFile = 0;
    if (dispFile > 7) dispFile = 7;
    if (dispRank < 0) dispRank = 0;
    if (dispRank > 7) dispRank = 7;

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

    if (newRank === oldRank && newFile === oldFile) return;

    const next = copyPosition(position);
    next[oldRank][oldFile] = "";
    next[newRank][newFile] = pieceId;

    setPosition(next);
  };

  const onDragOver = (e: any) => e.preventDefault();

  return (
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
