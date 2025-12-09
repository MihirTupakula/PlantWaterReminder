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

// Wake Lock API to keep screen awake
let wakeLock = null;

async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake lock activated');
            
            // Re-request wake lock if it's released (e.g., when tab becomes visible again)
            wakeLock.addEventListener('release', () => {
                console.log('Wake lock released');
            });
        }
    } catch (err) {
        console.log('Wake lock not supported or failed:', err);
    }
}

// Re-request wake lock when page becomes visible
document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible' && wakeLock === null) {
        await requestWakeLock();
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
    requestWakeLock();
    
    // Keep page active with subtle activity (fallback for devices without wake lock)
    // This helps prevent sleep on older iPads
    let lastActivity = Date.now();
    setInterval(() => {
        // Subtle activity to keep page active
        if (Date.now() - lastActivity > 30000) {
            document.body.style.opacity = '0.999';
            setTimeout(() => {
                document.body.style.opacity = '1';
            }, 1);
            lastActivity = Date.now();
        }
    }, 30000);
});

