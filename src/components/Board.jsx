import React from 'react';
import { BOARD_TRACK } from '../constants';

const Board = ({ currentPosition, charAvatar }) => {
  return (
    <div className="board-track" id="board-track">
      {BOARD_TRACK.map((t, i) => {
        let cls = `track-cell t-${t.type}`;
        const hasPassed = i < currentPosition;
        if (hasPassed) cls += ' passed';
        
        const isCurrent = i === currentPosition;

        return (
          <div 
            key={i} 
            className={cls} 
            style={hasPassed ? { opacity: 0.3, background: 'transparent' } : {}}
          >
            <span className="cell-num">{i === BOARD_TRACK.length - 1 ? 'EVAL' : (i || 'INIT')}</span>
            {t.icon}
            {isCurrent && <div className="player-token">{charAvatar}</div>}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
