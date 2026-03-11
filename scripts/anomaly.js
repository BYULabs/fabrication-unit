// ============= ANOMALY SYSTEM =============
// This file handles fixing anomalies detected in the production grid
// Anomalies are generated per-cell in production.js based on override probability

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
}

function fixAnomaly(anomaly) {
    if (!anomaly) return;
    
    const anomalyData = ANOMALY_TYPES[anomaly.type];
    
    logMessage(`> MANIPULATING ${anomalyData.moduleLog}... CORRECTION APPLIED.`, '#00ff41');
    
    // Mark anomaly as inactive - cells will no longer be colored with this anomaly
    anomaly.isActive = false;
    
    // Reset cells that had this anomaly type
    document.querySelectorAll('[data-anomaly-type]').forEach(cell => {
        if (cell.dataset.anomalyType === anomaly.type) {
            cell.style.backgroundColor = '';
            cell.style.boxShadow = '';
            delete cell.dataset.anomalyType;
            updateGridCell(parseInt(cell.id.replace('cell-', '')), 'active');
        }
    });
    
    // Remove anomaly from list
    gameState.anomalies = gameState.anomalies.filter(a => a.id !== anomaly.id);
    
    updateSocialCredit(5.50);
    
    // Disable glitch if no more active anomalies
    if (gameState.anomalies.filter(a => a.isActive).length === 0) {
        disableSupervisorGlitch();
    }
}

function triggerCriticalFailure() {
    if (gameState.systemInCriticalFailure) return;
    
    gameState.systemInCriticalFailure = true;
    logMessage('> CRITICAL FAILURE IMMINENT. EMERGENCY SHUTDOWN ADVISED.', '#ef4444');
    
    // Screen flash red repeatedly
    let flashCount = 0;
    const flashInterval = setInterval(() => {
        document.body.classList.toggle('screen-flash');
        flashCount++;
        if (flashCount > 20 || !gameState.systemInCriticalFailure) {
            clearInterval(flashInterval);
            document.body.classList.remove('screen-flash');
        }
    }, 200);
    
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
