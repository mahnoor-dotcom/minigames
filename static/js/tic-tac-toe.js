/**
 * Tic Tac Toe Game Implementation
 * Classic Tic Tac Toe game where the player plays against the AI (computer)
 * 
 * Game Logic:
 * - Player is X, Computer is O
 * - Player moves first
 * - AI uses minimax algorithm for optimal play
 * - Win: 10 points, Draw: 5 points, Loss: 0 points
 */

class TicTacToe {
    constructor() {
        this.board = Array(9).fill(null); // Game board (3x3 grid)
        this.currentPlayer = 'X'; // X is human, O is AI
        this.gameOver = false;
        this.score = 0;
        this.gameName = 'Tic Tac Toe';
        this.init();
    }

    /**
     * Initialize the game UI
     */
    init() {
        this.createBoard();
        this.addEventListeners();
    }

    /**
     * Create the game board HTML
     */
    createBoard() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = '';

        // Create board container
        const boardContainer = document.createElement('div');
        boardContainer.className = 'tictactoe-board';

        // Create 9 cells
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('button');
            cell.className = 'tictactoe-cell';
            cell.dataset.index = i;
            cell.textContent = this.board[i] || '';
            boardContainer.appendChild(cell);
        }

        gameContent.appendChild(boardContainer);

        // Create status display
        const status = document.createElement('div');
        status.className = 'tictactoe-status';
        status.id = 'gameStatus';
        status.textContent = 'Your turn (X)';
        gameContent.appendChild(status);

        hideSubmitScoreButton();
        hidePlayAgainButton();
    }

    /**
     * Add event listeners to board cells
     */
    addEventListeners() {
        const cells = document.querySelectorAll('.tictactoe-cell');
        cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });
    }

    /**
     * Handle player's move when a cell is clicked
     * @param {HTMLElement} cell - The clicked cell
     */
    handleCellClick(cell) {
        const index = parseInt(cell.dataset.index);

        // Check if cell is empty and game is not over
        if (this.board[index] !== null || this.gameOver) {
            return;
        }

        // Make player's move
        this.board[index] = 'X';
        this.updateBoard();

        // Check for win/draw
        if (this.checkGameEnd()) {
            return;
        }

        // AI's turn
        this.currentPlayer = 'O';
        setTimeout(() => this.makeAIMove(), 500);
    }

    /**
     * AI makes its move using minimax algorithm
     * The minimax algorithm evaluates all possible moves and chooses the best one
     */
    makeAIMove() {
        let bestScore = -Infinity;
        let bestMove = -1;

        // Try each empty cell
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === null) {
                this.board[i] = 'O';
                const score = this.minimax(0, false);
                this.board[i] = null;

                // Choose move with highest score
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        if (bestMove !== -1) {
            this.board[bestMove] = 'O';
        }

        this.currentPlayer = 'X';
        this.updateBoard();
        this.checkGameEnd();
    }

    /**
     * Minimax algorithm for AI decision making
     * Recursively evaluates all possible game states
     * @param {number} depth - Current depth in the game tree
     * @param {boolean} isMaximizing - Whether maximizing or minimizing
     * @returns {number} Score of the position
     */
    minimax(depth, isMaximizing) {
        const score = this.checkWinner();

        // Terminal states: AI won (10-depth), draw (0), human won (-10+depth)
        if (score === 1) return 10 - depth; // AI won
        if (score === -1) return -10 + depth; // Human won
        if (!this.hasEmptyCell()) return 0; // Draw

        if (isMaximizing) {
            // Maximizing player (AI)
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (this.board[i] === null) {
                    this.board[i] = 'O';
                    bestScore = Math.max(bestScore, this.minimax(depth + 1, false));
                    this.board[i] = null;
                }
            }
            return bestScore;
        } else {
            // Minimizing player (Human)
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (this.board[i] === null) {
                    this.board[i] = 'X';
                    bestScore = Math.min(bestScore, this.minimax(depth + 1, true));
                    this.board[i] = null;
                }
            }
            return bestScore;
        }
    }

    /**
     * Check if there are empty cells on the board
     * @returns {boolean} True if empty cells exist
     */
    hasEmptyCell() {
        return this.board.some(cell => cell === null);
    }

    /**
     * Update the board display
     */
    updateBoard() {
        const cells = document.querySelectorAll('.tictactoe-cell');
        cells.forEach((cell, index) => {
            cell.textContent = this.board[index] || '';
            cell.disabled = this.gameOver || this.currentPlayer !== 'X';
        });
    }

    /**
     * Check game status: 1 for AI win, -1 for human win, 0 for ongoing
     * @returns {number} Game result
     */
    checkWinner() {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let line of lines) {
            const [a, b, c] = line;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[b] === this.board[c]) {
                return this.board[a] === 'O' ? 1 : -1;
            }
        }

        return 0;
    }

    /**
     * Check if the game has ended
     * @returns {boolean} True if game ended
     */
    checkGameEnd() {
        const winner = this.checkWinner();
        const status = document.getElementById('gameStatus');

        if (winner === 1) {
            this.gameOver = true;
            this.score = 0; // Loss: 0 points
            status.textContent = '😢 You Lost! (AI is unbeatable)';
            this.endGame();
            return true;
        } else if (winner === -1) {
            this.gameOver = true;
            this.score = 10; // Win: 10 points
            status.textContent = '🎉 You Won! Amazing!';
            this.endGame();
            return true;
        } else if (!this.hasEmptyCell()) {
            this.gameOver = true;
            this.score = 5; // Draw: 5 points
            status.textContent = '🤝 It\'s a Draw!';
            this.endGame();
            return true;
        }

        status.textContent = this.currentPlayer === 'X' ? 'Your turn (X)' : 'AI is thinking...';
        return false;
    }

    /**
     * End the game and show final options
     */
    endGame() {
        updateScoreDisplay(this.score);
        showSubmitScoreButton();
        showPlayAgainButton();

        // Add event listeners to buttons
        document.getElementById('submitScoreBtn').onclick = () => this.submitScore();
        document.getElementById('playAgainBtn').onclick = () => this.restart();
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
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameOver = false;
        this.score = 0;
        this.init();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new TicTacToe();
});
