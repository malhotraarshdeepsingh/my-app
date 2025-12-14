export const positionKey = ({ position, turn, castling }) => {
  return JSON.stringify({
    board: position,
    turn,
    castling,
  });
};

export const isThreefoldRepetition = ({ history, turn, castling }) => {
  const counts = {};

  for (const pos of history) {
    const key = positionKey({
      position: pos,
      turn,
      castling,
    });

    counts[key] = (counts[key] || 0) + 1;
    if (counts[key] >= 3) return true;
  }

  return false;
};
