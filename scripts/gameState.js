// ============= GAME STATE & CONSTANTS =============
// This file contains all the game state and constant definitions

const gameState = {
    isProducing: false,
    socialCredit: 1245.00,
    progressValues: { bond: 0, shield: 0, isotope: 0, void: 0 },
    stressMeterSpeed: 65,
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
    anomalyTimers: {},
    overrideTargets: {},
    anomalyNextTrigger: null
};

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
