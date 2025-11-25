import React from 'react';
import { Player } from '../types';

interface ControlsProps {
  currentPlayer: Player;
  winner: Player | 'draw' | null;
  isAiThinking: boolean;
  onReset: () => void;
}

const Controls: React.FC<ControlsProps> = ({ currentPlayer, winner, isAiThinking, onReset }) => {
  return (
    <div className="flex flex-col items-center gap-6 mb-6 w-full max-w-md">
      
      {/* Status Card */}
      <div className="bg-white rounded-xl shadow-md p-6 w-full flex flex-col items-center border border-stone-200">
        {winner ? (
          <div className="text-center animate-bounce">
            <h2 className="text-2xl font-bold mb-1">
              {winner === 'draw' ? "It's a Draw!" : winner === Player.Black ? "You Won! 🎉" : "AI Won 🤖"}
            </h2>
            <p className="text-stone-500 text-sm">Game Over</p>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Current Turn</p>
              <h2 className={`text-xl font-bold ${currentPlayer === Player.Black ? 'text-stone-900' : 'text-stone-500'}`}>
                {currentPlayer === Player.Black ? "Your Turn" : "AI Thinking..."}
              </h2>
            </div>
            <div className={`w-10 h-10 rounded-full shadow-inner border-2 ${
              currentPlayer === Player.Black 
                ? 'bg-stone-900 border-stone-700' 
                : 'bg-white border-stone-300'
            } flex items-center justify-center transition-colors duration-300`}>
               {isAiThinking && (
                 <svg className="animate-spin h-5 w-5 text-stone-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
               )}
            </div>
          </div>
        )}
      </div>

      {/* Buttons */}
      <button
        onClick={onReset}
        className="px-8 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-md flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v3.25a1 1 0 11-2 0V13.003a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
        New Game
      </button>
    </div>
  );
};

export default Controls;