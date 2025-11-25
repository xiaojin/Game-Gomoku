import React, { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import Controls from './components/Controls';
import { Player, BoardState, Coordinates, GameState } from './types';
import { createEmptyBoard, checkWin, isBoardFull } from './services/gameLogic';
import { getAiMove } from './services/geminiService';

const App: React.FC = () => {
  // State
  const [board, setBoard] = useState<BoardState>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>(Player.Black);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [winningLine, setWinningLine] = useState<Coordinates[] | null>(null);
  const [lastMove, setLastMove] = useState<Coordinates | null>(null);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [gameActive, setGameActive] = useState<boolean>(true);

  // Initialize Game
  const resetGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPlayer(Player.Black);
    setWinner(null);
    setWinningLine(null);
    setLastMove(null);
    setIsAiThinking(false);
    setGameActive(true);
  };

  // Handle Turn logic (checking win/draw)
  const processTurn = (newBoard: BoardState, move: Coordinates, player: Player) => {
    // Check Win
    const winLine = checkWin(newBoard, move, player);
    if (winLine) {
      setWinningLine(winLine);
      setWinner(player);
      setGameActive(false);
      return;
    }

    // Check Draw
    if (isBoardFull(newBoard)) {
      setWinner('draw');
      setGameActive(false);
      return;
    }

    // Switch Player
    setCurrentPlayer(player === Player.Black ? Player.White : Player.Black);
  };

  // Handle Human Move
  const handleCellClick = (row: number, col: number) => {
    if (!gameActive || isAiThinking || board[row][col] !== Player.None || currentPlayer !== Player.Black) {
      return;
    }

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = Player.Black;
    setBoard(newBoard);
    setLastMove({ row, col });
    
    processTurn(newBoard, { row, col }, Player.Black);
  };

  // Handle AI Move
  const makeAiMove = useCallback(async () => {
    if (!gameActive || currentPlayer !== Player.White) return;

    setIsAiThinking(true);

    try {
      const move = await getAiMove(board);
      
      if (move.row === -1) {
        // Fallback if no moves possible (shouldn't happen unless board full, covered by checks)
        setWinner('draw');
        setGameActive(false);
        setIsAiThinking(false);
        return;
      }

      setBoard(prev => {
        const newBoard = prev.map(r => [...r]);
        newBoard[move.row][move.col] = Player.White;
        
        // We need to verify state didn't change while AI was thinking (e.g. reset pressed)
        // Ideally we use refs or checks, but here we just proceed.
        
        // Need to run processTurn logic here, but since setState is async and processTurn 
        // triggers state updates, we can just do it inline for the check logic or use useEffect?
        // Let's do inline calculation to update winner state immediately with the board update.
        
        const winLine = checkWin(newBoard, move, Player.White);
        if (winLine) {
          setWinningLine(winLine);
          setWinner(Player.White);
          setGameActive(false);
        } else if (isBoardFull(newBoard)) {
          setWinner('draw');
          setGameActive(false);
        } else {
           setCurrentPlayer(Player.Black);
        }
        
        return newBoard;
      });
      
      setLastMove(move);

    } catch (e) {
      console.error("AI Move failed", e);
    } finally {
      setIsAiThinking(false);
    }
  }, [board, currentPlayer, gameActive]);

  // Effect to trigger AI turn
  useEffect(() => {
    if (currentPlayer === Player.White && gameActive && !winner) {
      // Small delay for realism so it doesn't feel instant if API is super fast
      const timer = setTimeout(() => {
         makeAiMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, gameActive, winner, makeAiMove]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-stone-100 selection:bg-amber-200">
      <div className="max-w-4xl w-full flex flex-col items-center">
        
        <header className="mb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-800 tracking-tight mb-2">
            Gemini <span className="text-amber-600">Gomoku</span>
          </h1>
          <p className="text-stone-500 font-medium">Can you beat the AI?</p>
        </header>

        <Controls 
          currentPlayer={currentPlayer} 
          winner={winner} 
          isAiThinking={isAiThinking} 
          onReset={resetGame} 
        />

        <div className="overflow-x-auto p-4 w-full flex justify-center">
          <Board 
            board={board} 
            lastMove={lastMove} 
            winningLine={winningLine}
            onCellClick={handleCellClick}
            disabled={!gameActive || isAiThinking}
          />
        </div>

        <footer className="mt-12 text-stone-400 text-sm">
          Powered by Google Gemini API
        </footer>
      </div>
    </div>
  );
};

export default App;