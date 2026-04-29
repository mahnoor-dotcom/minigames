/**
 * Number Puzzle Game Implementation
 * A sliding puzzle game (15-puzzle) where player arranges numbered tiles (1-15) in order
 * with one empty space
 * 
 * Game Logic:
 * - 4x4 grid with 15 numbered tiles and 1 empty space
 * - Player can move tiles adjacent to the empty space
 * - Goal: Arrange tiles in numerical order
 * - Score based on moves and time: More points for fewer moves and faster completion
 */

class NumberPuzzle {
    constructor() {
        this.tiles = [];
        this.emptyIndex = 15;
        this.moves = 0;
        this.startTime = null;
        this.gameOver = false;
        this.gameStarted = false;
        this.gameName = 'Number Puzzle';
        this.score = 0;
        this.init();
    }

    /**
     * Initialize the game
     */
    init() {
        // Create initial tile configuration (solved state)
        this.tiles = Array.from({ length: 16 }, (_, i) => i === 15 ? null : i + 1);
        
        // Shuffle the tiles
        this.shuffle();
        
        this.moves = 0;
        this.gameOver = false;
        this.gameStarted = false;
        this.startTime = null;
        
        this.createBoard();
        this.hideButtons();
    }

    /**
     * Create the puzzle board HTML
     */
    createBoard() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = '';

        // Create board container
        const boardContainer = document.createElement('div');
        boardContainer.className = 'puzzle-board';

        // Create 16 tiles
        for (let i = 0; i < 16; i++) {
            const tile = document.createElement('button');
            tile.className = 'puzzle-tile';
            if (this.tiles[i] === null) {
                tile.classList.add('empty');
                tile.textContent = '';
            } else {
                tile.textContent = this.tiles[i];
                tile.dataset.number = this.tiles[i];
            }
            tile.dataset.index = i;
            boardContainer.appendChild(tile);
        }

        gameContent.appendChild(boardContainer);

        // Create stats display
        const stats = document.createElement('div');
        stats.className = 'puzzle-stats';
        stats.innerHTML = `
            <div>Moves: <strong id="moveCount">0</strong></div>
            <div>Time: <strong id="timeCount">0s</strong></div>
        `;
        gameContent.appendChild(stats);

