"use client";

import { useReducer } from "react";

import { initGame } from "@/boardConstant";
import Board from "@/components/chessBoard/Board";

import BoardContext from "@/contexts/BoardContext";
import { BoardReducer } from "@/reducer/BoardReducer";
import MovesPanel from "@/components/chessBoard/MovePanel";

export default function Home() {
  const [state, dispatch] = useReducer(BoardReducer, initGame);

  return (
    <BoardContext.Provider value={{ state, dispatch }}>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <Board />
        <MovesPanel />
      </div>
    </BoardContext.Provider>
  );
}
