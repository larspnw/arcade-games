// Menu and Game Loading System

let currentGame = null;

// Game configuration
const gameConfig = {
    'tetris': {
        name: 'TETRIS',
        path: 'games/tetris/index.html',
        description: 'Classic block stacking puzzle'
    },
    'pole-position': {
        name: 'POLE POSITION',
        path: 'games/pole-position/index.html',
        description: 'High-speed racing action'
    },
    'monaco-gp': {
        name: 'MONACO GP',
        path: 'games/monaco-gp/index.html',
        description: 'Dodge traffic and collect fuel'
    },
    'frogger': {
        name: 'FROGGER',
        path: 'games/frogger/index.html',
        description: 'Help the frog cross safely'
    }
};

// Load a game
function loadGame(gameName) {
    if (!gameConfig[gameName]) {
        console.error('Game not found:', gameName);
        return;
    }

    currentGame = gameName;
    const game = gameConfig[gameName];

    // Update UI
    document.getElementById('menu-view').classList.add('hidden');
    document.getElementById('game-view').classList.remove('hidden');
    
    // Update game info
    document.getElementById('current-game-name').textContent = game.name;
    document.getElementById('current-high-score').textContent = 
        highScoreManager.getHighScore(gameName).toLocaleString();

    // Load game in iframe
    const iframe = document.getElementById('game-frame');
    iframe.src = game.path;

    // Add event listener for score updates
    iframe.onload = () => {
        console.log(`Loaded: ${game.name}`);
        
        // Inject score tracking into the game
        try {
            injectScoreTracking(iframe, gameName);
        } catch (error) {
            console.warn('Could not inject score tracking:', error);
        }
    };

    // Play a sound effect (if available)
    playSound('start');
}

// Return to main menu
function backToMenu() {
    // Confirm if game is running
    if (currentGame) {
        const confirmed = confirm('Return to menu? Your current game progress will be lost.');
        if (!confirmed) return;
    }

    // Update UI
    document.getElementById('game-view').classList.add('hidden');
    document.getElementById('menu-view').classList.remove('hidden');

    // Clear iframe
    const iframe = document.getElementById('game-frame');
    iframe.src = '';
    
    currentGame = null;

    // Refresh high scores display
    highScoreManager.displayScores();

    // Play sound effect
    playSound('back');
}

// Inject score tracking into game iframes
function injectScoreTracking(iframe, gameName) {
    try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        
        // Create script to monitor score changes
        const script = iframeDoc.createElement('script');
        script.textContent = `
            (function() {
                const gameName = '${gameName}';
                let lastScore = 0;
                let checkInterval = null;
                
                // Function to find and monitor score element
                function findScoreElement() {
                    const selectors = ['#score', '#finalScore', '.score', '[id*="score"]'];
                    for (const selector of selectors) {
                        const element = document.querySelector(selector);
                        if (element) return element;
                    }
                    return null;
                }
                
                // Monitor score changes
                function monitorScore() {
                    const scoreElement = findScoreElement();
                    if (scoreElement) {
                        const currentScore = parseInt(scoreElement.textContent) || 0;
                        if (currentScore > lastScore) {
                            lastScore = currentScore;
                        }
                    }
                }
                
                // Report score on game over
                window.addEventListener('beforeunload', () => {
                    if (lastScore > 0) {
                        window.parent.postMessage({
                            type: 'arcade-score-update',
                            game: gameName,
                            score: lastScore
                        }, '*');
                    }
                });
                
                // Start monitoring
                checkInterval = setInterval(monitorScore, 1000);
                
                // Also hook into common game over patterns
                const originalAlert = window.alert;
                window.alert = function(msg) {
                    if (msg && (msg.includes('GAME OVER') || msg.includes('Score') || msg.includes('COMPLETE'))) {
                        monitorScore(); // Get final score
                        if (lastScore > 0) {
                            window.parent.postMessage({
                                type: 'arcade-score-update',
                                game: gameName,
                                score: lastScore
                            }, '*');
                        }
                    }
                    return originalAlert.apply(this, arguments);
                };
            })();
        `;
        
        iframeDoc.body.appendChild(script);
    } catch (error) {
        console.warn('Could not inject score tracking:', error);
    }
}

// Simple sound effects (using Web Audio API)
function playSound(type) {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // Different sounds for different actions
        switch(type) {
            case 'start':
                oscillator.frequency.value = 800;
                gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
                oscillator.start(audioCtx.currentTime);
                oscillator.stop(audioCtx.currentTime + 0.5);
                break;
            case 'back':
                oscillator.frequency.value = 400;
                gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                oscillator.start(audioCtx.currentTime);
                oscillator.stop(audioCtx.currentTime + 0.3);
                break;
        }
    } catch (error) {
        // Silently fail if Web Audio not supported
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // ESC to return to menu
    if (e.key === 'Escape' && currentGame) {
        backToMenu();
    }
    
    // Number keys to quick-launch games (only on menu)
    if (!currentGame) {
        const gameKeys = {
            '1': 'tetris',
            '2': 'pole-position',
            '3': 'monaco-gp',
            '4': 'frogger'
        };
        
        if (gameKeys[e.key]) {
            loadGame(gameKeys[e.key]);
        }
    }
});

// Add hover effects to game cards
document.addEventListener('DOMContentLoaded', () => {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Subtle sound on hover
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                const audioCtx = new AudioContext();
                const oscillator = audioCtx.createOscillator();
                const gainNode = audioCtx.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioCtx.destination);
                
                oscillator.frequency.value = 600;
                gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
                oscillator.start(audioCtx.currentTime);
                oscillator.stop(audioCtx.currentTime + 0.1);
            } catch (error) {
                // Silently fail
            }
        });
    });
});

// Prevent accidental navigation away
window.addEventListener('beforeunload', (e) => {
    if (currentGame) {
        e.preventDefault();
        e.returnValue = 'Game in progress. Are you sure you want to leave?';
        return e.returnValue;
    }
});

// Console easter egg
console.log('%c🕹️ RETRO ARCADE 🕹️', 'font-size: 24px; color: #00d9ff; text-shadow: 0 0 10px #00d9ff;');
console.log('%cWelcome to the arcade!', 'font-size: 14px; color: #ff006e;');
console.log('%cTip: Press 1-4 to quick-launch games!', 'font-size: 12px; color: #39ff14;');
console.log('%cTip: Press ESC to return to menu', 'font-size: 12px; color: #ffbe0b;');
