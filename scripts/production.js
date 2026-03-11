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

        // Update progress bars based on grid fill percentage (0-100 cells filled)
        // Progress bars only reach 100% when all 100 cells are filled
        const gridFillPercentage = (gameState.activeCells.size / 100) * 100;
        gameState.progressValues.bond = gridFillPercentage * 0.95 + Math.random() * 5;
        gameState.progressValues.shield = gridFillPercentage * 0.92 + Math.random() * 8;
        gameState.progressValues.isotope = gridFillPercentage * 0.98 + Math.random() * 2;
        gameState.progressValues.void = gridFillPercentage * 0.90 + Math.random() * 10;

        // Cap all at 100%
        gameState.progressValues.bond = Math.min(100, gameState.progressValues.bond);
        gameState.progressValues.shield = Math.min(100, gameState.progressValues.shield);
        gameState.progressValues.isotope = Math.min(100, gameState.progressValues.isotope);
        gameState.progressValues.void = Math.min(100, gameState.progressValues.void);

        // Update progress bars
        updateProgressBars();

        // Check if complete - production ends when all 100 cells are filled
        if (gameState.activeCells.size === 100) {
            clearInterval(productionInterval);
            gameState.isProducing = false;
            
            // Ensure all progress bars reach 100%
            gameState.progressValues = { bond: 100, shield: 100, isotope: 100, void: 100 };
            updateProgressBars();
            
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
