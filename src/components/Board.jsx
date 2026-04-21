import React from 'react';
import { BOARD_TRACK } from '../constants';

const Board = ({ currentPosition, charAvatar }) => {
  return (
    <div className="board-track-grid">
      {BOARD_TRACK.map((t, i) => {
        let cls = `track-cell t-${t.type}`;
        const hasPassed = i < currentPosition;
        if (hasPassed) cls += ' passed';
        
        const isCurrent = i === currentPosition;
        
        // Calculate Grid Position for Snake Path (5x5)
        const row = Math.floor(i / 5);
        let col = i % 5;
        // Reverse column direction on odd rows
        if (row % 2 !== 0) col = 4 - col;
        
        const gridStyle = {
          gridRow: row + 1,
          gridColumn: col + 1,
          ...(hasPassed ? { opacity: 0.3, background: 'transparent' } : {})
        };

        return (
          <div 
            key={i} 
            className={cls} 
            style={gridStyle}
          >
            <span className="cell-num">{i === BOARD_TRACK.length - 1 ? 'EVAL' : (i || 'INIT')}</span>
            <div className="cell-icon">{t.icon}</div>
            {isCurrent && <div className="player-token">{charAvatar}</div>}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
