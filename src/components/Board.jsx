import React from 'react';
import { BOARD_TRACK } from '../constants';
import IconRenderer from '../utils/IconRenderer';

const Board = ({ currentPosition, charAvatar, charIconName, charImg, landing = false, tileFeedback = null }) => {
  return (
    <div className="board-svg-container" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        {/* Connection Path */}
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
          fill="none" 
          stroke="rgba(59, 130, 246, 0.2)" 
          strokeWidth="0.5" 
        />

        {/* Nodes */}
        {BOARD_TRACK.map((t, i) => {
          const j = 35 - i;
          const maxTheta = Math.PI * 4.5;
          const theta = Math.sqrt(j / 35) * maxTheta;
          const dist = (theta / maxTheta) * 38 + 6;
          const x = 50 + dist * Math.cos(theta);
          const y = 50 + dist * Math.sin(theta);

          let nodeClass = "node-default";
          if (i < currentPosition) nodeClass = "node-passed";
          else if (i === currentPosition) nodeClass = "node-current";
          else if (t.type === 'risk' || t.type === 'opp') nodeClass = "node-event";

          return (
            <g key={i} className="board-node-group">
              <circle 
                cx={x} cy={y} r={1.5} 
                className={`board-node ${nodeClass}`}
              />
              {/* Text for critical nodes */}
              {(i === 0 || i === BOARD_TRACK.length - 1) && (
                <text x={x} y={y + 4} fontSize="2.5" fill="white" textAnchor="middle" fontWeight="bold">
                  {i === 0 ? 'START' : 'EVAL'}
                </text>
              )}
            </g>
          );
        })}

        {/* Character Avatar */}
        {(() => {
          const j = 35 - currentPosition;
          const maxTheta = Math.PI * 4.5;
          const theta = Math.sqrt(j / 35) * maxTheta;
          const dist = (theta / maxTheta) * 38 + 6;
          const x = 50 + dist * Math.cos(theta);
          const y = 50 + dist * Math.sin(theta);

          return (
            <foreignObject x={x - 4} y={y - 8} width="8" height="8">
              <div className="char-marker-tactical" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="char-avatar-ring">
                   {charImg ? <img src={charImg} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : <IconRenderer name={charIconName} size={14} />}
                </div>
              </div>
            </foreignObject>
          );
        })()}
      </svg>

      {/* Floating Tile Feedback */}
      {tileFeedback && (
        <div className={`tile-feedback-tactical ${tileFeedback.type === 'neg' ? 'negative' : ''}`} style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          background: 'rgba(15, 23, 42, 0.9)',
          padding: '8px 16px',
          borderRadius: '20px',
          border: '1px solid var(--primary-blue)',
          color: 'white',
          fontSize: '12px',
          fontWeight: 600,
          boxShadow: '0 0 15px var(--primary-blue)'
        }}>
          {tileFeedback.msg}
        </div>
      )}
    </div>
  );
};

export default Board;
