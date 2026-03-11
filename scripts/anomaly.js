// ============= ANOMALY SYSTEM =============
// This file handles fixing anomalies detected in the production grid
// Anomalies are generated per-cell in production.js based on override probability

// ============= WARNING THRESHOLD SYSTEM =============
// Check if anomalies have spread too far - system collapse if exceeded
const WARNING_CRITICAL_THRESHOLD = 15; // System collapses if 30+ cells are anomalous

function countTotalAnomalies() {
    return document.querySelectorAll('[data-anomaly-type]').length;
}

function checkWarningThreshold() {
    const totalAnomalies = countTotalAnomalies();
    if (totalAnomalies >= WARNING_CRITICAL_THRESHOLD && !gameState.systemInCriticalFailure) {
        logMessage(`> SYSTEM INTEGRITY FAILURE: ${totalAnomalies}/${WARNING_CRITICAL_THRESHOLD} CRITICAL THRESHOLD REACHED`, '#ff3333');
        logMessage('> INFRASTRUCTURE COLLAPSE DETECTED', '#ef4444');
        triggerCriticalFailure();
    }
}

function getAdjacentCells(cellIndex) {
    const row = Math.floor(cellIndex / 10);
    const col = cellIndex % 10;
    const adjacent = [];
    
    // Up
    if (row > 0) adjacent.push(cellIndex - 10);
    // Down
    if (row < 9) adjacent.push(cellIndex + 10);
    // Left
    if (col > 0) adjacent.push(cellIndex - 1);
    // Right
    if (col < 9) adjacent.push(cellIndex + 1);
    
    return adjacent;
}

function spreadAnomaly(anomaly) {
    if (!anomaly || !anomaly.isActive) return;
    
    // Find all cells with this anomaly color
    const anomalyCells = Array.from(document.querySelectorAll(`[data-anomaly-type="${anomaly.type}"]`));
    const cellIndices = anomalyCells.map(cell => parseInt(cell.id.replace('cell-', '')));
    
    const anomalyData = ANOMALY_TYPES[anomaly.type];
    const cellColor = ANOMALY_COLORS[anomaly.type];
    
    // For each anomalous cell, spread to adjacent active cells
    cellIndices.forEach(cellIndex => {
        const adjacent = getAdjacentCells(cellIndex);
        adjacent.forEach(adjIndex => {
            const adjCell = document.getElementById(`cell-${adjIndex}`);
            if (adjCell && adjCell.classList.contains('active') && !adjCell.dataset.anomalyType) {
                // Infect this adjacent cell
                adjCell.style.backgroundColor = cellColor;
                adjCell.style.boxShadow = `0 0 8px ${cellColor}`;
                adjCell.dataset.anomalyType = anomaly.type;
                updateGridCell(adjIndex, 'warning');
                
                anomaly.cellCount = (anomaly.cellCount || 1) + 1;
            }
        });
    });
    
    logMessage(`> ANOMALY SPREADING: ${anomalyData.name} INFECTED ${anomalyCells.length} CELLS`, anomalyData.color);
    
    // Check if warning threshold exceeded after spread
    checkWarningThreshold();
}

function fixAnomaly(anomaly) {
    if (!anomaly) return;
    
    const anomalyData = ANOMALY_TYPES[anomaly.type];
    
    logMessage(`> MANIPULATING ${anomalyData.moduleLog}... CORRECTION APPLIED.`, '#00ff41');
    
    // Find and remove only ONE cell with this anomaly type
    const anomalyCells = document.querySelectorAll(`[data-anomaly-type="${anomaly.type}"]`);
    if (anomalyCells.length > 0) {
        const cellToFix = anomalyCells[0];
        cellToFix.style.backgroundColor = '';
        cellToFix.style.boxShadow = '';
        delete cellToFix.dataset.anomalyType;
        updateGridCell(parseInt(cellToFix.id.replace('cell-', '')), 'active');
    }
    
    // Update cell count
    anomaly.cellCount = Math.max(0, (anomaly.cellCount || 1) - 1);
    
    // Mark anomaly as inactive only if no more cells remain
    if (anomaly.cellCount === 0) {
        anomaly.isActive = false;
        gameState.anomalies = gameState.anomalies.filter(a => a.id !== anomaly.id);
    }
    
    updateSocialCredit(5.50);
    
    // Disable glitch if no more active anomalies
    if (gameState.anomalies.filter(a => a.isActive).length === 0) {
        disableSupervisorGlitch();
    }
    
    // Log how many anomalies remain
    const remainingAnomalies = countTotalAnomalies();
    if (remainingAnomalies > 0) {
        logMessage(`> ANOMALY COUNT: ${remainingAnomalies} CELLS REMAINING INFECTED`, '#ff8c42');
    }
}

function triggerCriticalFailure() {
    if (gameState.systemInCriticalFailure) return;
    
    gameState.systemInCriticalFailure = true;
    logMessage('> CRITICAL FAILURE IMMINENT. EMERGENCY SHUTDOWN ADVISED.', '#ef4444');
    
    // Progressively expand red from border inward
    let layer = 0;
    const maxLayers = Math.ceil(gameState.gridSize / 2);
    
    const expandInterval = setInterval(() => {
        if (!gameState.systemInCriticalFailure) {
            clearInterval(expandInterval);
            return;
        }
        
        // Apply critical class to current layer
        for (let i = 0; i < gameState.gridSize * gameState.gridSize; i++) {
            const row = Math.floor(i / gameState.gridSize);
            const col = i % gameState.gridSize;
            
            // Calculate distance from edge (minimum distance to any border)
            const distFromEdge = Math.min(row, col, gameState.gridSize - 1 - row, gameState.gridSize - 1 - col);
            
            // If this cell is at the current layer distance from edge, highlight it
            if (distFromEdge === layer) {
                const cell = document.getElementById(`cell-${i}`);
                if (cell) {
                    cell.classList.add('critical');
                }
            }
        }
        
        layer++;
        
        // Stop when we've covered all layers
        if (layer >= maxLayers) {
            clearInterval(expandInterval);
        }
    }, 200); // Expand every 200ms
    
    // Stress meter maxes out
    gameState.stressMeterSpeed = 100;
    
    // Disable production controls except emergency shutdown
    document.querySelectorAll('.bubble-button').forEach(btn => {
        if (btn.id !== 'btn-emergency') {
            btn.disabled = true;
            btn.style.opacity = '0.5';
        }
    });
}
