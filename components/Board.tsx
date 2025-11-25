import React from 'react';
import { BoardState, Coordinates, Player } from '../types';
import Stone from './Stone';
import { BOARD_SIZE, CELL_SIZE_CLASS } from '../constants';

interface BoardProps {
  board: BoardState;
  lastMove: Coordinates | null;
  winningLine: Coordinates[] | null;
  onCellClick: (row: number, col: number) => void;
  disabled: boolean;
}

const Board: React.FC<BoardProps> = ({ board, lastMove, winningLine, onCellClick, disabled }) => {
  
  // Helper to check if a cell is in the winning line
  const isWinningCell = (r: number, c: number) => {
    if (!winningLine) return false;
    return winningLine.some(coord => coord.row === r && coord.col === c);
  };

  return (
    <div className="relative p-2 sm:p-4 bg-[#dcb35c] rounded-lg shadow-2xl wood-texture">
      {/* Grid Container */}
      <div 
        className="grid border-2 border-[#8b5a2b]"
        style={{ 
          gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
          width: 'fit-content'
        }}
      >
        {board.map((row, r) => (
          row.map((cellValue, c) => {
            const isLast = lastMove?.row === r && lastMove?.col === c;
            const isWinner = isWinningCell(r, c);
            
            // Logic to draw grid lines inside cells to look like intersections
            // We want lines to cross in the center. 
            // Top row shouldn't have top line above center, etc.
            
            return (
              <div 
                key={`${r}-${c}`}
                className={`${CELL_SIZE_CLASS} relative flex items-center justify-center cursor-pointer`}
                onClick={() => !disabled && onCellClick(r, c)}
              >
                {/* Horizontal Line */}
                <div className={`absolute w-full h-px bg-[#8b5a2b] z-0 ${c === 0 ? 'left-1/2 w-1/2' : ''} ${c === BOARD_SIZE - 1 ? 'w-1/2 right-1/2 left-auto' : ''}`} />
                
                {/* Vertical Line */}
                <div className={`absolute h-full w-px bg-[#8b5a2b] z-0 ${r === 0 ? 'top-1/2 h-1/2' : ''} ${r === BOARD_SIZE - 1 ? 'h-1/2 bottom-1/2 top-auto' : ''}`} />

                {/* Center dot for star points (standard Gomoku points: 3,3; 3,11; 7,7; 11,3; 11,11 for 15x15) */}
                {((r === 3 || r === 11) && (c === 3 || c === 11)) || (r === 7 && c === 7) ? (
                   <div className="absolute w-1.5 h-1.5 bg-[#8b5a2b] rounded-full z-0" />
                ) : null}

                {/* The Stone */}
                <div className={`relative z-10 w-full h-full flex items-center justify-center ${isWinner ? 'ring-2 ring-red-500 rounded-full ring-offset-2 ring-offset-[#dcb35c]' : ''}`}>
                  <Stone player={cellValue} isLastMove={isLast} />
                </div>
              </div>
            );
          })
        ))}
      </div>
    </div>
  );
};

export default Board;