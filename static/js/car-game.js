/**
 * Car Game Implementation
 * A keyboard-controlled canvas game where the player drives a car to collect coins and avoid obstacles
 * 
 * Game Logic:
 * - Use arrow keys to move the car (Up, Down, Left, Right)
 * - Collect coins (yellow squares) for points
 * - Avoid obstacles (red squares)
 * - Each coin collected: +10 points
 * - Each obstacle hit: -50 points (game ends if health reaches 0)
 * - Game lasts for 60 seconds
 * - Score is based on coins collected and time survived
 */

class CarGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameName = 'Car Game';
        this.gameRunning = false;
        this.gameOver = false;
        this.score = 0;
        this.health = 3;
        this.timeLeft = 60;
        this.coins = [];
        this.obstacles = [];
        this.frameCount = 0;
        
        // Player car properties
        this.car = {
            x: 250,
            y: 450,
            width: 30,
            height: 40,
            speed: 5
        };

        // Input handling
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
            'w': false,
            'a': false,
            's': false,
            'd': false
        };

        this.init();
    }

    /**
     * Initialize the game
     */
    init() {
        this.createCanvas();
        this.setupEventListeners();
        this.startGame();
    }

    /**
     * Create and render the canvas
     */
    createCanvas() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = '';

        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = 500;
        this.canvas.height = 600;
        this.canvas.style.border = '2px solid var(--border-color)';
        this.canvas.style.borderRadius = '0.5rem';
        this.canvas.style.background = '#87CEEB'; // Sky blue
        this.canvas.style.display = 'block';
        this.canvas.style.margin = '0 auto';

        this.ctx = this.canvas.getContext('2d');
        gameContent.appendChild(this.canvas);

        // Create info display
        const info = document.createElement('div');
        info.style.textAlign = 'center';
        info.style.marginTop = '1rem';
        info.innerHTML = `
            <p style="font-size: 1rem; margin: 0.5rem 0;">
                Use Arrow Keys or WASD to move | Score: <span id="gameScore">0</span> | 
                Health: <span id="gameHealth">3</span> | Time: <span id="gameTime">60</span>s
            </p>
        `;
        gameContent.appendChild(info);

        hideSubmitScoreButton();
        hidePlayAgainButton();
    }

    /**
     * Setup keyboard event listeners
     */
    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (e.key in this.keys) {
                this.keys[e.key] = true;
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key in this.keys) {
                this.keys[e.key] = false;
            }
        });
    }

    /**
     * Start the game loop
     */
    startGame() {
        this.gameRunning = true;
        this.gameOver = false;
        this.score = 0;
        this.health = 3;
        this.timeLeft = 60;
        this.coins = [];
        this.obstacles = [];
        this.frameCount = 0;
        this.car.x = 250;
        this.car.y = 450;

        // Add initial coins and obstacles
        for (let i = 0; i < 5; i++) {
            this.spawnCoin();
        }
        for (let i = 0; i < 3; i++) {
            this.spawnObstacle();
        }

        // Start game loop
        this.gameLoop();

        // Start timer countdown
        this.timerInterval = setInterval(() => {
            if (this.gameRunning && !this.gameOver) {
                this.timeLeft--;
                document.getElementById('gameTime').textContent = this.timeLeft;

                if (this.timeLeft <= 0) {
                    this.endGame();
                }
            }
        }, 1000);
    }

    /**
     * Main game loop - called every frame
     */
    gameLoop = () => {
        if (this.gameRunning && !this.gameOver) {
            this.update();
            this.draw();
            this.frameCount++;
        }

        requestAnimationFrame(this.gameLoop);
    };

    /**
     * Update game state
     */
    update() {
        // Update player position
        if (this.keys['ArrowUp'] || this.keys['w']) {
            this.car.y = Math.max(0, this.car.y - this.car.speed);
        }
        if (this.keys['ArrowDown'] || this.keys['s']) {
            this.car.y = Math.min(this.canvas.height - this.car.height, this.car.y + this.car.speed);
        }
        if (this.keys['ArrowLeft'] || this.keys['a']) {
            this.car.x = Math.max(0, this.car.x - this.car.speed);
        }
        if (this.keys['ArrowRight'] || this.keys['d']) {
            this.car.x = Math.min(this.canvas.width - this.car.width, this.car.x + this.car.speed);
        }

        // Update obstacles
        this.obstacles.forEach((obstacle, index) => {
            obstacle.y += obstacle.speed;

            // Remove if off screen and spawn new one
            if (obstacle.y > this.canvas.height) {
                this.obstacles.splice(index, 1);
                this.spawnObstacle();
            }

            // Check collision with car
            if (this.checkCollision(this.car, obstacle)) {
                this.health--;
                document.getElementById('gameHealth').textContent = this.health;
                this.obstacles.splice(index, 1);

                if (this.health <= 0) {
                    this.endGame();
                } else {
                    this.spawnObstacle();
                }
            }
        });

        // Update coins
        this.coins.forEach((coin, index) => {
            coin.y += coin.speed;

            // Remove if off screen and spawn new one
            if (coin.y > this.canvas.height) {
                this.coins.splice(index, 1);
                this.spawnCoin();
            }

            // Check collision with car
            if (this.checkCollision(this.car, coin)) {
                this.score += 10;
                document.getElementById('gameScore').textContent = this.score;
                updateScoreDisplay(this.score);
                this.coins.splice(index, 1);
                this.spawnCoin();
            }
        });

        // Spawn more items as game progresses
        if (this.frameCount % 120 === 0) {
            if (this.coins.length < 7) {
                this.spawnCoin();
            }
        }

        if (this.frameCount % 180 === 0) {
            if (this.obstacles.length < 5) {
                this.spawnObstacle();
            }
        }
    }

    /**
     * Draw the game on canvas
     */
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw road (darker stripe in center)
        this.ctx.fillStyle = '#444';
        this.ctx.fillRect(50, 0, this.canvas.width - 100, this.canvas.height);

        // Draw road markings
        this.ctx.strokeStyle = '#FFD700';
        this.ctx.setLineDash([20, 20]);
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Draw player car
        this.drawCar();

        // Draw coins (yellow)
        this.ctx.fillStyle = '#FFD700';
        this.coins.forEach(coin => {
            this.ctx.fillRect(coin.x, coin.y, coin.width, coin.height);
            // Add shine effect
            this.ctx.fillStyle = '#FFF';
            this.ctx.fillRect(coin.x + 5, coin.y + 5, 5, 5);
            this.ctx.fillStyle = '#FFD700';
        });

        // Draw obstacles (red)
        this.ctx.fillStyle = '#FF6B6B';
        this.obstacles.forEach(obstacle => {
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    /**
     * Draw the car (red square with details)
     */
    drawCar() {
        // Car body
        this.ctx.fillStyle = '#FF4444';
        this.ctx.fillRect(this.car.x, this.car.y, this.car.width, this.car.height);

        // Car windows (lighter red)
        this.ctx.fillStyle = '#FFB3B3';
        this.ctx.fillRect(this.car.x + 5, this.car.y + 5, 20, 8);
        this.ctx.fillRect(this.car.x + 5, this.car.y + 20, 20, 8);

        // Car headlights (white)
        this.ctx.fillStyle = '#FFF';
        this.ctx.fillRect(this.car.x + 8, this.car.y, 6, 3);
        this.ctx.fillRect(this.car.x + 16, this.car.y, 6, 3);
    }

    /**
     * Check collision between two objects
     * @param {Object} rect1 - First rectangle (car or item)
     * @param {Object} rect2 - Second rectangle (item)
     * @returns {boolean} True if collision detected
     */
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    /**
     * Spawn a coin at random position
     */
    spawnCoin() {
        const coin = {
            x: Math.random() * (this.canvas.width - 20) + 10,
            y: -20,
            width: 15,
            height: 15,
            speed: 2 + Math.random()
        };
        this.coins.push(coin);
    }

    /**
     * Spawn an obstacle (enemy car) at random position
     */
    spawnObstacle() {
        const obstacle = {
            x: Math.random() * (this.canvas.width - 30) + 15,
            y: -30,
            width: 30,
            height: 40,
            speed: 3 + Math.random() * 2
        };
        this.obstacles.push(obstacle);
    }

    /**
     * End the game
     */
    endGame() {
        this.gameRunning = false;
        this.gameOver = true;
        clearInterval(this.timerInterval);

        // Calculate final score (time bonus)
        const timeBonus = this.timeLeft * 2;
        this.score += timeBonus;
        updateScoreDisplay(this.score);

        // Show game over message
        const gameContent = document.getElementById('gameContent');
        const message = document.createElement('div');
        message.style.position = 'absolute';
        message.style.top = '50%';
        message.style.left = '50%';
        message.style.transform = 'translate(-50%, -50%)';
        message.style.background = 'rgba(0, 0, 0, 0.9)';
        message.style.color = 'white';
        message.style.padding = '2rem';
        message.style.borderRadius = '1rem';
        message.style.textAlign = 'center';
        message.style.zIndex = '100';
        message.style.fontSize = '1.2rem';

        if (this.health <= 0) {
            message.innerHTML = `
                <h2 style="margin-bottom: 1rem;">💥 Game Over!</h2>
                <p>Final Score: <strong>${this.score}</strong></p>
            `;
        } else {
            message.innerHTML = `
                <h2 style="margin-bottom: 1rem; color: #FFD700;">⏱️ Time's Up!</h2>
                <p>Final Score: <strong>${this.score}</strong></p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Time Bonus: +${timeBonus}</p>
            `;
        }

        gameContent.appendChild(message);

        showSubmitScoreButton();
        showPlayAgainButton();

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
        // Remove existing listeners
        window.removeEventListener('keydown', null);
        window.removeEventListener('keyup', null);
        
        this.init();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new CarGame();
});
