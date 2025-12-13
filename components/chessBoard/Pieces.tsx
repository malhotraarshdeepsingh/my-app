"use client";

import { useRef, useState } from "react";
import { useBoard } from "@/contexts/BoardContext";
import { copyPosition } from "@/helper";
import {
  generateCanditateMoves,
  makeNextPosition,
} from "@/reducer/actions/move";
import arbiter from "@/arbiter/arbiter";

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

const displayFromLogical = (rank: number, file: number, flipped: boolean) =>
  !flipped
    ? { dispRank: 7 - rank, dispFile: file }
    : { dispRank: rank, dispFile: 7 - file };

export const logicalFromDisplay = (
  dispRank: number,
  dispFile: number,
  flipped: boolean
) =>
  !flipped
    ? { rank: 7 - dispRank, file: dispFile }
    : { rank: dispRank, file: 7 - dispFile };

const PieceView = ({ rank, file, piece, isFlipped, setLegalMoves }: any) => {
  const { state, dispatch } = useBoard();
  const position = state.position[state.position.length - 1];
  const prevPosition = state.position[state.position.length - 2];
  const turn = state.turn;

  const onDragStart = (e: any) => {
    if (turn !== piece[0]) return;

    const moves = arbiter.getRegularMoves({
      piece,
      position: position,
      prevPosition: prevPosition,
      rank,
      file,
    });
    dispatch(generateCanditateMoves({ canditateMoves: moves }));
    setLegalMoves(moves);

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${piece},${rank},${file}`);

    setTimeout(() => (e.target.style.opacity = "0"), 0);
  };

  const onDragEnd = (e: any) => {
    e.target.style.opacity = "1";
    setLegalMoves([]);
    dispatch(generateCanditateMoves({ canditateMoves: [] }));
  };

  const { dispRank, dispFile } = displayFromLogical(rank, file, isFlipped);

  return (
    <div
      draggable
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
  const boardRef = useRef<HTMLDivElement>(null);
  const { state, dispatch } = useBoard();
  const position = state.position[state.position.length - 1];

  const [legalMoves, setLegalMoves] = useState<number[][]>([]);

  const getCoords = (e: any) => {
    const rect = boardRef.current!.getBoundingClientRect();
    const size = rect.width / 8;

    const dispFile = Math.min(
      7,
      Math.max(0, Math.floor((e.clientX - rect.left) / size))
    );
    const dispRank = Math.min(
      7,
      Math.max(0, Math.floor((e.clientY - rect.top) / size))
    );

    return logicalFromDisplay(dispRank, dispFile, isFlipped);
  };

  const onDrop = (e: any) => {
    e.preventDefault();

    const raw = e.dataTransfer.getData("text/plain");
    if (!raw) return;

    const [piece, r0, f0] = raw.split(",");
    const oldRank = +r0;
    const oldFile = +f0;

    const { rank, file } = getCoords(e);

    const isLegal = legalMoves.some(([r, f]) => r === rank && f === file);
    if (!isLegal) return;

    const next = copyPosition(position);
    next[oldRank][oldFile] = "";
    next[rank][file] = piece;

    // en passant capture removal
    if (
      piece.endsWith("p") &&
      file !== oldFile &&
      position[rank][file] === ""
    ) {
      next[oldRank][file] = ""; // remove pawn that moved two squares
    }

    dispatch(makeNextPosition(next));
    dispatch(generateCanditateMoves({ canditateMoves: [] }));
    setLegalMoves([]);
  };

  return (
    <div
      ref={boardRef}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      className="absolute inset-0"
    >
      {position.map((row, r) =>
        row.map((p, f) =>
          p ? (
            <PieceView
              key={`${r}-${f}`}
              rank={r}
              file={f}
              piece={p}
              isFlipped={isFlipped}
              setLegalMoves={setLegalMoves}
            />
          ) : null
        )
      )}
    </div>
  );
};

export default Pieces;