        this.addEventListeners();
        this.startTimer();
    }

    /**
     * Add event listeners to tiles
     */
    addEventListeners() {
        const tiles = document.querySelectorAll('.puzzle-tile:not(.empty)');
        tiles.forEach(tile => {
            tile.addEventListener('click', () => this.moveTile(parseInt(tile.dataset.index)));
        });
    }

    /**
     * Shuffle the tiles using random valid moves
     * This ensures the puzzle is always solvable
     */
    shuffle() {
        // Perform 100 random valid moves to shuffle
        for (let i = 0; i < 100; i++) {
            const possibleMoves = this.getPossibleMoves();
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            this.swapTiles(this.emptyIndex, randomMove);
        }
    }

    /**
     * Get all valid moves (tile indices adjacent to empty space)
     * @returns {Array} Array of valid move indices
     */
    getPossibleMoves() {
        const moves = [];
        const row = Math.floor(this.emptyIndex / 4);
        const col = this.emptyIndex % 4;

        // Check up
        if (row > 0) moves.push(this.emptyIndex - 4);
        // Check down
        if (row < 3) moves.push(this.emptyIndex + 4);
        // Check left
        if (col > 0) moves.push(this.emptyIndex - 1);
        // Check right
        if (col < 3) moves.push(this.emptyIndex + 1);

        return moves;
    }

    /**
     * Swap two tiles
     * @param {number} index1 - First index
     * @param {number} index2 - Second index
     */
    swapTiles(index1, index2) {
        [this.tiles[index1], this.tiles[index2]] = [this.tiles[index2], this.tiles[index1]];
        
        // Update empty index
        if (index1 === this.emptyIndex) {
            this.emptyIndex = index2;
        } else {
            this.emptyIndex = index1;
        }
    }

    /**
     * Handle tile click - move tile if valid
     * @param {number} index - Index of clicked tile
     */
    moveTile(index) {
        if (!this.gameStarted) {
            this.gameStarted = true;
            this.startTime = Date.now();
        }

        // Check if tile is adjacent to empty space
        const possibleMoves = this.getPossibleMoves();
        if (possibleMoves.includes(index)) {
            this.swapTiles(this.emptyIndex, index);
            this.moves++;
            this.updateBoard();

            if (this.checkWin()) {
                this.endGame();
            }
        }
    }

    /**
     * Update the board display
     */
    updateBoard() {
        const tiles = document.querySelectorAll('.puzzle-tile');
        tiles.forEach((tile, index) => {
            if (this.tiles[index] === null) {
                tile.textContent = '';
                tile.classList.add('empty');
            } else {
                tile.textContent = this.tiles[index];
                tile.classList.remove('empty');
            }
        });

        document.getElementById('moveCount').textContent = this.moves;
    }

    /**
     * Start the game timer
     */
    startTimer() {
        setInterval(() => {
            if (this.gameStarted && !this.gameOver) {
                const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
                document.getElementById('timeCount').textContent = elapsed + 's';
            }
        }, 100);
    }

    /**
     * Check if puzzle is solved
     * @returns {boolean} True if all tiles are in correct order
     */
    checkWin() {
        for (let i = 0; i < 15; i++) {
            if (this.tiles[i] !== i + 1) {
                return false;
            }
        }
        return this.tiles[15] === null;
    }

    /**
     * Calculate score based on moves and time
     * Lower moves and faster time = higher score
     * @returns {number} Final score
     */
    calculateScore() {
        const elapsed = (Date.now() - this.startTime) / 1000;
        
        // Base score: 1000 points
        let score = 1000;
        
        // Deduct points for each move (5 points per move)
        score -= this.moves * 5;
        
        // Deduct points for time (1 point per second)
        score -= elapsed;
        
        // Minimum score is 100
        return Math.max(100, Math.round(score));
    }

    /**
     * End the game
     */
    endGame() {
        this.gameOver = true;
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        this.score = this.calculateScore();

        // Show congratulations message
        const gameContent = document.getElementById('gameContent');
        const message = document.createElement('div');
        message.style.textAlign = 'center';
        message.style.padding = '2rem';
        message.style.fontSize = '1.2rem';
        message.innerHTML = `
            <h2 style="color: var(--success-color); margin-bottom: 1rem;">🎉 Puzzle Solved!</h2>
            <p>Moves: <strong>${this.moves}</strong></p>
            <p>Time: <strong>${elapsed}s</strong></p>
            <p style="font-size: 1.5rem; color: var(--primary-color); margin-top: 1rem;">
                Score: <strong>${this.score}</strong>
            </p>
        `;
        gameContent.appendChild(message);

        updateScoreDisplay(this.score);
        this.showButtons();
    }

    /**
     * Show submit and play again buttons
     */
    showButtons() {
        showSubmitScoreButton();
        showPlayAgainButton();

        document.getElementById('submitScoreBtn').onclick = () => this.submitScore();
        document.getElementById('playAgainBtn').onclick = () => this.restart();
    }

    /**
     * Hide submit and play again buttons
     */
    hideButtons() {
        hideSubmitScoreButton();
        hidePlayAgainButton();
    }

    /**
     * Submit the score to the backend
     */
    async submitScore() {
        const result = await submitScore(USERNAME, this.gameName, this.score);
        
        if (result.success) {
            displayMessage(`✓ Score submitted! ${this.score} points earned!`, 'success');
            document.getElementById('submitScoreBtn').disabled = true;
        } else {
            displayMessage(`✗ Error: ${result.message}`, 'error');
        }
    }

    /**
     * Restart the game
     */
    restart() {
        this.init();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new NumberPuzzle();
});
