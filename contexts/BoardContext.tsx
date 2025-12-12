import { createContext, useContext, useState, useEffect } from "react";

const BoardContext = createContext();

export const useBoard = () => useContext(BoardContext);

export default BoardContext;
