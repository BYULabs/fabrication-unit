# STATION_772_B - Project Structure Guide

## 📁 Project Organization

Your JavaScript project has been reorganized into modular files for better learning and maintenance!

```
cog-dampener/
├── index.html              # Main HTML file (clean, no embedded code)
├── styles/
│   └── main.css            # All CSS animations and styling
└── scripts/
    ├── gameState.js        # Game state and constants
    ├── audio.js            # Sound effects (Web Audio API)
    ├── grid.js             # Grid system and cell management
    ├── logging.js          # System log messages
    ├── ui.js               # UI updates (time, social credit, stress meter, progress)
    ├── production.js       # Production cycle logic
    ├── anomaly.js          # Anomaly detection and fixing system
    ├── controls.js         # Button and slider event handlers
    └── app.js              # Main initialization
```

---

## 📖 What Each File Does

### **index.html**
- Contains the **HTML structure** only
- Links to external CSS (`styles/main.css`)
- Links to external JavaScript files in `scripts/` folder
- Clean and readable - easier to understand the layout

### **styles/main.css**
- All CSS animations and styles (keyframes, classes, etc.)
- Keeps styling separate from logic
- Includes animations like pulse, jitter, glitch, blink, shake

### **scripts/gameState.js**
- **Game State Object**: Tracks all gameplay variables (production status, social credit, progress values, etc.)
- **Constants**: Anomaly types and override requirements
- This is where you modify game settings!

### **scripts/audio.js**
- **Audio Synthesis**: Creates sound effects using Web Audio API
- Functions: `playClickSound()`, `playBuzzerSound()`, `playSirenSound()`
- Learn how to generate sounds programmatically!

### **scripts/grid.js**
- **Grid Management**: Creates and updates the 10x10 assembly grid
- Functions: `generateGrid()`, `updateGridCell()`, `clearGridCells()`
- Handles the visualization of production cells

### **scripts/logging.js**
- **System Logging**: Displays messages in the SYSTEM_LOG display
- Function: `logMessage()` with color support
- Great for understanding how to manipulate the DOM

### **scripts/ui.js**
- **UI Updates**: Social credit, system time, stress meter, progress bars
- Functions: Updates all dynamic displays
- Shows how to update HTML elements from JavaScript

### **scripts/production.js**
- **Production Cycle**: Main game loop logic
- Functions: `startProduction()`, `resetProduction()`, `emergencyShutdown()`
- Learn about intervals and timing in JavaScript

### **scripts/anomaly.js**
- **Anomaly System**: Detects, escalates, and fixes system anomalies
- Functions: Anomaly triggers, escalation, critical failure handling
- Complex state management and event handling

### **scripts/controls.js**
- **Event Listeners**: All button clicks and slider inputs
- Functions: `initializeControls()`, `initializeSliders()`, `initializeBubbleButtonEffects()`
- Learn how to handle user interactions

### **scripts/app.js**
- **Main Initialization**: Brings everything together
- Runs when the page loads
- Calls all initialization functions in the correct order

---

## 🎓 Learning Path

### Level 1 - **Understand the Basics**
1. Start with `index.html` - see the HTML structure
2. Look at `gameState.js` - see what data is being tracked
3. Check `app.js` - see how everything is initialized

### Level 2 - **Explore Individual Systems**
1. **UI System**: Study `ui.js` to see how the display updates
2. **Audio System**: Study `audio.js` to see how sounds are created
3. **Grid System**: Study `grid.js` to see how DOM elements are managed

### Level 3 - **Understand Game Logic**
1. **Production**: Read `production.js` to understand the main game loop
2. **Anomalies**: Read `anomaly.js` to see complex state management
3. **Controls**: Read `controls.js` to see event handling patterns

### Level 4 - **Modify and Experiment**
1. Change values in `gameState.js` to tweak gameplay
2. Add new sounds in `audio.js`
3. Create new buttons in `index.html` and handlers in `controls.js`

---

## 🔍 Key Concepts to Learn

### Separation of Concerns
Each file has a specific responsibility - easier to find and modify code

### State Management
`gameState` object holds all data - makes debugging easier

### DOM Manipulation
Updating HTML elements from JavaScript (select, create, modify)

### Event Handling
Responding to user interactions (clicks, input changes)

### Timing & Animation
Using `setInterval`, `setTimeout` for game loops and animations

### Web Audio API
Creating and synthesizing sound effects programmatically

---

## 🚀 How to Modify the Project

### To change colors:
- Edit `styles/main.css` (CSS classes)
- Or edit HTML classes in `index.html`

### To add a new button:
1. Add HTML button in `index.html` with an `id`
2. Add event listener in `controls.js`
3. Create your function in the appropriate module

### To change game balance:
- Edit values in `gameState.js`
- Example: `baseProductionSpeed: 100` makes it slower/faster

### To add new sounds:
- Create a new function in `audio.js`
- Call it from `controls.js` or other modules

---

## 📚 Resources

- **Web Audio API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- **DOM Manipulation**: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model
- **JavaScript Event Handling**: https://developer.mozilla.org/en-US/docs/Web/API/EventListener
- **CSS Animations**: https://developer.mozilla.org/en-US/docs/Web/CSS/animation

---

Happy learning! Pick one file, understand it, then move to the next. Soon you'll understand the entire system! 🎮
