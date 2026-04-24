import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { soundEngine } from '../utils/soundEngine';

const Dice = forwardRef(({ onRollComplete, rollDisabled }, ref) => {
  const [diceRotX, setDiceRotX] = useState(0);
  const [diceRotY, setDiceRotY] = useState(0);
  const [spins, setSpins] = useState({ x: 0, y: 0 });
  const [isRolling, setIsRolling] = useState(false);

  useImperativeHandle(ref, () => ({
    triggerRoll: () => {
      if (isRolling) return;
      setIsRolling(true);

      const rollResult = Math.floor(Math.random() * 6) + 1;

      // Calculate absolute target angles for faces
      let faceRotX = 0, faceRotY = 0;
      if (rollResult === 1) { faceRotX = 0; faceRotY = 0; } // Front ⚀
      else if (rollResult === 2) { faceRotX = -90; faceRotY = 0; } // Top ⚁
      else if (rollResult === 6) { faceRotX = -180; faceRotY = 0; } // Back ⚅
      else if (rollResult === 5) { faceRotX = 90; faceRotY = 0; } // Bottom ⚄
      else if (rollResult === 3) { faceRotX = 0; faceRotY = -90; } // Right ⚂
      else if (rollResult === 4) { faceRotX = 0; faceRotY = 90; } // Left ⚃

      // Add 2-4 full spins to current spin count
      const addSpinsX = Math.floor(Math.random() * 2) + 2;
      const addSpinsY = Math.floor(Math.random() * 2) + 2;
      const newSpins = { x: spins.x + addSpinsX, y: spins.y + addSpinsY };
      
      setSpins(newSpins);
      
      // Calculate final target rotation: (total spins * 360) + target face angle
      setDiceRotX(newSpins.x * 360 + faceRotX);
      setDiceRotY(newSpins.y * 360 + faceRotY);

      setTimeout(() => {
        setIsRolling(false);
        if (onRollComplete) onRollComplete(rollResult);
      }, 1250); 
    }
  }));

  const handleRollClick = () => {
    soundEngine.playClick();
    ref.current?.triggerRoll();
  };

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
        onClick={handleRollClick}
      >
        🚀 Execute Evaluation Run
      </button>
    </div>
  );
});

export default Dice;
