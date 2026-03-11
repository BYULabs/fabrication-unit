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
    gameState.rationRequested = false;
    
    logMessage('> PRODUCTION CYCLE 01: START', '#3b82f6');
    playClickSound();
    updateSocialCredit(10.00);
    
    // Remove critical warnings from grid
    document.querySelectorAll('.grid-cell.critical').forEach(cell => {
        cell.classList.remove('critical');
    });
    
    // Deactivate all cells
    clearGridCells();
    
    // Clear any remaining anomalies from previous cycle
    document.querySelectorAll('[data-anomaly-type]').forEach(cell => {
        cell.style.backgroundColor = '';
        cell.style.boxShadow = '';
        delete cell.dataset.anomalyType;
    });
    
    // Re-enable buttons
    document.querySelectorAll('.bubble-button').forEach(btn => {
        btn.disabled = false;
        btn.style.opacity = '1';
    });

    // Production loop - fill random cells and increase progress bars
    // Speed is dynamically adjusted based on current manual override values
    gameState.productionIntervalId = setInterval(() => {
        if (!gameState.isProducing) {
            clearInterval(gameState.productionIntervalId);
            return;
        }

        // Get current speed multiplier from manual overrides
        const speedMultiplier = getProductionSpeedMultiplier();
        
        // Get anomaly probability - higher overrides = more anomalous cells
        const anomalyProbability = getAnomalyProbability();
        
        // Activate multiple cells per tick based on speed multiplier
        const cellsToActivatePerTick = Math.ceil(speedMultiplier * 1.5);
        for (let i = 0; i < cellsToActivatePerTick; i++) {
            const randomCell = Math.floor(Math.random() * 100);
            if (gameState.activeCells.size < 100) {
                if (!gameState.activeCells.has(randomCell)) {
                    gameState.activeCells.add(randomCell);
                    const cell = document.getElementById(`cell-${randomCell}`);
                    if (cell) {
                        cell.classList.add('active');
                        
                        // Determine if this cell should be anomalous
                        if (Math.random() < anomalyProbability) {
                            // This cell is anomalous - pick a random anomaly type
                            const anomalyType = getRandomAnomalyType();
                            const anomalyData = ANOMALY_TYPES[anomalyType];
                            const cellColor = ANOMALY_COLORS[anomalyType];
                            
                            // Apply anomaly colors to cell
                            cell.style.backgroundColor = cellColor;
                            cell.style.boxShadow = `0 0 8px ${cellColor}`;
                            cell.dataset.anomalyType = anomalyType;
                            
                            // Create anomaly record if one doesn't exist for this type
                            const existingAnomaly = gameState.anomalies.find(a => a.type === anomalyType && a.isActive);
                            if (!existingAnomaly) {
                                const anomalyId = Date.now() + Math.random();
                                const newAnomaly = {
                                    id: anomalyId,
                                    type: anomalyType,
                                    startTime: Date.now(),
                                    isActive: true,
                                    cellCount: 1
                                };
                                gameState.anomalies.push(newAnomaly);
                                
                                logMessage(anomalyData.errorLog, anomalyData.color);
                                logMessage(`> CLICK [${anomalyData.fixButton.replace('btn-', '').toUpperCase()}] TO FIX`, anomalyData.color);
                                updateGridCell(randomCell, 'warning');
                                enableSupervisorGlitch();
                            } else {
                                // Update existing anomaly's cell count
                                existingAnomaly.cellCount = (existingAnomaly.cellCount || 1) + 1;
                            }
                            
                            // Check if warning threshold exceeded after anomaly creation
                            checkWarningThreshold();
                        }
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
            clearInterval(gameState.productionIntervalId);
            clearInterval(gameState.anomalySpreadIntervalId);
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
                // Calculate payment based on number of active cells (green boxes)
                const activeCellCount = document.querySelectorAll('.grid-cell.active').length;
                const paymentPerCell = 20;
                const completionBonus = activeCellCount * paymentPerCell;
                
                logMessage('> UNIT COMPLETE. QUOTA UPDATED.', '#00ff41');
                logMessage(`> COMPLETION BONUS: ${completionBonus} CREDITS (${activeCellCount} ACTIVE CELLS)`, '#00ff41');
                updateSocialCredit(completionBonus);
                resetProduction();
            }, 3000);
        }
    }, 200);
    
    // Anomaly spreading interval - unfixed anomalies spread every 2 seconds
    gameState.anomalySpreadIntervalId = setInterval(() => {
        if (!gameState.isProducing) {
            clearInterval(gameState.anomalySpreadIntervalId);
            return;
        }
        
        // Check each active anomaly to see if it should spread
        gameState.anomalies.forEach(anomaly => {
            if (anomaly.isActive) {
                // Check how long the anomaly has been active
                const timeActive = Date.now() - anomaly.startTime;
                
                // Spread happens every 2 seconds if not fixed
                if (timeActive > 2000 && timeActive % 2000 < 200) {
                    spreadAnomaly(anomaly);
                }
            }
        });
    }, 1000);
}

function resetProduction() {
    // Clear grid
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.classList.remove('active');
        cell.style.backgroundColor = '';
        cell.style.boxShadow = '';
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
    gameState.rationRequested = false;
    gameState.anomalies = [];
    gameState.criticalAnomalies = 0;
    
    // Clear all anomalies from grid visually
    document.querySelectorAll('[data-anomaly-type]').forEach(cell => {
        cell.style.backgroundColor = '';
        cell.style.boxShadow = '';
        delete cell.dataset.anomalyType;
        updateGridCell(parseInt(cell.id.replace('cell-', '')), 'active');
    });
    
    // Remove critical warnings from grid
    document.querySelectorAll('.grid-cell.critical').forEach(cell => {
        cell.classList.remove('critical');
    });
    
    // Clear production intervals
    clearInterval(gameState.productionIntervalId);
    clearInterval(gameState.anomalySpreadIntervalId);
    
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
