# 🎮 Multi-Game Platform

A complete Flask-based web application featuring three interactive games (Tic Tac Toe, Number Puzzle, and Car Game) with user authentication, score tracking, and a leaderboard system.

---

## 📋 Features

### 🎯 Games Included
1. **Tic Tac Toe** - Classic strategy game vs AI with minimax algorithm
   - Player (X) vs Computer (AI) opponent
   - Smart AI using minimax algorithm for unbeatable strategy
   - Scoring: Win = 10 points, Draw = 5 points, Loss = 0 points

2. **Number Puzzle** - Sliding puzzle game (similar to 15-puzzle)
   - 4x4 grid with 15 numbered tiles and one empty space
   - Arrange tiles in numerical order
   - Score based on number of moves and completion time
   - Scoring: Up to 1000 points depending on efficiency

3. **Car Game** - Action-based HTML5 Canvas game
   - Keyboard-controlled car (arrow keys or WASD)
   - Collect coins for points (+10 per coin)
   - Avoid obstacles (-50 health per hit)
   - 60-second time limit with time bonus
   - Scoring: Points from coins + time bonus

### 👥 User System
- Simple username-based login (no complex authentication required)
- Session management
- User profile tracking

### 🏆 Leaderboard
- Displays top 10 scores per game
- Real-time score updates
- Sorted by highest scores

### 📊 Score Tracking
- Automatic score recording after each game
- Persistent storage in SQLite database
- Score history per user and game

### 🎨 UI/UX
- Clean, modern, and responsive design
- Gradient backgrounds and smooth animations
- Professional color scheme
- Mobile-friendly layout
- Intuitive navigation menu

---

## 🏗️ Project Structure

```
miniGames/
├── app.py                 # Main Flask application with API endpoints
├── models.py              # SQLAlchemy database models
├── requirements.txt       # Python dependencies
├── minigames.db           # SQLite database (auto-created)
│
├── templates/             # HTML templates
│   ├── base.html          # Base template with navigation
│   ├── login.html         # Login page
│   ├── dashboard.html     # Game selection dashboard
│   ├── game.html          # Game page (template for all games)
│   └── leaderboard.html   # Leaderboard display
│
├── static/                # Static files
│   ├── css/
│   │   └── style.css      # Complete styling for all pages
│   │
│   └── js/
│       ├── api.js         # API communication functions
│       ├── tic-tac-toe.js # Tic Tac Toe game logic
│       ├── number-puzzle.js # Number Puzzle game logic
│       └── car-game.js    # Car Game logic with canvas
│
└── README.md              # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.7 or higher
- pip (Python package manager)

### Installation

1. **Navigate to project directory:**
   ```bash
   cd c:\laragon\www\miniGames
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # On Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Flask server:**
   ```bash
   python app.py
   ```

   You should see output like:
   ```
   * Running on http://127.0.0.1:5000
   * Debug mode: on
   ```

5. **Open in browser:**
   - Navigate to `http://localhost:5000`
   - You should see the login page

---

## 🎮 How to Play

### Login
1. Enter any alphanumeric username (letters, numbers, and underscore allowed)
2. Click "Login & Play"
3. You'll be directed to the dashboard

### Dashboard
- Select any of the three games by clicking on a game card
- View leaderboard for global rankings

### Playing Games

**Tic Tac Toe:**
- Click on any empty cell to make your move (X)
- AI automatically makes its move (O)
- Win = 10 points, Draw = 5 points, Loss = 0 points
- Click "Submit Score" to save your result to the leaderboard

**Number Puzzle:**
- Click on tiles adjacent to the empty space to move them
- Arrange all tiles in numerical order (1-15) with empty space at the end
- Score based on number of moves and completion time
- Fewer moves = higher score

**Car Game:**
- Use Arrow Keys or WASD to control the car
- Collect yellow coins for +10 points each
- Avoid red obstacles (3 hits = game over)
- Game runs for 60 seconds with time bonus
- Try to get the highest score!

### Leaderboard
- Click "Leaderboard" in the navigation menu
- View top 10 players for each game
- Compete with other players!

---

## 🔌 API Endpoints

### Authentication
- `POST /api/login` - Login with username (returns session)

### Score Management
- `POST /api/submit-score` - Submit game score
  - Required fields: `username`, `game_name`, `score`
- `GET /api/leaderboard` - Get top scores (optional filter by game)
- `GET /api/games/<game_name>/scores` - Get all scores for a game
- `GET /api/games/<game_name>/user/<username>/scores` - Get user's scores for a game

