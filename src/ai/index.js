import { Chess } from "chess.js";
import { eveluatePosition } from "../helpers";

const scores = {
  WIN: 1_000,
  INFNITY: 1_000_000,
  DRAW: 0,
};

let timer = null;
let amount = 0;
let total = 0;

const aiMove = (fen) => {
  timer = Date.now();

  const chess = new Chess(fen);

  let bestScore = -scores.INFNITY;
  let bestMove;

  for (const move of chess.moves()) {
    amount++;
    chess.move(move);
    const evl = minimax(chess, 0, false);
    chess.undo(move);

    if (evl > bestScore) {
      bestScore = evl;
      bestMove = move;
    }
  }

  timer = ~~((Date.now() - timer) / 1000) + "s";
  total += amount;

  console.log({ bestScore, bestMove, timer, amount, total });

  amount = 0;

  return bestMove;
};

const minimax = (
  board,
  depth = 0,
  isMaximizing = true,
  alpha = -scores.INFNITY,
  beta = scores.INFNITY
) => {
  amount++;
  if (board.isCheckmate()) {
    if (isMaximizing) {
      return -scores.WIN + depth;
    } else {
      return scores.WIN - depth;
    }
  }

  if (depth >= 3) {
    return eveluatePosition(board.fen(), board.turn()).sum;
  }

  if (board.isDraw()) {
    return 0;
  }

  if (isMaximizing) {
    let best = -scores.INFNITY;

    for (const move of board.moves()) {
      board.move(move);
      const evl = minimax(board, depth + 1, false, alpha, beta);
      board.undo();

      best = Math.max(best, evl);
      alpha = Math.max(alpha, best);

      if (beta <= alpha) {
        break;
      }
    }

    return best;
  } else {
    let best = scores.INFNITY;

    for (const move of board.moves()) {
      board.move(move);
      const evl = minimax(board, depth + 1, true, alpha, beta);
      board.undo();

      best = Math.min(best, evl);
      beta = Math.min(beta, best);

      if (beta <= alpha) {
        break;
      }
    }

    return best;
  }
};

export { aiMove };
