import React, { useState, useEffect, useRef } from 'react';

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const startAudio = () => {
      if (!hasInteracted && audioRef.current && !isPlaying) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
        }).catch(e => console.log('Autoplay prevented', e));
      }
      document.removeEventListener('click', startAudio);
    };
    
    if (!hasInteracted) {
      document.addEventListener('click', startAudio);
    }
    return () => document.removeEventListener('click', startAudio);
  }, [hasInteracted, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // We use catch to ignore the DOMException if the user hasn't interacted yet.
        audioRef.current.play().catch(e => console.log('Audio autoplay prevented'));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
    // If user interacts with volume, it might mean they want it to play if paused.
    // optional logic here.
  };

  return (
    <div className="audio-player-widget">
      <audio 
        ref={audioRef} 
        src="./bgm.mp3" 
        loop 
      />
      <button className="audio-toggle-btn" onClick={togglePlay} title="Play/Pause Background Music">
        {isPlaying ? '🔊' : '🔈'} 
        {isPlaying ? ' หยุดเพลง (Pause)' : ' เล่นเพลงระทึก (Play BGM)'}
      </button>
      
      {isPlaying && (
        <input 
          type="range" 
          className="audio-slider" 
          min="0" 
          max="1" 
          step="0.05" 
          value={volume} 
          onChange={handleVolumeChange}
          title="ระดับเสียง (Volume)"
        />
      )}
    </div>
  );
};

export default AudioPlayer;
