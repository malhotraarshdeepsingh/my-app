import { getRookMoves } from "@/arbiter/getMove";

const arbiter = {
    getRegularMoves: function({ piece, position, rank, file }) {
        return getRookMoves({ piece, position, rank, file });
    }
}

export default arbiter;