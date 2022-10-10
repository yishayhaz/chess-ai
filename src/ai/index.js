import { Chess } from "chess.js";

const scores = {
  WIN: 1_000,
  INFNITY: 1_000_000,
  DRAW: 0,
};

const aiMove = (fen) => {
  const chess = new Chess(fen);

  let bestScore = -scores.INFNITY;
  let bestMove;

  for (const move of chess.moves()) {
    chess.move(move);
    const evl = minimax(chess, 0, false);
    chess.undo(move);

    if (evl > bestScore) {
      bestScore = evl;
      bestMove = move;
    }
  }

  console.log({ bestScore, bestMove });
};

const minimax = (board, depth = 0, isMaximizing = true) => {
  if (board.isCheckmate()) {
    if (isMaximizing) {
      return -scores.WIN + depth;
    } else {
      return scores.WIN - depth;
    }
  }

  if (depth >= 3) {
    const { sum } = eveluatePosition(board.fen());
    // sum = white-black

    if (board.turn() === "b") {
      return -sum;
    } else return sum;
  }

  if (board.isDraw()) {
    return 0;
  }

  if (isMaximizing) {
    let best = -scores.INFNITY;

    for (const move of board.moves()) {
      board.move(move);
      const evl = minimax(board, depth + 1, false);
      board.undo();

      best = Math.max(best, evl);
    }

    return best;
  } else {
    let best = scores.INFNITY;

    for (const move of board.moves()) {
      board.move(move);
      const evl = minimax(board, depth + 1, true);
      board.undo();

      best = Math.min(best, evl);
    }

    return best;
  }
};

const valueTable = {
  p: 10,
  n: 30,
  b: 30,
  r: 50,
  q: 90,
  k: 0,
};

const eveluatePosition = (fen) => {
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

  return { black, white, sum: white - black };
};

export { aiMove, eveluatePosition };
