import React from 'react';
import { Player } from '../types';

interface StoneProps {
  player: Player;
  isLastMove?: boolean;
}

const Stone: React.FC<StoneProps> = ({ player, isLastMove }) => {
  if (player === Player.None) return null;

  const baseClasses = "w-[85%] h-[85%] rounded-full shadow-md transition-all duration-300 transform scale-100";
  
  // 3D effect gradients
  const blackStyle = {
    background: 'radial-gradient(circle at 30% 30%, #555, #000)',
    boxShadow: '2px 2px 4px rgba(0,0,0,0.4)'
  };
  
  const whiteStyle = {
    background: 'radial-gradient(circle at 30% 30%, #fff, #ddd)',
    boxShadow: '2px 2px 4px rgba(0,0,0,0.3)'
  };

  return (
    <div 
      className={`${baseClasses} flex items-center justify-center`}
      style={player === Player.Black ? blackStyle : whiteStyle}
    >
      {isLastMove && (
        <div className={`w-2 h-2 rounded-full ${player === Player.Black ? 'bg-white/50' : 'bg-black/50'} animate-pulse`} />
      )}
    </div>
  );
};

export default Stone;