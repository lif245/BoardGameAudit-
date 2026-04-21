import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';

const Dice = forwardRef(({ onRollComplete, rollDisabled }, ref) => {
  const [diceRotX, setDiceRotX] = useState(-15);
  const [diceRotY, setDiceRotY] = useState(15);
  const [isRolling, setIsRolling] = useState(false);

  useImperativeHandle(ref, () => ({
    triggerRoll: () => {
      if (isRolling) return;
      setIsRolling(true);

      const rollResult = Math.floor(Math.random() * 6) + 1;

      // Add extra full rotations for dramatic effect
      const addRotX = (Math.floor(Math.random() * 2) + 2) * 360;
      const addRotY = (Math.floor(Math.random() * 2) + 2) * 360;

      let faceRotX = 0, faceRotY = 0;
      if (rollResult === 1) { faceRotX = 0; faceRotY = 0; } // Front ⚀
      else if (rollResult === 2) { faceRotX = -90; faceRotY = 0; } // Top ⚁
      else if (rollResult === 3) { faceRotX = 0; faceRotY = -90; } // Right ⚂
      else if (rollResult === 4) { faceRotX = 0; faceRotY = 90; } // Left ⚃
      else if (rollResult === 5) { faceRotX = 90; faceRotY = 0; } // Bottom ⚄
      else if (rollResult === 6) { faceRotX = 0; faceRotY = -180; } // Back ⚅

      setDiceRotX(prev => prev + addRotX + faceRotX);
      setDiceRotY(prev => prev + addRotY + faceRotY);

      setTimeout(() => {
        setIsRolling(false);
        if (onRollComplete) onRollComplete(rollResult);
      }, 1250); 
    }
  }));

  return (
    <div className="dice-panel">
      <div className="dice-panel-title">Evaluation Engine (Randomizer)</div>
      <div className="dice-scene">
        <div 
          className="dice-cube" 
          id="dice1"
          style={{ transform: `rotateX(${diceRotX}deg) rotateY(${diceRotY}deg)` }}
        >
          <div className="dice-face front face-1"><div className="dot"></div></div>
          <div className="dice-face back face-6">
            <div className="dot"></div><div className="dot"></div><div className="dot"></div>
            <div className="dot"></div><div className="dot"></div><div className="dot"></div>
          </div>
          <div className="dice-face right face-3"><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
          <div className="dice-face left face-4"><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
          <div className="dice-face top face-2"><div className="dot"></div><div className="dot"></div></div>
          <div className="dice-face bottom face-5"><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>
        </div>
      </div>
      <button 
        className="btn-game btn-primary-game" 
        style={{ width: '220px' }}
        disabled={rollDisabled || isRolling}
        onClick={() => ref.current?.triggerRoll()}
      >
        🎲 Execute Evaluation Run
      </button>
    </div>
  );
});

export default Dice;
