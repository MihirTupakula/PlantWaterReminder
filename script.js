// Countdown configuration
const COUNTDOWN_DAYS = 10;
const UPDATE_INTERVAL = 60000; // Update every minute for performance

// Emoji pool for floating animations - plant themed
const EMOJIS = ['🌱', '🌿', '🌳', '💧', '🌸', '🍃', '🌺', '🌻', '🪴', '🌾', '🌷', '🌼'];

// Initialize countdown
function initCountdown() {
    let startDate = localStorage.getItem('countdownStartDate');
    let cycleNumber = parseInt(localStorage.getItem('cycleNumber') || '1');
    
    // If no start date exists, start a new countdown
    if (!startDate) {
        startDate = new Date().toISOString();
        localStorage.setItem('countdownStartDate', startDate);
        localStorage.setItem('cycleNumber', '1');
        cycleNumber = 1;
    }
    
    updateCountdown(startDate, cycleNumber);
    updateCycleIndicator(cycleNumber);
    
    // Update every minute - always read from localStorage to get current values
    setInterval(() => {
        const currentStartDate = localStorage.getItem('countdownStartDate');
        const currentCycleNumber = parseInt(localStorage.getItem('cycleNumber') || '1');
        updateCountdown(currentStartDate, currentCycleNumber);
    }, UPDATE_INTERVAL);
    
    // Spawn floating emojis periodically
    setInterval(spawnFloatingEmoji, 3000);
}

function updateCountdown(startDateStr, cycleNumber) {
    const startDate = new Date(startDateStr);
    const now = new Date();
    const elapsed = now - startDate;
    const elapsedDays = Math.floor(elapsed / (1000 * 60 * 60 * 24));
    const daysRemaining = Math.max(0, COUNTDOWN_DAYS - elapsedDays);
    
    // If countdown reached zero, reset
    if (daysRemaining === 0 && elapsedDays >= COUNTDOWN_DAYS) {
        resetCountdown(cycleNumber);
        return;
    }
    
    // Cache DOM elements for performance
    const daysNumberEl = document.getElementById('daysNumber');
    const daysLabelEl = document.getElementById('daysLabel');
    const progressBarEl = document.getElementById('progressBar');
    
    // Only update if value changed to minimize repaints
    if (daysNumberEl.textContent !== String(daysRemaining)) {
        daysNumberEl.textContent = daysRemaining;
        daysLabelEl.textContent = daysRemaining === 1 ? 'day' : 'days';
    }
    
    // Update progress bar
    const progress = ((COUNTDOWN_DAYS - daysRemaining) / COUNTDOWN_DAYS) * 100;
    progressBarEl.style.width = progress + '%';
}

function resetCountdown(cycleNumber) {
    // Show celebration
    showCelebration();
    
    // Reset countdown
    const newStartDate = new Date().toISOString();
    const newCycleNumber = cycleNumber + 1;
    
    localStorage.setItem('countdownStartDate', newStartDate);
    localStorage.setItem('cycleNumber', newCycleNumber.toString());
    
    // Update display immediately
    updateCountdown(newStartDate, newCycleNumber);
    updateCycleIndicator(newCycleNumber);
}

function updateCycleIndicator(cycleNumber) {
    const cycleIndicatorEl = document.getElementById('cycleIndicator');
    cycleIndicatorEl.textContent = `Cycle ${cycleNumber}`;
}

// Silent audio loop to keep device awake (works on older iPads)
let silentAudio = null;
let audioContext = null;

function initSilentAudio() {
    try {
        // Create a silent audio element
        silentAudio = document.createElement('audio');
        silentAudio.loop = true;
        silentAudio.volume = 0.01; // Very low volume, essentially silent
        silentAudio.preload = 'auto';
        
        // Create a silent audio buffer using Web Audio API
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a silent audio buffer (1 second of silence)
        const sampleRate = audioContext.sampleRate;
        const buffer = audioContext.createBuffer(1, sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        // Fill with silence (zeros)
        for (let i = 0; i < sampleRate; i++) {
            data[i] = 0;
        }
        
        // Create a source and connect it
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(audioContext.destination);
        source.start(0);
        
        // Also use HTML5 audio as a fallback
        // Create a data URI for a minimal silent WAV file
        const silentWav = createSilentWav();
        silentAudio.src = silentWav;
        
        // Play the audio (muted, but playing keeps device awake)
        silentAudio.play().catch(err => {
            console.log('Audio play failed (may need user interaction):', err);
        });
        
        console.log('Silent audio loop initialized');
    } catch (err) {
        console.log('Silent audio initialization failed:', err);
    }
}

// Create a minimal silent WAV file as data URI
function createSilentWav() {
    // Minimal WAV file header + 1 second of silence at 44.1kHz
    const sampleRate = 44100;
    const numChannels = 1;
    const bitsPerSample = 16;
    const duration = 1; // 1 second
    const numSamples = sampleRate * duration;
    const dataSize = numSamples * numChannels * (bitsPerSample / 8);
    
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true); // fmt chunk size
    view.setUint16(20, 1, true); // audio format (PCM)
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true);
    view.setUint16(32, numChannels * (bitsPerSample / 8), true);
    view.setUint16(34, bitsPerSample, true);
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);
    
    // Data is already zeros (silence)
    
    // Convert to base64 data URI
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return 'data:audio/wav;base64,' + btoa(binary);
}

// Start audio on user interaction (required for iOS/iPad)
let audioStarted = false;

function startAudioOnInteraction() {
    if (audioStarted) return;
    
    if (silentAudio) {
        silentAudio.play().then(() => {
            audioStarted = true;
            console.log('Silent audio started');
        }).catch(err => {
            console.log('Audio play failed:', err);
        });
    }
    
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log('Audio context resumed');
        }).catch(err => {
            console.log('Audio context resume failed:', err);
        });
    }
}

// Listen for any user interaction to start audio
document.addEventListener('touchstart', startAudioOnInteraction, { once: true });
document.addEventListener('click', startAudioOnInteraction, { once: true });

// Restart audio if it stops (e.g., when page becomes visible)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        if (silentAudio && silentAudio.paused && audioStarted) {
            silentAudio.play().catch(err => {
                console.log('Audio resume failed:', err);
            });
        }
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume().catch(err => {
                console.log('Audio context resume failed:', err);
            });
        }
    }
});

// Cache emoji container for performance
let emojiContainerCache = null;

function spawnFloatingEmoji() {
    if (!emojiContainerCache) {
        emojiContainerCache = document.getElementById('emojiContainer');
    }
    
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    
    const emojiEl = document.createElement('div');
    emojiEl.className = 'floating-emoji';
    emojiEl.textContent = emoji;
    
    // Random horizontal position
    emojiEl.style.left = Math.random() * 80 + 10 + '%';
    emojiEl.style.animationDuration = (Math.random() * 3 + 2) + 's';
    
    emojiContainerCache.appendChild(emojiEl);
    
    // Remove after animation
    setTimeout(() => {
        if (emojiEl.parentNode) {
            emojiEl.remove();
        }
    }, 5000);
}

function showCelebration() {
    const celebrationEl = document.getElementById('celebration');
    celebrationEl.textContent = '🌱💧🌿';
    celebrationEl.classList.add('active');
    
    // Spawn extra emojis
    for (let i = 0; i < 10; i++) {
        setTimeout(() => spawnFloatingEmoji(), i * 100);
    }
    
    // Hide after animation
    setTimeout(() => {
        celebrationEl.classList.remove('active');
    }, 2000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initSilentAudio();
});

