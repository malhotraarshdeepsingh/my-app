"use client";

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

const Piece = ({
  rank,
  file,
  piece,
}: {
  rank: number;
  file: number;
  piece: string;
}) => {
  return (
    <div
      draggable={true}
      className="
        absolute 
        w-[12.5%] 
        h-[12.5%]
        bg-center 
        bg-no-repeat 
        bg-contain
      "
      style={{
        transform: `translate(${file * 100}%, ${rank * 100}%)`,
        backgroundImage: `url(${pieceImages[piece]})`,
      }}
    />
  );
};

const Pieces = () => {
  const position: string[][] = Array.from({ length: 8 }, () =>
    Array(8).fill("")
  );

  // Pawns
  for (let i = 0; i < 8; i++) {
    position[6][i] = "bp";
    position[1][i] = "wp";
  }

  // White
  position[0][0] = "wr";
  position[0][1] = "wn";
  position[0][2] = "wb";
  position[0][3] = "wq";
  position[0][4] = "wk";
  position[0][5] = "wb";
  position[0][6] = "wn";
  position[0][7] = "wr";

  // Black
  position[7][0] = "br";
  position[7][1] = "bn";
  position[7][2] = "bb";
  position[7][3] = "bq";
  position[7][4] = "bk";
  position[7][5] = "bb";
  position[7][6] = "bn";
  position[7][7] = "br";

  return (
    <div className="absolute inset-0 pointer-events-none">
      {position.map((row, r) =>
        row.map((p, f) =>
          p ? <Piece key={`${r}-${f}`} rank={r} file={f} piece={p} /> : null
        )
      )}
    </div>
  );
};

export default Pieces;
