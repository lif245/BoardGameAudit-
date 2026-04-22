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
              const j = 35 - i;
              const maxTheta = Math.PI * 4.5;
              const theta = Math.sqrt(j / 35) * maxTheta;
              const dist = (theta / maxTheta) * 38 + 6;
              const x = 50 + dist * Math.cos(theta);
              const y = 50 + dist * Math.sin(theta);
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
          
          // Equal Arc-length Spiral Math
          const j = 35 - i;
          const maxTheta = Math.PI * 4.5;
          const theta = Math.sqrt(j / 35) * maxTheta;
          const dist = (theta / maxTheta) * 38 + 6;
          
          const x = 50 + dist * Math.cos(theta);
          const y = 50 + dist * Math.sin(theta);
          
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
