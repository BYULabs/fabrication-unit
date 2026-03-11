// ============= MAIN APPLICATION INITIALIZATION =============
// This file brings together all modules and initializes the application

function initializeApplication() {
    // Generate the grid
    generateGrid();
    
    // Update initial UI elements
    updateProgressBars();
    updateSystemTime();
    
    // Initialize social credit display with proper formatting
    const creditDisplay = document.querySelector('div > div > div.text-4xl.font-bold.text-\\[\\#00ff41\\]');
    if (creditDisplay) {
        creditDisplay.textContent = gameState.socialCredit.toFixed(2);
    }
    
    // Initialize all event listeners
    initializeControls();
    initializeSliders();
    initializeBubbleButtonEffects();
    
    // Start ambient effects loops
    setInterval(updateSystemTime, 1000);
    setInterval(updateStressMeter, 50);
    
    // Log initialization messages
    logMessage('> STATION_772_B INITIALIZATION COMPLETE', '#00ff41');
    logMessage('> ANOMALY CORRECTION SYSTEM: ARMED', '#3b82f6');
    logMessage('> STRESS MONITORING: ACTIVE', '#ffb000');
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApplication);
