// High Score Management System
// Uses localStorage with pattern: arcade_highscores_{gameName}

class HighScoreManager {
    constructor() {
        this.games = ['tetris', 'pole-position', 'monaco-gp', 'frogger'];
        this.maxScores = 5;
    }

    // Get high scores for a specific game
    getScores(gameName) {
        const key = `arcade_highscores_${gameName}`;
        const scores = localStorage.getItem(key);
        return scores ? JSON.parse(scores) : [];
    }

    // Add a new score
    addScore(gameName, playerName, score) {
        const scores = this.getScores(gameName);
        
        // Add new score
        scores.push({
            name: playerName || "Player",
            score: parseInt(score),
            date: Date.now()
        });

        // Sort by score (descending)
        scores.sort((a, b) => b.score - a.score);

        // Keep only top 5
        const topScores = scores.slice(0, this.maxScores);

        // Save back to localStorage
        const key = `arcade_highscores_${gameName}`;
        localStorage.setItem(key, JSON.stringify(topScores));

        return topScores;
    }

    // Get highest score for a game
    getHighScore(gameName) {
        const scores = this.getScores(gameName);
        return scores.length > 0 ? scores[0].score : 0;
    }

    // Check if score qualifies for high score table
    isHighScore(gameName, score) {
        const scores = this.getScores(gameName);
        if (scores.length < this.maxScores) return true;
        return score > scores[scores.length - 1].score;
    }

    // Clear all scores for a game
    clearScores(gameName) {
        const key = `arcade_highscores_${gameName}`;
        localStorage.removeItem(key);
    }

    // Initialize with demo scores if empty
    initializeDemoScores() {
        const demoScores = {
            'tetris': [
                { name: "CHAD", score: 15000, date: Date.now() - 86400000 },
                { name: "LARS", score: 12500, date: Date.now() - 172800000 },
                { name: "ACE", score: 10000, date: Date.now() - 259200000 },
                { name: "MAX", score: 8500, date: Date.now() - 345600000 },
                { name: "PIXEL", score: 7000, date: Date.now() - 432000000 }
            ],
            'pole-position': [
                { name: "SPEEDY", score: 45000, date: Date.now() - 86400000 },
                { name: "TURBO", score: 38000, date: Date.now() - 172800000 },
                { name: "RACER", score: 32000, date: Date.now() - 259200000 },
                { name: "DRIFT", score: 28000, date: Date.now() - 345600000 },
                { name: "ZOOM", score: 25000, date: Date.now() - 432000000 }
            ],
            'monaco-gp': [
                { name: "MONACO", score: 35000, date: Date.now() - 86400000 },
                { name: "GRAND", score: 30000, date: Date.now() - 172800000 },
                { name: "PRIX", score: 25000, date: Date.now() - 259200000 },
                { name: "FAST", score: 20000, date: Date.now() - 345600000 },
                { name: "FURIOUS", score: 18000, date: Date.now() - 432000000 }
            ],
            'frogger': [
                { name: "HOPPER", score: 5000, date: Date.now() - 86400000 },
                { name: "JUMPER", score: 4200, date: Date.now() - 172800000 },
                { name: "CROAKER", score: 3800, date: Date.now() - 259200000 },
                { name: "RIBBIT", score: 3200, date: Date.now() - 345600000 },
                { name: "LEAP", score: 2800, date: Date.now() - 432000000 }
            ]
        };

        // Only initialize if no scores exist
        this.games.forEach(game => {
            if (this.getScores(game).length === 0) {
                const key = `arcade_highscores_${game}`;
                localStorage.setItem(key, JSON.stringify(demoScores[game]));
            }
        });
    }

    // Format date for display
    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    }

    // Display scores in the UI
    displayScores() {
        this.games.forEach(game => {
            const scores = this.getScores(game);
            const scoreList = document.getElementById(`${game}-scores`);
            
            if (scoreList) {
                scoreList.innerHTML = '';
                
                if (scores.length === 0) {
                    scoreList.innerHTML = '<li style="text-align: center; color: #666;">No scores yet!</li>';
                } else {
                    scores.forEach((entry, index) => {
                        const li = document.createElement('li');
                        li.innerHTML = `
                            <span class="player-name">${index + 1}. ${entry.name}</span>
                            <span class="player-score">${entry.score.toLocaleString()}</span>
                        `;
                        scoreList.appendChild(li);
                    });
                }
            }

            // Update high score display on game cards
            const highScoreElement = document.getElementById(`${game}-high`);
            if (highScoreElement) {
                highScoreElement.textContent = this.getHighScore(game).toLocaleString();
            }
        });
    }

    // Export scores to JSON
    exportScores() {
        const allScores = {};
        this.games.forEach(game => {
            allScores[game] = this.getScores(game);
        });
        return JSON.stringify(allScores, null, 2);
    }

    // Import scores from JSON
    importScores(jsonData) {
        try {
            const allScores = JSON.parse(jsonData);
            Object.keys(allScores).forEach(game => {
                const key = `arcade_highscores_${game}`;
                localStorage.setItem(key, JSON.stringify(allScores[game]));
            });
            this.displayScores();
            return true;
        } catch (error) {
            console.error('Error importing scores:', error);
            return false;
        }
    }
}

// Create global instance
const highScoreManager = new HighScoreManager();

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    highScoreManager.initializeDemoScores();
    highScoreManager.displayScores();
});

// Listen for score updates from games via postMessage
window.addEventListener('message', (event) => {
    if (event.data.type === 'arcade-score-update') {
        const { game, score, playerName } = event.data;
        
        if (highScoreManager.isHighScore(game, score)) {
            // Prompt for name if new high score
            const name = playerName || prompt('🎉 NEW HIGH SCORE! Enter your name:', 'Player');
            if (name) {
                highScoreManager.addScore(game, name, score);
                highScoreManager.displayScores();
            }
        }
    }
});
