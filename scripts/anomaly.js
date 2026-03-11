// ============= ANOMALY SYSTEM =============
// This file handles anomaly detection, escalation, and fixing

function triggerAnomaly() {
    if (!gameState.isProducing || gameState.systemInCriticalFailure) return;
    
    const anomalyKeys = Object.keys(ANOMALY_TYPES);
    const anomalyType = anomalyKeys[Math.floor(Math.random() * anomalyKeys.length)];
    const anomalyData = ANOMALY_TYPES[anomalyType];
    
    const anomalyId = Date.now() + Math.random();
    const randomStart = Math.floor(Math.random() * 96);
    const anomaly = {
        id: anomalyId,
        type: anomalyType,
        state: 'warning',
        startTime: Date.now(),
        cellStart: randomStart,
        cellEnd: randomStart + 4
    };
    
    gameState.anomalies.push(anomaly);
    
    // Generate random override target for red state
    gameState.overrideTargets[anomalyId] = Math.floor(Math.random() * 100);
    
    logMessage(`${anomalyData.errorLog}`, anomalyData.color);
    logMessage(`> ANOMALY DETECTED: ${anomalyData.name}`, anomalyData.color);
    
    // Paint cells yellow (warning)
    updateAnomalyCells(anomaly, 'warning');
    
    // Enable supervisor glitch
    enableSupervisorGlitch();
    
    // Update stress meter
    gameState.stressMeterSpeed = Math.min(100, gameState.stressMeterSpeed + 8);
    
    // Set timer for escalation to critical (5 seconds)
    gameState.anomalyTimers[anomalyId] = setTimeout(() => {
        escalateAnomalyToCritical(anomaly);
    }, 5000);
    
    // Random next anomaly trigger based on anomalyInterval
    const nextDelay = gameState.anomalyInterval + (Math.random() * 3000 - 1500);
    gameState.anomalyNextTrigger = setTimeout(() => {
        if (gameState.isProducing && gameState.anomalies.length <= 2) {
            triggerAnomaly();
        }
    }, nextDelay);
}

function escalateAnomalyToCritical(anomaly) {
    const anomalyData = ANOMALY_TYPES[anomaly.type];
    
    anomaly.state = 'critical';
    gameState.criticalAnomalies++;
    
    logMessage(`> CRITICAL STATE ACHIEVED: ${anomalyData.name}`, '#ef4444');
    logMessage(`> OVERRIDE REQUIRED: ADJUST ${OVERRIDE_REQUIREMENTS[anomaly.type].slider.replace('-slider', '').toUpperCase()} TO ${gameState.overrideTargets[anomaly.id]}%`, '#ef4444');
    
    updateAnomalyCells(anomaly, 'critical');
    
    // Flash screen
    document.body.classList.add('screen-flash');
    setTimeout(() => {
        document.body.classList.remove('screen-flash');
    }, 150);
    
    // Start siren
    playSirenSound();
    
    // Update stress meter
    gameState.stressMeterSpeed = Math.min(100, gameState.stressMeterSpeed + 15);
    
    // Check for critical failure conditions
    if (gameState.criticalAnomalies >= 3) {
        triggerCriticalFailure();
    } else {
        // Set timeout for persistent critical state (10 seconds will trigger shutdown)
        setTimeout(() => {
            if (anomaly.state === 'critical') {
                triggerCriticalFailure();
            }
        }, 10000);
    }
}

function updateAnomalyCells(anomaly, state) {
    const cellClass = state === 'warning' ? 'warning' : 'critical';
    
    // Get the affected cells
    let affectedCount = 0;
    for (let i = anomaly.cellStart; i <= anomaly.cellEnd && affectedCount < 5; i++) {
        if (i >= 0 && i < 100) {
            const cell = document.getElementById(`cell-${i}`);
            if (cell) {
                cell.classList.remove('active', 'warning', 'critical');
                if (state === 'warning') {
                    cell.classList.add('warning');
                } else if (state === 'critical') {
                    cell.classList.add('critical');
                }
                affectedCount++;
            }
        }
    }
}

function fixAnomaly(anomaly) {
    if (!anomaly) return;
    
    const anomalyData = ANOMALY_TYPES[anomaly.type];
    
    // Clear the timer
    if (gameState.anomalyTimers[anomaly.id]) {
        clearTimeout(gameState.anomalyTimers[anomaly.id]);
        delete gameState.anomalyTimers[anomaly.id];
    }
    
    logMessage(`> MANIPULATING ${anomalyData.moduleLog}... CORRECTION APPLIED.`, '#00ff41');
    
    // Restore cells to normal
    for (let i = anomaly.cellStart; i <= anomaly.cellStart + 4; i++) {
        if (i >= 0 && i < 100) {
            const cell = document.getElementById(`cell-${i}`);
            if (cell) {
                cell.classList.remove('warning', 'critical');
                if (gameState.activeCells.has(i)) {
                    cell.classList.add('active');
                }
            }
        }
    }
    
    // Remove anomaly from list
    gameState.anomalies = gameState.anomalies.filter(a => a.id !== anomaly.id);
    
    if (anomaly.state === 'critical') {
        gameState.criticalAnomalies--;
    }
    
    updateSocialCredit(5.50);
    
    // Decrease stress meter slightly
    gameState.stressMeterSpeed = Math.max(30, gameState.stressMeterSpeed - 10);
    
    // Disable glitch if no more anomalies
    if (gameState.anomalies.length === 0) {
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
