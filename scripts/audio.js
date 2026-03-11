// ============= AUDIO SYNTHESIS =============
// This file handles all sound effects using the Web Audio API

let audioContext;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playClickSound() {
    initAudio();
    const now = audioContext.currentTime;
    
    // Create oscillator for mechanical click
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    osc.start(now);
    osc.stop(now + 0.05);
}

function playBuzzerSound() {
    initAudio();
    const now = audioContext.currentTime;
    
    // Low frequency buzzer sound
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    osc.frequency.setValueAtTime(60, now);
    osc.frequency.setValueAtTime(70, now + 0.05);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.setValueAtTime(0.1, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    osc.start(now);
    osc.stop(now + 0.3);
}

function playSirenSound() {
    initAudio();
    const now = audioContext.currentTime;
    const duration = 0.2;
    
    // Create siren (fast beeping with pitch modulation)
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const lfo = audioContext.createOscillator(); // Low frequency oscillator for pitch modulation
    const lfoGain = audioContext.createGain();
    
    osc.connect(gain);
    gain.connect(audioContext.destination);
    
    // LFO modulates the oscillator frequency
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    
    osc.frequency.setValueAtTime(800, now);
    lfo.frequency.setValueAtTime(8, now); // Fast wobble
    lfoGain.gain.setValueAtTime(100, now);
    
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.2, now + duration);
    
    osc.start(now);
    osc.stop(now + duration);
    lfo.start(now);
    lfo.stop(now + duration);
}

function startContinuousSiren(duration = 10000) {
    // Play siren sound repeatedly
    const sirenInterval = setInterval(() => {
        playSirenSound();
    }, 200);
    
    // Stop after duration
    setTimeout(() => {
        clearInterval(sirenInterval);
    }, duration);
}
