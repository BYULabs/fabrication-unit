// ============= GAME STATE & CONSTANTS =============
// This file contains all the game state and constant definitions

const gameState = {
    isProducing: false,
    socialCredit: 0.00,
    progressValues: { bond: 0, shield: 0, isotope: 0, void: 0 },
    stressMeterLevel: 0, // 0-100, calculated from manual overrides
    gridSize: 10,
    activeCells: new Set(),
    sliderValues: { pressure: 67, flow: 42, temp: 89, vibration: 23 },
    productionSpeed: 100,
    baseProductionSpeed: 100,
    anomalyInterval: 12500,
    baseAnomalyInterval: 12500,
    anomalies: [],
    criticalAnomalies: 0,
    systemInCriticalFailure: false,
    rationRequested: false,
    anomalyTimers: {},
    overrideTargets: {},
    anomalyNextTrigger: null,
    productionIntervalId: null,
    anomalySpreadIntervalId: null
};

// ============= STRESS CALCULATION =============
// Calculate operator stress based on manual override values
// Higher override values = higher system stress
function calculateStressLevel() {
    const { pressure, flow, temp, vibration } = gameState.sliderValues;
    
    // Average the four manual override values (0-100%)
    const averageOverride = (pressure + flow + temp + vibration) / 4;
    
    // Apply exponential scaling so high values cause disproportionate stress
    // This means modest overrides don't kill the operator, but extreme ones do
    const stressLevel = Math.pow(averageOverride / 100, 1.1) * 100;
    
    return Math.round(stressLevel);
}

// Get stress level color based on current stress
function getStressColor() {
    const stress = gameState.stressMeterLevel;
    
    if (stress < 25) return '#00ff41';      // Green - Safe
    if (stress < 50) return '#ffb000';      // Yellow - Caution
    if (stress < 75) return '#ff8c42';      // Orange - Danger
    return '#ff3333';                       // Red - Critical
}

// ============= PRODUCTION SPEED MULTIPLIER =============
// Calculate production speed multiplier from manual override values
// Higher overrides = faster production
function getProductionSpeedMultiplier() {
    const { pressure, flow, temp, vibration } = gameState.sliderValues;
    
    // Average the four manual override values
    const averageOverride = (pressure + flow + temp + vibration) / 4;
    
    // Speed multiplier ranges from 0.2x (all at 0) to 3x (all at 100)
    // This creates an exponential speed increase with overrides
    const multiplier = 0.2 + (averageOverride / 100) * 2.8;
    
    return multiplier;
}

// ============= ANOMALY INTERVAL CALCULATION =============
// Calculate anomaly frequency from manual override values
// Higher overrides = more frequent anomalies (shorter interval)
function getAnomalyInterval() {
    const { pressure, flow, temp, vibration } = gameState.sliderValues;
    
    // Average the four manual override values
    const averageOverride = (pressure + flow + temp + vibration) / 4;
    
    // Interval ranges from 15000ms (all at 0 = rare) to 3000ms (all at 100 = frequent)
    // This creates an exponential increase in anomaly frequency with overrides
    const baseInterval = 15000;
    const minInterval = 3000;
    const interval = baseInterval - (averageOverride / 100) * (baseInterval - minInterval);
    
    return Math.max(minInterval, interval);
}

// ============= ANOMALY PROBABILITY CALCULATION =============
// Calculate per-cell anomaly probability based on manual override values
// Higher overrides = higher chance each produced cell is anomalous
function getAnomalyProbability() {
    const { pressure, flow, temp, vibration } = gameState.sliderValues;
    
    // Average the four manual override values
    const averageOverride = (pressure + flow + temp + vibration) / 4;
    
    // Probability ranges from 2% (all at 0) to 60% (all at 100)
    // This means with high overrides, roughly half the cells will be anomalies
    const probability = (averageOverride / 100) * 0.58 + 0.02;
    
    return probability;
}

// Get a random anomaly type
function getRandomAnomalyType() {
    const anomalyKeys = Object.keys(ANOMALY_TYPES);
    return anomalyKeys[Math.floor(Math.random() * anomalyKeys.length)];
}

// Anomaly type definitions
const ANOMALY_TYPES = {
    'ISOTOPE_DRIFT': {
        name: 'ISOTOPE DRIFT',
        color: '#ffb000',
        fixButton: 'btn-stasis',
        errorLog: '> ERROR: ISOTOPE DRIFT',
        moduleLog: 'ISOTOPE MODULE'
    },
    'THERMAL_DISCONTINUITY': {
        name: 'THERMAL DISCONTINUITY',
        color: '#ff6b6b',
        fixButton: 'btn-nuclear',
        errorLog: '> WARNING: THERMAL DISCONTINUITY DETECTED',
        moduleLog: 'THERMAL REGULATOR'
    },
    'PRESSURE_CASCADE': {
        name: 'PRESSURE CASCADE',
        color: '#ff8c42',
        fixButton: 'btn-coolant',
        errorLog: '> ERROR: PRESSURE CASCADE INITIATED',
        moduleLog: 'PRESSURE VESSEL'
    },
    'VOID_DESTABILIZATION': {
        name: 'VOID DESTABILIZATION',
        color: '#a78bfa',
        fixButton: 'btn-auxiliary',
        errorLog: '> ERROR: VOID DESTABILIZATION',
        moduleLog: 'VOID CONTAINMENT'
    }
};

const OVERRIDE_REQUIREMENTS = {
    'ISOTOPE_DRIFT': { slider: 'vibration-slider', target: null },
    'THERMAL_DISCONTINUITY': { slider: 'flow-slider', target: null },
    'PRESSURE_CASCADE': { slider: 'pressure-slider', target: null },
    'VOID_DESTABILIZATION': { slider: 'temp-slider', target: null }
};

// ============= ANOMALY COLOR MAPPING =============
// Map anomaly types to colors that match their fix buttons
const ANOMALY_COLORS = {
    'ISOTOPE_DRIFT': '#a78bfa',           // Purple - matches STASIS button
    'THERMAL_DISCONTINUITY': '#22c55e',   // Green - matches NUCLEAR button
    'PRESSURE_CASCADE': '#3b82f6',         // Blue - matches COOLANT button
    'VOID_DESTABILIZATION': '#eab308'     // Yellow - matches AUXILIARY button
};
