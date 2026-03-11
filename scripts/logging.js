// ============= LOGGING SYSTEM =============
// This file handles all system message logging to the SYSTEM_LOG display

function logMessage(message, color = '#00ff41') {
    const logDiv = document.querySelector('.overflow-y-auto');
    const time = new Date();
    const timeString = `[${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}:${time.getSeconds().toString().padStart(2, '0')}.${String(time.getMilliseconds()).padStart(3, '0')}]`;
    
    const logEntry = document.createElement('p');
    
    // Color mapping
    if (color === '#ffb000') logEntry.className = 'text-[#ffb000]';
    else if (color === '#ef4444') logEntry.className = 'text-red-400';
    else if (color === '#3b82f6') logEntry.className = 'text-blue-400';
    else if (color === '#ff6b6b') logEntry.className = 'text-red-500';
    else if (color === '#ff8c42') logEntry.className = 'text-orange-500';
    else if (color === '#a78bfa') logEntry.className = 'text-purple-400';
    else logEntry.className = 'text-[#00ff41]';
    
    logEntry.textContent = `${timeString} ${message}`;
    logDiv.prepend(logEntry);
    
    if (logDiv.children.length > 25) {
        logDiv.removeChild(logDiv.lastChild);
    }
}