### Example API Call (JavaScript):
```javascript
// Submit score
const response = await submitScore('player_name', 'Tic Tac Toe', 10);

// Fetch leaderboard
const leaderboard = await fetchLeaderboard('Car Game', 10);
```

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Scores Table
```sql
CREATE TABLE scores (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    username VARCHAR(80) NOT NULL,
    game_name VARCHAR(80) NOT NULL,
    score INTEGER NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🎨 Customization

### Change Colors
Edit `/static/css/style.css` and modify the CSS variables in `:root`:
```css
:root {
    --primary-color: #667eea;      /* Main color */
    --secondary-color: #764ba2;    /* Secondary color */
    --accent-color: #f093fb;       /* Accent color */
    --success-color: #48bb78;      /* Success color */
    --error-color: #f56565;        /* Error color */
}
```

### Modify Game Difficulty
- **Tic Tac Toe:** AI already uses optimal strategy (minimax)
- **Number Puzzle:** Increase shuffle iterations in `shuffle()` method, modify point calculation in `calculateScore()`
- **Car Game:** Adjust `carSpeed`, obstacle/coin spawn rates, or increase timeLimit

### Change Flask Settings
Edit `app.py`:
```python
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
app.run(debug=True, host='0.0.0.0', port=5000)  # Change port here
```

---

## 🐛 Troubleshooting

### Database Issues
**Problem:** `sqlite3.OperationalError`
- **Solution:** Delete `minigames.db` file and restart the server

### Port Already in Use
**Problem:** `Address already in use`
- **Solution:** Kill the process using port 5000 or change the port in `app.py`

### Static Files Not Loading
**Problem:** CSS/JavaScript not applied
- **Solution:** Hard refresh browser (Ctrl+F5) or clear cache

### Session Issues
**Problem:** Getting logged out on page refresh
- **Solution:** This is normal behavior. Session data is stored server-side in filesystem

---

## 📈 Game Scoring System

| Game | Condition | Points |
|------|-----------|--------|
| **Tic Tac Toe** | Win | 10 |
| | Draw | 5 |
| | Loss | 0 |
| **Number Puzzle** | Solved | 100-1000 (based on moves/time) |
| **Car Game** | Per Coin | +10 |
| | Per Obstacle Hit | -50 health |
| | Time Bonus | +2 per second remaining |

---

## 🔒 Security Notes

**Current Implementation:**
- Simple username-based authentication (suitable for demo/educational purposes)
- No password authentication
- Sessions stored in filesystem

**For Production:**
- Implement proper password hashing (bcrypt, argon2)
- Use HTTPS/TLS encryption
- Implement CSRF protection
- Add rate limiting on API endpoints
- Validate and sanitize all user inputs
- Use secure session storage (Redis, etc.)

---

## 📝 Code Comments

All major functions include detailed comments explaining:
- **Purpose:** What the function does
- **Parameters:** Input parameters and types
- **Returns:** Return values
- **Logic:** Complex algorithms (e.g., minimax in Tic Tac Toe)

Example from Tic Tac Toe:
```javascript
/**
 * Minimax algorithm for AI decision making
 * Recursively evaluates all possible game states
 * @param {number} depth - Current depth in the game tree
 * @param {boolean} isMaximizing - Whether maximizing or minimizing
 * @returns {number} Score of the position
 */
minimax(depth, isMaximizing) {
    // ... implementation
}
```

---

## 🎓 Educational Value

This project demonstrates:
- ✅ Full-stack web development (Frontend + Backend)
- ✅ RESTful API design and implementation
- ✅ Database design with ORM (SQLAlchemy)
- ✅ Session management and user authentication
- ✅ Game algorithms (minimax, collision detection, etc.)
- ✅ HTML5 Canvas graphics programming
- ✅ Responsive web design
- ✅ JavaScript ES6+ features (classes, async/await)
- ✅ Flask framework best practices
- ✅ Clean code architecture with separation of concerns

---

## 🚀 Future Enhancements

Possible improvements:
- [ ] Multiplayer support
- [ ] User profiles and statistics
- [ ] Achievement/badge system
- [ ] Sound effects and background music
- [ ] Difficulty levels for games
- [ ] More game variations
- [ ] Social features (friend requests, messages)
- [ ] Mobile app version
- [ ] Tournament mode
- [ ] In-game customization (themes, skins)

---

## 📄 License

This project is free to use for educational and personal purposes.

---

## 👨‍💻 Developer Notes

### Testing the Application

1. **Test Login:**
   - Try different usernames
   - Test special characters (should be rejected for non-alphanumeric)

2. **Test Games:**
   - Play all three games to completion
   - Verify score calculations
   - Check that scores are submitted correctly

3. **Test Leaderboard:**
   - Submit multiple scores
   - Verify top 10 are displayed correctly
   - Check sorting (highest scores first)

4. **Test API:**
   - Use browser developer tools (F12) to check Network tab
   - Verify all POST and GET requests return correct responses

### Performance Considerations

- Games run entirely in the browser (no server overhead)
- Database queries are optimized with indexing
- API responses are JSON (lightweight)
- CSS animations use GPU acceleration
- Canvas rendering is efficient

---

## 📧 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review error messages in browser console (F12)
3. Check Flask server logs in terminal
4. Examine database with SQLite browser

---

**Enjoy the Multi-Game Platform! 🎮✨**

Version 1.0 - 2026
