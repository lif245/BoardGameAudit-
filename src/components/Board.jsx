import React from 'react';
import { BOARD_TRACK } from '../constants';
const Board = ({ currentPosition, charAvatar }) => {
  return (
    <div className="board-square-spiral-wrapper">
      <div className="board-flat-container">
        {/* Luminous Circuit Path */}
        <svg className="spiral-path-svg" viewBox="0 0 100 100">
          <path 
            d={BOARD_TRACK.map((_, i) => {
              const angle = (i / 35) * Math.PI * 5.2;
              const dist = 42 - (i / 35) * 38;
              const x = 50 + dist * Math.cos(angle);
              const y = 50 + dist * Math.sin(angle);
              return (i === 0 ? 'M' : 'L') + ` ${x},${y}`;
            }).join(' ')}
            fill="none" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="0.8" strokeDasharray="2 3"
          />
        </svg>

        {BOARD_TRACK.map((t, i) => {
          let cls = `track-cell-glass t-${t.type}`;
          const hasPassed = i < currentPosition;
          if (hasPassed) cls += ' passed';
          const isCurrent = i === currentPosition;
          
          // Spiral Math for 36 tiles
          const angle = (i / 35) * Math.PI * 5.2; // ~2.6 turns
          const dist = 42 - (i / 35) * 38; // 42% out to 4% in
          
          const x = 50 + dist * Math.cos(angle);
          const y = 50 + dist * Math.sin(angle);
          
          const flatStyle = {
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 40 - i
          };

          return (
            <div key={i} className={cls} style={flatStyle}>
              {/* Premium Sci-Fi Look */}
              <span className="cell-num">{i === BOARD_TRACK.length - 1 ? 'EVAL' : (i || 'INIT')}</span>
              <div className="cell-icon">{t.icon}</div>
              {isCurrent && (
                <div className="player-token-glass">
                  {charAvatar}
                  <div className="token-shadow"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Board;
