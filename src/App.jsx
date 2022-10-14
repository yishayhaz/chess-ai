import { Chess } from "chess.js";
import { useState, useEffect } from "react";
import {
  convertNullsToEmpty,
  getPieceImgProps,
  eveluatePosition,
  selectPiece,
} from "./helpers";
import { aiMove } from "./ai";

// const DEFAULT_POSITION =
//   "rn1qk2r/Qppp2pR/2n1pp2/4b3/7N/7K/1PPPPPPP/1NB2B1R w - - 0 1";
// const DEFAULT_POSITION = "8/7k/8/8/8/5Rp1/6R1/K7 w - - 0 1";
// "rnbqk2r/pppp1ppp/5n2/2b1p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4";

// const DEFAULT_POSITION = "1k1r4/ppN5/8/8/5Q2/8/7B/4K3 w - - 0 1"; // smothered mate
const DEFAULT_POSITION =
  "6k1/3b3r/1p1p4/p1n2p2/1PPNpP1q/P3Q1p1/1R1RB1P1/5K2 b - - 0 1";

const chess = new Chess(DEFAULT_POSITION);

function App() {
  const [board, setBoard] = useState(convertNullsToEmpty(chess.board()));
  const [crrSelection, setCrrSelection] = useState({});
  const [robotControl, setRobotControl] = useState(false);

  const handlePiece = (piece = {}) => {
    if (!crrSelection.piece) {
      handleCrrSelection(piece); // no piece is selected yet
    } else {
      if (crrSelection.moves?.some((move) => move.includes(piece.square))) {
        makeMove(piece.square); // move!
        handleAiMove();
      } else {
        handleCrrSelection(piece); // illegal move
      }
    }
  };

  const onSelect = () => {
    if (crrSelection.moves) {
      setBoard(selectPiece(board, crrSelection.moves)); // deselect
    } else {
      if (board.some((square) => square.isSelected)) {
        setBoard(convertNullsToEmpty(chess.board()));
        return;
      }
    }
  };

  const makeMove = (to) => {
    chess.move({ from: crrSelection.piece.square, to });
    setCrrSelection({});
    setBoard(convertNullsToEmpty(chess.board()));
    checkGameStatus();
  };

  const checkGameStatus = () => {
    if (chess.isCheckmate()) {
      console.log("CHECKMATE");
      console.log(toggleTurn(chess.turn()) + " won");
    }
  };

  const toggleTurn = (turn) => (turn === "b" ? "w" : "b");

  const handleCrrSelection = (piece) => {
    setCrrSelection({ piece, moves: chess.moves({ square: piece.square }) });
  };

  const handleAiMove = async () => {
    console.log("starting ai move");
    const bestMove = await aiPromise();
    console.log({ bestMove });
    chess.move(bestMove);
    setBoard(convertNullsToEmpty(chess.board()));
  };

  function aiPromise() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(aiMove(chess.fen()));
      }, 100);
    });
  }

  const giveAwayControl = () => {
    if (!robotControl) {
      handleAiMove();
    }
    setRobotControl(!robotControl);
  };

  useEffect(() => {
    onSelect();
  }, [crrSelection]);

  return (
    <>
      <button onClick={giveAwayControl}>Let the robot control</button>
      <button
        onClick={() => window.alert(eveluatePosition(chess.fen()).sum / 10)}
      >
        eveal
      </button>
      <div className="board">
        {board.map((piece, index) => (
          <div
            key={index}
            className={`square ${piece.isSelected ? "hover" : ""}`}
            style={{ "--src": "url('" + getPieceImgProps(piece) + "')" }}
            onClick={() => handlePiece(piece)}
          ></div>
        ))}
      </div>
    </>
  );
}

export default App;
