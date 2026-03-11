// ============= BUTTON INTERACTIONS =============
// This file handles all button click events and slider interactions

function initializeControls() {
    // INITIATE button - Start production cycle
    document.getElementById('btn-initiate')?.addEventListener('click', function() {
        playClickSound();
        updateSocialCredit(-1500);
        logMessage('> OPERATOR ACTION: INITIATE START CYCLE', '#ffb000');
        startProduction();
    });

    // EMERGENCY SHUTDOWN button
    document.getElementById('btn-emergency')?.addEventListener('click', function() {
        playClickSound();
        logMessage('> OPERATOR ACTION: EMERGENCY SHUTDOWN', '#ef4444');
        emergencyShutdown();
    });

    // REQUEST RATION button
    document.getElementById('btn-request-ration')?.addEventListener('click', function() {
        playClickSound();
        updateSocialCredit(3000);
        logMessage('> RATION REQUEST APPROVED. CREDITS AWARDED.', '#00ff41');
    });

    // END SHIFT button
    document.getElementById('btn-end-shift')?.addEventListener('click', function() {
        playBuzzerSound();
        updateSocialCredit(-0.25);
        logMessage('> ACCESS DENIED. WORK UNFINISHED.', '#ef4444');
    });

    // REPORT COWORKER button
    document.getElementById('btn-report-coworker')?.addEventListener('click', function() {
        playClickSound();
        updateSocialCredit(2.00);
        logMessage('> COWORKER REPORT SUBMITTED', '#ffb000');
        logMessage('> SYSTEM COMPLIANCE REGISTERED', '#00ff41');
    });

    // Anomaly fix buttons
    document.getElementById('btn-nuclear')?.addEventListener('click', function() {
        playClickSound();
        logMessage('> OPERATOR ACTION: NUCLEAR IGNITION', '#ffb000');
        updateSocialCredit(-100);
        
        // Find and fix THERMAL_DISCONTINUITY anomaly
        const anomaly = gameState.anomalies.find(a => a.type === 'THERMAL_DISCONTINUITY' && a.isActive);
        if (anomaly) {
            fixAnomaly(anomaly);
        } else {
            logMessage('> NO ACTIVE ANOMALY TO FIX', '#ff8c42');
        }
    });

    document.getElementById('btn-stasis')?.addEventListener('click', function() {
        playClickSound();
        logMessage('> OPERATOR ACTION: STASIS FIELD', '#ffb000');
        updateSocialCredit(-120);
        
        // Find and fix ISOTOPE_DRIFT anomaly
        const anomaly = gameState.anomalies.find(a => a.type === 'ISOTOPE_DRIFT' && a.isActive);
        if (anomaly) {
            fixAnomaly(anomaly);
        } else {
            logMessage('> NO ACTIVE ANOMALY TO FIX', '#ff8c42');
        }
    });

    document.getElementById('btn-coolant')?.addEventListener('click', function() {
        playClickSound();
        logMessage('> OPERATOR ACTION: COOLANT RELEASE', '#ffb000');
        updateSocialCredit(-150);
        
        // Find and fix PRESSURE_CASCADE anomaly
        const anomaly = gameState.anomalies.find(a => a.type === 'PRESSURE_CASCADE' && a.isActive);
        if (anomaly) {
            fixAnomaly(anomaly);
        } else {
            logMessage('> NO ACTIVE ANOMALY TO FIX', '#ff8c42');
        }
    });

    document.getElementById('btn-auxiliary')?.addEventListener('click', function() {
        playClickSound();
        logMessage('> OPERATOR ACTION: AUXILIARY POWER', '#ffb000');
        updateSocialCredit(-180);
        
        // Find and fix VOID_DESTABILIZATION anomaly
        const anomaly = gameState.anomalies.find(a => a.type === 'VOID_DESTABILIZATION' && a.isActive);
        if (anomaly) {
            fixAnomaly(anomaly);
        } else {
            logMessage('> NO ACTIVE ANOMALY TO FIX', '#ff8c42');
        }
    });
}

