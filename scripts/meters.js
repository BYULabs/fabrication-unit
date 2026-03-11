// ============= FACTORY METERS SYSTEM =============
// This file handles the dynamic factory meters that respond to production anomalies

const meterState = {
    nuclear: 23,      // Nuclear reactor output (0-100%)
    coolant: 45,      // Cooling system (0-100%)
    radiation: 34,    // Radiation levels (0-100%)
    stability: 78     // System stability (0-100%, inversely affected by anomalies)
};

// ============= METER UPDATE LOGIC =============
function updateMetersFromAnomalies() {
    const anomalyCount = countTotalAnomalies();
    const maxAnomalies = 30; // Critical threshold
    const anomalyPercentage = (anomalyCount / maxAnomalies) * 100;

    // NUCLEAR: Increases with anomalies (danger)
    meterState.nuclear = Math.min(100, 20 + (anomalyPercentage * 0.8));

    // RADIATION: Increases with anomalies (danger)
    meterState.radiation = Math.min(100, 25 + (anomalyPercentage * 0.9));

    // STABILITY: Decreases with anomalies (system degrades)
    meterState.stability = Math.max(0, 78 - (anomalyPercentage * 0.7));

    // COOLANT: Slightly affected by anomalies
    meterState.coolant = Math.min(100, 45 + (anomalyPercentage * 0.3));

    updateMeterDisplay();
}

function updateMeterDisplay() {
    setMeterAngle('nuclear', meterState.nuclear);
    setMeterAngle('coolant', meterState.coolant);
    setMeterAngle('radiation', meterState.radiation);
    setMeterAngle('stability', meterState.stability);

    updateMeterLabels();
}

function setMeterAngle(meterName, percentage) {
    const angle = calculateGaugeAngle(percentage);
    const arrow = document.getElementById(`meter-${meterName}-arrow`);
    if (arrow) {
        arrow.style.transform = `rotate(${angle}deg)`;
    }
}

function calculateGaugeAngle(percentage) {
    // Map 0-100% to -75deg to 75deg rotation
    // -75deg = 0%, 0deg = 50%, 75deg = 100%
    return -75 + (percentage / 100) * 150;
}

function getMeterColor(meterName, percentage) {
    // Determine color based on danger level
    if (percentage < 33) return '#00ff41';      // Green - Safe
    if (percentage < 66) return '#ffb000';      // Yellow - Caution
    return '#ff3333';                           // Red - Danger
}

function getColorForMeter(meterName, percentage) {
    // STABILITY works inversely (lower is worse)
    if (meterName === 'stability') {
        if (percentage > 66) return '#00ff41';  // Green - Stable
        if (percentage > 33) return '#ffb000';  // Yellow - Unstable
        return '#ff3333';                       // Red - Critical
    }

    // Other meters: higher values = danger
    if (percentage < 33) return '#00ff41';      // Green - Safe
    if (percentage < 66) return '#ffb000';      // Yellow - Caution
    return '#ff3333';                           // Red - Danger
}

function updateMeterLabels() {
    document.getElementById('meter-nuclear-value').textContent = 
        `NUCLEAR: ${Math.round(meterState.nuclear)}%`;
    document.getElementById('meter-coolant-value').textContent = 
        `COOLANT: ${Math.round(meterState.coolant)}%`;
    document.getElementById('meter-radiation-value').textContent = 
        `RADIATION: ${Math.round(meterState.radiation)}%`;
    document.getElementById('meter-stability-value').textContent = 
        `STABILITY: ${Math.round(meterState.stability)}%`;

    // Update text colors based on danger levels
    updateMeterColor('nuclear', meterState.nuclear);
    updateMeterColor('coolant', meterState.coolant);
    updateMeterColor('radiation', meterState.radiation);
    updateMeterColor('stability', meterState.stability);
}

function updateMeterColor(meterName, percentage) {
    const valueEl = document.getElementById(`meter-${meterName}-value`);
    const arrowEl = document.getElementById(`meter-${meterName}-arrow`);
    
    if (!valueEl || !arrowEl) return;

    const color = getColorForMeter(meterName, percentage);
    valueEl.style.color = color;
    arrowEl.style.borderColor = color;
    arrowEl.style.backgroundColor = color;
    
    const glowColor = color.replace('#', '');
    arrowEl.style.boxShadow = `0 0 8px ${color}`;
}

// ============= BUTTON EFFECTS ON METERS =============
function registerMeterButtonEffects() {
    // NUCLEAR IGNITION - increases nuclear output temporarily, then decreases radiation
    document.getElementById('btn-nuclear')?.addEventListener('click', function() {
        meterState.nuclear = Math.min(100, meterState.nuclear + 15);
        meterState.radiation = Math.max(0, meterState.radiation - 10);
        setTimeout(() => {
            updateMetersFromAnomalies();
        }, 1500);
    });

    // COOLANT RELEASE - decreases temperature, helps stability
    document.getElementById('btn-coolant')?.addEventListener('click', function() {
        meterState.coolant = Math.min(100, meterState.coolant + 20);
        meterState.radiation = Math.max(0, meterState.radiation - 8);
        setTimeout(() => {
            updateMetersFromAnomalies();
        }, 1500);
    });

    // STASIS FIELD - increases stability significantly
    document.getElementById('btn-stasis')?.addEventListener('click', function() {
        meterState.stability = Math.min(100, meterState.stability + 25);
        setTimeout(() => {
            updateMetersFromAnomalies();
        }, 1500);
    });

    // AUXILIARY POWER - increases nuclear output
    document.getElementById('btn-auxiliary')?.addEventListener('click', function() {
        meterState.nuclear = Math.min(100, meterState.nuclear + 10);
        meterState.coolant = Math.max(0, meterState.coolant - 5);
        setTimeout(() => {
            updateMetersFromAnomalies();
        }, 1500);
    });

    // INITIATE - resets meters when starting production
    document.getElementById('btn-initiate')?.addEventListener('click', function() {
        meterState.nuclear = 23;
        meterState.coolant = 45;
        meterState.radiation = 34;
        meterState.stability = 78;
        updateMeterDisplay();
    });

    // EMERGENCY SHUTDOWN - drops all critical meters
    document.getElementById('btn-emergency')?.addEventListener('click', function() {
        meterState.nuclear = 0;
        meterState.radiation = 0;
        meterState.stability = 100;
        meterState.coolant = 100;
        updateMeterDisplay();
    });
}

// ============= INITIALIZATION =============
function initializeMeters() {
    updateMeterDisplay();
    registerMeterButtonEffects();
}

// Call on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMeters);
} else {
    initializeMeters();
}
