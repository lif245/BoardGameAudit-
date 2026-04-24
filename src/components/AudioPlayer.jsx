import React, { useState, useEffect, useRef } from 'react';
import IconRenderer from '../utils/IconRenderer';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const audioRef = useRef(null);

  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Auto-start logic removed at user request to keep music off by default.

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log('Audio autoplay prevented'));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className="audio-player-widget">
      <audio 
        ref={audioRef} 
        src="./bgm.mp3" 
        loop 
      />
      <button className="audio-minimal-btn" onClick={togglePlay} title={isPlaying ? 'Pause Music' : 'Play Music'}>
        <IconRenderer name={isPlaying ? 'Volume2' : 'VolumeX'} size={18} />
      </button>
      
      {isPlaying && (
        <div className="volume-popover">
          <input 
            type="range" 
            className="audio-slider" 
            min="0" 
            max="1" 
            step="0.05" 
            value={volume} 
            onChange={handleVolumeChange}
            title="Volume"
          />
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;

