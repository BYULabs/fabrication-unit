// ============= GRID GENERATION & MANAGEMENT =============
// This file handles the 10x10 grid visualization in the assembly area

function generateGrid() {
    const grid = document.getElementById('assembly-grid');
    grid.innerHTML = '';
    
    for (let i = 0; i < gameState.gridSize * gameState.gridSize; i++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.id = `cell-${i}`;
        grid.appendChild(cell);
    }
}

function updateGridCell(cellId, state) {
    const cell = document.getElementById(`cell-${cellId}`);
    if (cell) {
        cell.classList.remove('active', 'warning', 'critical');
        if (state) {
            cell.classList.add(state);
        }
    }
}

function clearGridCells() {
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.classList.remove('active', 'warning', 'critical');
    });
}
