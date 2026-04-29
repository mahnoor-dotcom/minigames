/**
 * API Integration Module
 * Handles all communication with the Flask backend
 * Provides functions for submitting scores, logging in, and fetching leaderboard data
 */

// API Base URL
const API_BASE_URL = '/api';

/**
 * Submit a score to the backend
 * @param {string} username - Player username
 * @param {string} gameName - Name of the game
 * @param {number} score - Score to submit
 * @returns {Promise} Response from the server
 */
async function submitScore(username, gameName, score) {
    try {
        const response = await fetch(`${API_BASE_URL}/submit-score`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                game_name: gameName,
                score: parseInt(score)
            })
        });

        return await response.json();
    } catch (error) {
        console.error('Error submitting score:', error);
        return { success: false, message: 'Failed to submit score' };
    }
}

/**
 * Fetch leaderboard data for a specific game
 * @param {string} gameName - Name of the game
 * @param {number} limit - Number of scores to fetch
 * @returns {Promise} Leaderboard data
 */
async function fetchLeaderboard(gameName, limit = 10) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/leaderboard?game_name=${encodeURIComponent(gameName)}&limit=${limit}`
        );
        return await response.json();
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return { success: false, message: 'Failed to fetch leaderboard' };
    }
}

/**
 * Fetch all scores for a specific game
 * @param {string} gameName - Name of the game
 * @returns {Promise} All scores for the game
 */
async function fetchGameScores(gameName) {
    try {
        const response = await fetch(
            `/api/games/${encodeURIComponent(gameName)}/scores`
        );
        return await response.json();
    } catch (error) {
        console.error('Error fetching game scores:', error);
        return { success: false, message: 'Failed to fetch scores' };
    }
}

/**
 * Fetch user's scores for a specific game
 * @param {string} gameName - Name of the game
 * @param {string} username - Username
 * @returns {Promise} User's scores for the game
 */
async function fetchUserGameScores(gameName, username) {
    try {
        const response = await fetch(
            `/api/games/${encodeURIComponent(gameName)}/user/${encodeURIComponent(username)}/scores`
        );
        return await response.json();
    } catch (error) {
        console.error('Error fetching user game scores:', error);
        return { success: false, message: 'Failed to fetch scores' };
    }
}

/**
 * Display a score message in the DOM
 * @param {string} message - Message text
 * @param {string} type - Message type (success or error)
 */
function displayMessage(message, type = 'success') {
    const messageElement = document.getElementById('scoreMessage');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `message ${type}`;
        messageElement.style.display = 'block';

        // Auto-hide message after 5 seconds
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
}

/**
 * Hide the score message
 */
function hideMessage() {
    const messageElement = document.getElementById('scoreMessage');
    if (messageElement) {
        messageElement.style.display = 'none';
    }
}

/**
 * Update the current score display
 * @param {number} score - Current score
 */
function updateScoreDisplay(score) {
    const scoreElement = document.getElementById('currentScore');
    if (scoreElement) {
        scoreElement.textContent = score;
    }
}

/**
 * Show the submit score button
 */
function showSubmitScoreButton() {
    const btn = document.getElementById('submitScoreBtn');
    if (btn) {
        btn.style.display = 'inline-block';
    }
}

/**
 * Hide the submit score button
 */
function hideSubmitScoreButton() {
    const btn = document.getElementById('submitScoreBtn');
    if (btn) {
        btn.style.display = 'none';
    }
}

/**
 * Show the play again button
 */
function showPlayAgainButton() {
    const btn = document.getElementById('playAgainBtn');
    if (btn) {
        btn.style.display = 'inline-block';
    }
}

/**
 * Hide the play again button
 */
function hidePlayAgainButton() {
    const btn = document.getElementById('playAgainBtn');
    if (btn) {
        btn.style.display = 'none';
    }
}
