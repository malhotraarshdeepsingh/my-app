"use client";

const Board = () => {
  const ranks = Array.from({ length: 8 }, (_, i) => 8 - i);
  const files = Array.from({ length: 8 }, (_, i) => i + 1);

  const getCharacter = (file: number) => String.fromCharCode(file + 96);

  const tileClass = (i: number, j: number) => {
    return `
      relative 
      w-[var(--tile-size)] 
      h-[var(--tile-size)] 
      ${(i + j) % 2 === 0 ? "bg-[var(--dark-tile)]" : "bg-[var(--light-tile)]"}
    `;
  };

  return (
    <div className="w-full flex justify-start items-start">   {/* LEFT ALIGN */}
      <div className="grid grid-cols-[calc(0.25*var(--tile-size))_calc(8*var(--tile-size))]">
        
        {/* RANKS */}
        <div className="flex flex-col justify-around items-center text-[var(--dark-tile)]">
          {ranks.map((r) => (
            <span key={r}>{r}</span>
          ))}
        </div>

        {/* TILES */}
        <div className="grid grid-cols-8 grid-rows-8 w-[calc(8*var(--tile-size))]">
          {ranks.map((rank, i) =>
            files.map((file, j) => (
              <div key={`${file}${rank}`} className={tileClass(7 - i, j)} />
            ))
          )}
        </div>

        {/* FILE LETTERS */}
        <div className="col-start-2 flex justify-around items-center text-[var(--dark-tile)] h-[calc(.25*var(--tile-size))]">
          {files.map((f) => (
            <span key={f}>{getCharacter(f)}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Board;
