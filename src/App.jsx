import { Chess } from "chess.js";
import { useState, useEffect } from "react";
import { convertNullsToEmpty, getPieceImgProps, selectPiece } from "./helpers";
import { aiMove, eveluatePosition } from "./ai";

const DEFAULT_POSITION =
  "rn1qk2r/Qppp2pR/2n1pp2/4b3/7N/7K/1PPPPPPP/1NB2B1R w - - 0 1";
// const DEFAULT_POSITION =
// "rnbqk2r/pppp1ppp/5n2/2b1p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4";

const chess = new Chess();

function App() {
  const [board, setBoard] = useState(convertNullsToEmpty(chess.board()));
  const [crrSelection, setCrrSelection] = useState({});

  const handlePiece = (piece = {}) => {
    if (!crrSelection.piece) {
      handleCrrSelection(piece); // no piece is selected yet
    } else {
      if (crrSelection.moves?.some((move) => move.includes(piece.square))) {
        makeMove(piece.square); // move!
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

    // setTimeout(() => {
    //   chess.move(aiMove(chess.fen()));
    //   setBoard(convertNullsToEmpty(chess.board()));
    // }, 500);
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

  useEffect(() => {
    onSelect();
  }, [crrSelection]);

  return (
    <>
      <button onClick={() => aiMove(chess.fen())}>make ai move</button>
      <button onClick={() => console.log(eveluatePosition(chess.fen()))}>
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