// ============= SLIDER INTERACTIONS =============
function initializeSliders() {
    const sliders = [
        { id: 'pressure-slider', valueId: 'pressure-value', key: 'pressure' },
        { id: 'flow-slider', valueId: 'flow-value', key: 'flow' },
        { id: 'temp-slider', valueId: 'temp-value', key: 'temp' },
        { id: 'vibration-slider', valueId: 'vibration-value', key: 'vibration' }
    ];

    const sliderNames = { pressure: 'PRESSURE', flow: 'FLOW RATE', temp: 'TEMPERATURE', vibration: 'VIBRATION' };

    sliders.forEach(slider => {
        const element = document.getElementById(slider.id);
        if (element) {
            element.addEventListener('input', function() {
                const value = parseInt(this.value);
                gameState.sliderValues[slider.key] = value;
                
                const valueEl = document.getElementById(slider.valueId);
                if (valueEl) valueEl.textContent = value + '%';
                
                playClickSound();
                updateSocialCredit(0.05);
                logMessage(`> ${sliderNames[slider.key]} ADJUSTED TO ${value}%`, '#ffb000');
                
                // ===== MATH-BASED STRESS SYSTEM =====
                // Recalculate stress level based on new override values
                gameState.stressMeterLevel = calculateStressLevel();
                updateStressDisplay();
                logMessage(`> OPERATOR STRESS LEVEL: ${gameState.stressMeterLevel}%`, getStressColor());
                
                // ===== PRODUCTION SPEED MULTIPLIER =====
                // Show current production speed multiplier
                const speedMultiplier = getProductionSpeedMultiplier();
                logMessage(`> PRODUCTION SPEED: ${speedMultiplier.toFixed(2)}x`, '#3b82f6');
                
                // Display multiplier range info based on current value
                if (speedMultiplier < 0.5) {
                    logMessage(`> WARNING: LOW PRODUCTION SPEED. INCREASE OVERRIDES FOR FASTER OUTPUT`, '#ffb000');
                } else if (speedMultiplier > 2.5) {
                    logMessage(`> CAUTION: HIGH PRODUCTION SPEED. SYSTEM STRESS CRITICAL`, '#ff3333');
                }
                
                // ===== ANOMALY PROBABILITY =====
                // Show current anomaly probability based on overrides
                const anomalyProbability = getAnomalyProbability();
                const anomalyPercentage = (anomalyProbability * 100).toFixed(1);
                logMessage(`> ANOMALY PROBABILITY: ${anomalyPercentage}% OF CELLS`, '#ff8c42');
                
                // Check if any critical anomalies can be fixed by this slider
                gameState.anomalies.forEach(anomaly => {
                    if (anomaly.state === 'critical') {
                        const requirement = OVERRIDE_REQUIREMENTS[anomaly.type];
                        if (requirement && requirement.slider === this.id) {
                            const target = gameState.overrideTargets[anomaly.id];
                            const tolerance = 5;
                            
                            if (Math.abs(value - target) <= tolerance) {
                                logMessage(`> OVERRIDE CORRECTION: ${sliderNames[slider.key]} STABILIZED AT ${target}%`, '#00ff41');
                                fixAnomaly(anomaly);
                            }
                        }
                    }
                });
                
                // If stress is critical, activate hazard light
                if (gameState.stressMeterLevel >= 75) {
                    activateHazardLight();
                }
            });
        }
    });
}

// ============= BUBBLE BUTTON PRESS EFFECTS =============
function initializeBubbleButtonEffects() {
    document.addEventListener('mousedown', function(e) {
        if (e.target.closest('button')) {
            const button = e.target.closest('button');
            if (button.classList.contains('bubble-button')) {
                button.style.boxShadow = 'inset 0 -2px 5px rgba(0, 0, 0, 0.5), 0 2px 5px rgba(0, 0, 0, 0.5)';
            }
        }
    });

    document.addEventListener('mouseup', function(e) {
        const buttons = document.querySelectorAll('.bubble-button');
        buttons.forEach(button => {
            button.style.boxShadow = '';
        });
    });
}
