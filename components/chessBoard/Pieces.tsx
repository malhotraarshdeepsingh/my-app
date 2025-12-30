"use client";

import { useRef, useState } from "react";
import { useBoard } from "@/contexts/BoardContext";
import {
  copyPosition,
  getCheckSuffix,
  getGameResult,
  getNewMoveNotation,
} from "@/helper/BoardHelper";
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
  const castling = state.castling;
  const turn = state.turn;

  const onDragStart = (e: any) => {
    if (turn !== piece[0]) return;

    const moves = arbiter.getRegularMoves({
      piece,
      position: position,
      prevPosition: prevPosition,
      rank,
      file,
      castling: castling,
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
  const [promotion, setPromotion] = useState<null | {
    rank: number;
    file: number;
    color: "w" | "b";
  }>(null);

  const [next, setnext] = useState<any>(null);

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

  const promotePawn = (type: "q" | "r" | "b" | "n") => {
    if (!promotion || !next) return;

    const { rank, file, color } = promotion;
    next[rank][file] = color + type;

    const newMove = getNewMoveNotation({
      ...state.selectedPiece,
      x: promotion.rank,
      y: promotion.file,
      position: state.position[state.position.length - 1],
      promotesTo: type,
    });

    dispatch(makeNextPosition({ next, newMove }));
    dispatch(generateCanditateMoves({ canditateMoves: [] }));

    const result = getGameResult({
      position: next,
      prevPosition: state.position[state.position.length - 1],
      castling: state.castling,
      turn: state.turn === "w" ? "b" : "w",
      history: [...state.position, next],
      halfMoveClock: state.halfMoveClock,
    });

    if (result) {
      console.log("GAME OVER:", result);
    }

    setPromotion(null);
    setnext(null);
    setLegalMoves([]);
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

    // ---------- PAWN PROMOTION (WITH CHOICE) ----------
    if (piece.endsWith("p")) {
      const promotionRank = piece[0] === "w" ? 0 : 7;

      if (rank === promotionRank) {
        setnext(next);
        setPromotion({
          rank,
          file,
          color: piece[0],
        });

        state.selectedPiece = {
          piece,
          rank: oldRank,
          file: oldFile,
        };
        return;
      }
    }

    // ---------- CASTLING EXECUTION ----------
    if (piece.endsWith("k") && Math.abs(file - oldFile) === 2) {
      const rank = piece[0] === "w" ? 7 : 0;

      // king side
      if (file === 5) {
        next[rank][4] = piece[0] + "r";
        next[rank][7] = "";
      }

      // queen side
      if (file === 1) {
        next[rank][2] = piece[0] + "r";
        next[rank][0] = "";
      }
    }

    const suffix = getCheckSuffix({
      position: next,
      prevPosition: position,
      castling: state.castling,
      turn: state.turn,
    });

    dispatch(
      makeNextPosition({
        next,
        newMove:
          getNewMoveNotation({
            piece,
            rank: oldRank,
            file: oldFile,
            x: rank,
            y: file,
            position: state.position[state.position.length - 1],
          }) + suffix,
      })
    );

    const result = getGameResult({
      position: next,
      prevPosition: position,
      castling: state.castling,
      turn: state.turn === "w" ? "b" : "w", // IMPORTANT
      history: [...state.position, next],
      halfMoveClock: state.halfMoveClock,
    });

    if (result) {
      console.log("GAME OVER:", result);
      // later:
      // dispatch(setGameResult(result))
    }

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
      {/* PIECES */}
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

      {/* PROMOTION UI (ADD HERE) */}
      {promotion && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex gap-3 bg-white p-4 rounded-xl shadow-lg">
            {["q", "r", "b", "n"].map((t) => (
              <button
                key={t}
                onClick={() => promotePawn(t as any)}
                className="
            w-20 h-20
            bg-[#f0d9b5]
            hover:bg-[#b58863]
            rounded-lg
            flex items-center justify-center
            transition
          "
              >
                <span className="text-sm font-semibold uppercase mt-1">
                  {t}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pieces;
