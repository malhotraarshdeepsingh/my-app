import {createContext, useContext, useState, useEffect} from 'react';

const BoardContext = createContext();

export const BoardProvider = () => {
    return useContext(BoardContext);
};

export default BoardContext;