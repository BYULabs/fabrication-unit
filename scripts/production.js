// ============= PRODUCTION CYCLE =============
// This file handles the production cycle logic: starting, running, and resetting production

function startProduction() {
    if (gameState.isProducing) return;
    
    gameState.isProducing = true;
    gameState.activeCells.clear();
    gameState.progressValues = { bond: 0, shield: 0, isotope: 0, void: 0 };
    gameState.anomalies = [];
    gameState.criticalAnomalies = 0;
    gameState.systemInCriticalFailure = false;
    
    logMessage('> PRODUCTION CYCLE 01: START', '#3b82f6');
    playClickSound();
    updateSocialCredit(10.00);
    
    // Deactivate all cells
    clearGridCells();
    
    // Re-enable buttons
    document.querySelectorAll('.bubble-button').forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
    });

    // Production loop - fill random cells and increase progress bars
    // Speed is dynamically adjusted based on current manual override values
    const productionInterval = setInterval(() => {
        if (!gameState.isProducing) {
            clearInterval(productionInterval);
            return;
        }

        // Get current speed multiplier from manual overrides
        const speedMultiplier = getProductionSpeedMultiplier();
        
        // Activate multiple cells per tick based on speed multiplier
        const cellsToActivatePerTick = Math.ceil(speedMultiplier * 1.5);
        for (let i = 0; i < cellsToActivatePerTick; i++) {
            const randomCell = Math.floor(Math.random() * 100);
            if (gameState.activeCells.size < 100) {
                if (!gameState.activeCells.has(randomCell)) {
                    gameState.activeCells.add(randomCell);
                    const cell = document.getElementById(`cell-${randomCell}`);
                    if (cell && !cell.classList.contains('warning') && !cell.classList.contains('critical')) {
                        cell.classList.add('active');
                    }
                }
            }
        }

        // Increase progress bars proportional to speed multiplier
        // Higher overrides = faster progress
        gameState.progressValues.bond = Math.min(100, gameState.progressValues.bond + (Math.random() * 8 * speedMultiplier));
        gameState.progressValues.shield = Math.min(100, gameState.progressValues.shield + (Math.random() * 6 * speedMultiplier));
        gameState.progressValues.isotope = Math.min(100, gameState.progressValues.isotope + (Math.random() * 7 * speedMultiplier));
        gameState.progressValues.void = Math.min(100, gameState.progressValues.void + (Math.random() * 5 * speedMultiplier));

        // Update progress bars
        updateProgressBars();

        // Check if complete
        if (gameState.activeCells.size === 100 && 
            gameState.progressValues.bond >= 100 && 
            gameState.progressValues.shield >= 100 && 
            gameState.progressValues.isotope >= 100 && 
            gameState.progressValues.void >= 100) {
            
            clearInterval(productionInterval);
            gameState.isProducing = false;
            
            // Clear any anomalies
            gameState.anomalies = [];
            gameState.criticalAnomalies = 0;
            
            // Complete sequence
            logMessage('> SYSTEM COOLING...', '#ffb000');
            setTimeout(() => {
                logMessage('> UNIT COMPLETE. QUOTA UPDATED.', '#00ff41');
                resetProduction();
            }, 3000);
        }
    }, 50);
    
    // Trigger first anomaly using anomaly interval
    const firstAnomalyDelay = gameState.anomalyInterval + (Math.random() * 3000 - 1500);
    gameState.anomalyNextTrigger = setTimeout(() => {
        if (gameState.isProducing) {
            triggerAnomaly();
        }
    }, firstAnomalyDelay);
}

function resetProduction() {
    // Clear grid
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.classList.remove('active');
    });
    gameState.activeCells.clear();
    
    // Reset progress bars
    gameState.progressValues = { bond: 0, shield: 0, isotope: 0, void: 0 };
    updateProgressBars();
}

function emergencyShutdown() {
    logMessage('> EMERGENCY PURGE SEQUENCE INITIATED', '#ef4444');
    logMessage('> SYSTEM ENTERING COLD STANDBY', '#ffb000');
    
    gameState.isProducing = false;
    gameState.systemInCriticalFailure = false;
    gameState.anomalies = [];
    gameState.criticalAnomalies = 0;
    gameState.stressMeterSpeed = 30;
    gameState.productionSpeed = gameState.baseProductionSpeed;
    gameState.anomalyInterval = gameState.baseAnomalyInterval;
    
    // Clear all anomaly timers
    Object.keys(gameState.anomalyTimers).forEach(key => {
        clearTimeout(gameState.anomalyTimers[key]);
    });
    gameState.anomalyTimers = {};
    
    // Clear next anomaly trigger
    if (gameState.anomalyNextTrigger) {
        clearTimeout(gameState.anomalyNextTrigger);
        gameState.anomalyNextTrigger = null;
    }
    
    // Reset grid
    resetProduction();
    
    // Re-enable all buttons
    document.querySelectorAll('.bubble-button').forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
    });
    
    disableSupervisorGlitch();
    
    updateSocialCredit(-50.00);
}
