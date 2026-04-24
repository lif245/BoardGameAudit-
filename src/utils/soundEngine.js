const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const playTone = (freq, type, duration, volume = 0.1) => {
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
};

export const soundEngine = {
  playRoll: () => {
    // Rapid digital bleeps
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        playTone(400 + Math.random() * 600, 'square', 0.05, 0.05);
      }, i * 60);
    }
  },
  playMove: () => {
    playTone(880, 'sine', 0.1, 0.1);
  },
  playSuccess: () => {
    playTone(523.25, 'sine', 0.1, 0.1); // C5
    setTimeout(() => playTone(659.25, 'sine', 0.15, 0.1), 100); // E5
    setTimeout(() => playTone(783.99, 'sine', 0.2, 0.1), 200); // G5
  },
  playAlert: () => {
    playTone(440, 'sawtooth', 0.1, 0.05);
    setTimeout(() => playTone(349.23, 'sawtooth', 0.2, 0.05), 150);
  },
  playClick: () => {
    playTone(1200, 'sine', 0.03, 0.05);
  },
  playBossCharge: () => {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 1.5);
    g.gain.setValueAtTime(0, audioCtx.currentTime);
    g.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.1);
    g.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
    osc.connect(g);
    g.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 1.5);
  },
  playBossResult: (isWin) => {
    const now = audioCtx.currentTime;
    if (isWin) {
      [261, 329, 392, 523].forEach((f, i) => {
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i*0.1);
        g.gain.setValueAtTime(0, now + i*0.1);
        g.gain.linearRampToValueAtTime(0.3, now + i*0.1 + 0.05);
        g.gain.exponentialRampToValueAtTime(0.01, now + i*0.1 + 0.5);
        osc.connect(g);
        g.connect(audioCtx.destination);
        osc.start(now + i*0.1);
        osc.stop(now + i*0.1 + 0.6);
      });
    } else {
      const osc = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 1);
      g.gain.setValueAtTime(0.5, now);
      g.gain.linearRampToValueAtTime(0, now + 1);
      osc.connect(g);
      g.connect(audioCtx.destination);
      osc.start();
      osc.stop(now + 1);
    }
  }
};
