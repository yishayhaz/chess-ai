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

const valueTable = {
  p: 10,
  n: 30,
  b: 30,
  r: 50,
  q: 90,
  k: 0,
};

const eveluatePosition = (fen, turn) => {
  let white = 0;
  let black = 0;

  fen
    .split(" ")[0]
    .split("")
    .forEach((piece) => {
      const value = valueTable[piece.toLowerCase()];
      if (value) {
        if (piece === piece.toLowerCase()) {
          black += value;
        } else white += value;
      }
    });

  return { black, white, sum: turn === "b" ? black - white : white - black };
};

export { getPieceImgProps, convertNullsToEmpty, selectPiece, eveluatePosition };
