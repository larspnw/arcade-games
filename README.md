# 🕹️ Retro Arcade - Classic Games Collection

A unified retro arcade gaming experience featuring 4 classic games with high score tracking, polished UI, and easy extensibility.

## 🎮 Featured Games

1. **TETRIS** - Classic block-stacking puzzle game
2. **POLE POSITION** - High-speed racing action
3. **MONACO GP** - Dodge traffic and collect fuel
4. **FROGGER** - Help the frog cross safely

## ✨ Features

- 🎨 **Retro Arcade Theme** - Neon lights, scanlines, and authentic 80s vibes
- 🏆 **High Score Tracking** - localStorage-based top 5 scores per game
- 🎯 **Seamless Navigation** - Load games without leaving the page
- 🔊 **Sound Effects** - Web Audio API-powered retro sounds
- ⌨️ **Keyboard Shortcuts** - Quick launch with number keys (1-4), ESC to exit
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🎭 **Smooth Animations** - CSS transitions and neon effects

## 🚀 Quick Start

### Local Development

Simply open `index.html` in a modern web browser:

```bash
open index.html
# or
python3 -m http.server 8000
# then visit http://localhost:8000
```

### GitHub Pages Deployment

Already deployed! Visit: [https://larspnw.github.io/arcade-games](https://larspnw.github.io/arcade-games)

## 📁 Project Structure

```
arcade-games/
├── index.html              # Main menu and arcade hub
├── css/
│   └── style.css          # Retro arcade theme styles
├── js/
│   ├── menu.js            # Game loading and navigation
│   └── highscores.js      # High score management
├── games/
│   ├── tetris/
│   │   └── index.html
│   ├── pole-position/
│   │   └── index.html
│   ├── monaco-gp/
│   │   └── index.html
│   └── frogger/
│       └── index.html
└── README.md
```

## 🎯 High Score System

### Storage Format

High scores are stored in `localStorage` with the pattern:
```
arcade_highscores_{gameName}
```

Each entry contains:
```javascript
{
  name: "Player",
  score: number,
  date: timestamp
}
```

### API Usage

```javascript
// Get high scores for a game
const scores = highScoreManager.getScores('tetris');

// Add a new score
highScoreManager.addScore('tetris', 'PLAYER1', 15000);

// Get the highest score
const highScore = highScoreManager.getHighScore('tetris');

// Check if score qualifies
const isHigh = highScoreManager.isHighScore('tetris', 12000);

// Export all scores
const json = highScoreManager.exportScores();

// Import scores
highScoreManager.importScores(json);
```

## 🎮 Keyboard Controls

### Menu Navigation
- **1-4** - Quick launch games
- **Mouse** - Click game cards to play

### In-Game
- **ESC** - Return to menu (with confirmation)
- Each game has its own controls (displayed in-game)

## 🔧 Adding New Games

1. Add your game folder to `games/`:
   ```
   games/
   └── your-game/
       └── index.html
   ```

2. Update `js/menu.js` gameConfig:
   ```javascript
   'your-game': {
       name: 'YOUR GAME',
       path: 'games/your-game/index.html',
       description: 'Game description'
   }
   ```

3. Add game card to `index.html`:
   ```html
   <div class="game-card" data-game="your-game">
       <div class="game-thumbnail">🎮</div>
       <h2>YOUR GAME</h2>
       <p class="game-desc">Description</p>
       <div class="high-score">
           High Score: <span id="your-game-high">0</span>
       </div>
       <button class="play-btn" onclick="loadGame('your-game')">PLAY</button>
   </div>
   ```

4. Add to high scores section:
   ```html
   <div class="score-column">
       <h3>YOUR GAME</h3>
       <ol id="your-game-scores" class="score-list"></ol>
   </div>
   ```

5. Update `js/highscores.js` games array:
   ```javascript
   this.games = ['tetris', 'pole-position', 'monaco-gp', 'frogger', 'your-game'];
   ```

## 🎨 Theme Customization

Edit CSS variables in `css/style.css`:

```css
:root {
    --neon-pink: #ff006e;
    --neon-blue: #00d9ff;
    --neon-purple: #8338ec;
    --neon-yellow: #ffbe0b;
    --neon-green: #39ff14;
    --dark-bg: #0a0e27;
    --darker-bg: #050810;
}
```

## 🏆 Default High Scores

The system includes demo scores for all games. To reset:

```javascript
// Clear specific game
highScoreManager.clearScores('tetris');

// Re-initialize demo scores
highScoreManager.initializeDemoScores();
```

## 🌐 Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Requires modern browser with:
- ES6 JavaScript
- CSS Grid & Flexbox
- localStorage
- Web Audio API (optional, for sounds)

## 📝 License

Open source - feel free to use and modify!

## 🎉 Credits

Built with ❤️ for retro gaming enthusiasts.

Games included:
- Tetris (Classic puzzle)
- Pole Position (Racing)
- Monaco GP (Arcade racing)
- Frogger (Action arcade)

---

**Made for the arcade generation!** 🕹️✨

Press START to begin!
