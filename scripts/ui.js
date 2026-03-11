// ============= UI UPDATES =============
// This file handles all UI element updates (social credit, time, stress meter, progress bars, etc)

function updateSocialCredit(amount) {
    gameState.socialCredit += amount;
    gameState.socialCredit = Math.max(0, gameState.socialCredit);
    
    // Format to exactly 2 decimal places
    const creditDisplay = document.querySelector('div > div > div.text-4xl.font-bold.text-\\[\\#00ff41\\]');
    if (creditDisplay) {
        creditDisplay.textContent = gameState.socialCredit.toFixed(2);
    }
}

// ============= TIME UPDATE =============
function updateSystemTime() {
    const header = document.querySelector('h1');
    if (header && !header.dataset.timeInitialized) {
        header.nextElementSibling?.remove();
        const timeDisplay = document.createElement('p');
        timeDisplay.className = 'text-xs text-gray-400 mt-1';
        timeDisplay.id = 'system-time';
        header.parentElement.insertBefore(timeDisplay, header.nextElementSibling);
        header.dataset.timeInitialized = true;
    }
    
    const timeDisplay = document.getElementById('system-time');
    if (timeDisplay) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        timeDisplay.textContent = `SYSTEM TIME: ${hours}:${minutes}:${seconds}`;
    }
}

// ============= STRESS METER UPDATE =============
// Update stress meter based on calculated stress level from manual overrides
function updateStressDisplay() {
    const stressIndicator = document.querySelector('.stress-indicator');
    if (stressIndicator) {
        // Set width directly to stress level (0-100%)
        stressIndicator.style.width = gameState.stressMeterLevel + '%';
        
        // Update color based on stress level
        const color = getStressColor();
        stressIndicator.style.background = `linear-gradient(90deg, ${color}, ${color}dd)`;
        stressIndicator.style.boxShadow = `0 0 10px ${color}`;
        
        // Update stress meter background border color
        const stressMeter = stressIndicator.parentElement;
        if (stressMeter) {
            stressMeter.style.borderColor = color;
        }
    }
}

// ============= PROGRESS BAR UPDATES =============
function updateProgressBars() {
    const bars = [
        { id: 'bond-fill', progress: 'bond-progress', value: 'bond' },
        { id: 'shield-fill', progress: 'shield-progress', value: 'shield' },
        { id: 'isotope-fill', progress: 'isotope-progress', value: 'isotope' },
        { id: 'void-fill', progress: 'void-progress', value: 'void' }
    ];

    bars.forEach(bar => {
        const fill = document.getElementById(bar.id);
        const progress = document.getElementById(bar.progress);
        const value = Math.round(gameState.progressValues[bar.value]);
        
        if (fill) fill.style.width = value + '%';
        if (progress) progress.textContent = value + '%';
    });
}

// ============= SUPERVISOR GLITCH EFFECTS =============
function enableSupervisorGlitch() {
    const supervisor = document.querySelector('.hologram-effect');
    if (supervisor && !supervisor.classList.contains('glitch')) {
        supervisor.classList.add('glitch');
    }
}

function disableSupervisorGlitch() {
    const supervisor = document.querySelector('.hologram-effect');
    if (supervisor && supervisor.classList.contains('glitch')) {
        supervisor.classList.remove('glitch');
    }
}

// ============= HAZARD LIGHT =============
function activateHazardLight() {
    // Find or create hazard lights container
    let hazardContainer = document.getElementById('hazard-lights');
    if (!hazardContainer) {
        hazardContainer = document.createElement('div');
        hazardContainer.id = 'hazard-lights';
        hazardContainer.className = 'flex justify-center mt-2';
        const stressMeter = document.querySelector('.stress-meter');
        stressMeter.parentElement.appendChild(hazardContainer);
    }

    // Clear existing lights
    hazardContainer.innerHTML = '';
    
    // Create random number of hazard lights (1-3)
    const lightCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < lightCount; i++) {
        const light = document.createElement('div');
        light.className = 'hazard-light blink';
        hazardContainer.appendChild(light);
    }
}
