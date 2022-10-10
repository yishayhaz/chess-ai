const convertPgnToObj = (pgn) =>
  pgn
    .slice(" ")[0]
    .replaceAll("/", "")
    .split("")
    .map((piece) => (Number(piece) ? Array(Number(piece)).fill(null) : piece));

const boardRanks = ["a", "b", "c", "d", "e", "f", "g", "h"];

const convertNullsToEmpty = (board) => {
  const res = board.flatMap((rank, r_i) => {
    return rank.map((file, f_i) => {
      if (file === null) {
        return {
          square: boardRanks[f_i] + "" + (8 - r_i),
        };
      }
      return file;
    });
  });

  return res;
};

const selectPiece = (board, moves) =>
  board.map((square) => {
    if (moves?.some((move) => move.includes(square.square))) {
      square.isSelected = true;
    } else if (square.isSelected) {
      square.isSelected = false;
    }
    return square;
  });

const getPieceImgProps = (piece) => {
  let src = "";

  if (piece.type && piece.color) {
    src = "pieces/" + piece.color + piece.type + ".png";
  }

  return src;
};

export { getPieceImgProps, convertNullsToEmpty, selectPiece };
