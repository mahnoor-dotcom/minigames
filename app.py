"""
Multi-Game Platform - Flask Backend Application
Main application file with API endpoints for login, score submission, and leaderboard
"""

from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from models import db, User, Score
from functools import wraps
import os
from datetime import datetime

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///minigames.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['SESSION_TYPE'] = 'filesystem'

# Initialize database with app
db.init_app(app)


# Create application context for database operations
with app.app_context():
    db.create_all()


# ==================== Helper Functions ====================

def login_required(f):
    """
    Decorator to check if user is logged in
    Redirects to login page if not authenticated
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'username' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function


def get_or_create_user(username):
    """
    Get existing user or create a new one
    
    Args:
        username: Username string
    
    Returns:
        User object
    """
    user = User.query.filter_by(username=username).first()
    if not user:
        user = User(username=username)
        db.session.add(user)
        db.session.commit()
    return user


# ==================== Routes ====================

@app.route('/')
def index():
    """
    Dashboard/Homepage route
    Displays the main page with game selection if user is logged in
    Otherwise redirects to login
    """
    if 'username' not in session:
        return redirect(url_for('login'))
    return render_template('dashboard.html', username=session['username'])


@app.route('/login', methods=['GET', 'POST'])
def login():
    """
    Login route - handles user authentication
    GET: Displays login form
    POST: Processes login with username
    """
    if request.method == 'POST':
        # Get username from form
        username = request.form.get('username', '').strip()
        
        if not username:
            return render_template('login.html', error='Username cannot be empty')
        
        # Validate username (alphanumeric and underscore only)
        if not username.replace('_', '').isalnum():
            return render_template('login.html', error='Username must be alphanumeric')
        
        # Create or get user
        user = get_or_create_user(username)
        
        # Store username in session
        session['username'] = username
        
        return redirect(url_for('index'))
    
    return render_template('login.html')


@app.route('/logout')
def logout():
    """Logout route - clears session and redirects to login"""
    session.clear()
    return redirect(url_for('login'))


@app.route('/games/<game_name>')
@login_required
def game(game_name):
    """
    Game page route - displays individual game
    
    Args:
        game_name: Name of the game to display (tic_tac_toe, number_puzzle, car_game)
    """
    # Valid games
    valid_games = ['tic_tac_toe', 'number_puzzle', 'car_game']
    
    if game_name not in valid_games:
        return redirect(url_for('index'))
    
    return render_template('game.html', 
                         game_name=game_name,
                         username=session['username'])


@app.route('/leaderboard')
@login_required
def leaderboard():
    """
    Leaderboard page route - displays top scores for each game
    Shows leaderboard with top 10 scores per game
    """
    # Get all games with their top scores
    games = ['Tic Tac Toe', 'Number Puzzle', 'Car Game']
    leaderboard_data = {}
    
    for game in games:
        # Query top 10 scores for each game, ordered by score (descending)
        top_scores = Score.query.filter_by(game_name=game)\
            .order_by(Score.score.desc())\
            .limit(10)\
            .all()
        
        leaderboard_data[game] = [score.to_dict() for score in top_scores]
    
    return render_template('leaderboard.html', 
                         leaderboard_data=leaderboard_data,
                         username=session['username'])


# ==================== API Endpoints ====================

@app.route('/api/login', methods=['POST'])
def api_login():
    """
    API endpoint for login
    Accepts JSON with username
    Returns user info and session confirmation
    """
    data = request.get_json()
    username = data.get('username', '').strip() if data else ''
    
    if not username:
        return jsonify({'success': False, 'message': 'Username required'}), 400
    
    # Validate username
    if not username.replace('_', '').isalnum():
        return jsonify({'success': False, 'message': 'Invalid username'}), 400
    
    # Create or get user
    user = get_or_create_user(username)
    session['username'] = username
    
    return jsonify({'success': True, 'username': username, 'message': 'Logged in'}), 200


@app.route('/api/submit-score', methods=['POST'])
def submit_score():
    """
    API endpoint to submit game scores
    
    Expected JSON:
    {
        'username': 'player_name',
        'game_name': 'Tic Tac Toe',
        'score': 10
    }
    
    Returns:
        JSON with success status and saved score info
    """
    data = request.get_json()
    
    if not data:
        return jsonify({'success': False, 'message': 'No data provided'}), 400
    
    # Extract data
    username = data.get('username', '').strip()
    game_name = data.get('game_name', '').strip()
    score = data.get('score')
    
    # Validation
    if not username or not game_name or score is None:
        return jsonify({'success': False, 'message': 'Missing required fields'}), 400
    
    # Validate score is a number
    try:
        score = int(score)
    except (ValueError, TypeError):
        return jsonify({'success': False, 'message': 'Score must be a number'}), 400
    
    if score < 0:
        return jsonify({'success': False, 'message': 'Score cannot be negative'}), 400
    
    # Get or create user
    user = get_or_create_user(username)
    
    # Create new score record
    new_score = Score(
        user_id=user.id,
        username=username,
        game_name=game_name,
        score=score,
        timestamp=datetime.utcnow()
    )
    
    try:
        db.session.add(new_score)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Score submitted successfully',
            'score_id': new_score.id,
            'score_data': new_score.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': f'Error saving score: {str(e)}'}), 500


@app.route('/api/leaderboard', methods=['GET'])
def api_leaderboard():
    """
    API endpoint to get leaderboard data
    
    Query Parameters:
        game_name: Optional filter by game name
        limit: Number of results (default 10)
    
    Returns:
        JSON with leaderboard data
    """
    game_name = request.args.get('game_name')
    limit = request.args.get('limit', default=10, type=int)
    
    # Limit the number of results to prevent abuse
    limit = min(limit, 100)
    
    try:
        if game_name:
            # Get scores for specific game
            scores = Score.query.filter_by(game_name=game_name)\
                .order_by(Score.score.desc())\
                .limit(limit)\
                .all()
        else:
            # Get all top scores
            scores = Score.query\
                .order_by(Score.score.desc())\
                .limit(limit)\
                .all()
        
        return jsonify({
            'success': True,
            'leaderboard': [score.to_dict() for score in scores]
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error fetching leaderboard: {str(e)}'}), 500


@app.route('/api/games/<game_name>/scores', methods=['GET'])
def get_game_scores(game_name):
    """
    API endpoint to get all scores for a specific game
    
    Args:
        game_name: Name of the game
    
    Returns:
        JSON with game scores and player statistics
    """
    try:
        # Get all scores for this game sorted by score descending
        scores = Score.query.filter_by(game_name=game_name)\
            .order_by(Score.score.desc())\
            .all()
        
        return jsonify({
            'success': True,
            'game_name': game_name,
            'total_scores': len(scores),
            'scores': [score.to_dict() for score in scores]
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error fetching scores: {str(e)}'}), 500


@app.route('/api/games/<game_name>/user/<username>/scores', methods=['GET'])
def get_user_game_scores(game_name, username):
    """
    API endpoint to get user's scores for a specific game
    
    Args:
        game_name: Name of the game
        username: Username to filter scores
    
    Returns:
        JSON with user's scores for that game
    """
    try:
        scores = Score.query.filter_by(game_name=game_name, username=username)\
            .order_by(Score.timestamp.desc())\
            .all()
        
        return jsonify({
            'success': True,
            'game_name': game_name,
            'username': username,
            'scores': [score.to_dict() for score in scores]
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error fetching user scores: {str(e)}'}), 500


# ==================== Error Handlers ====================

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'success': False, 'message': 'Page not found'}), 404


@app.errorhandler(500)
def server_error(error):
    """Handle 500 errors"""
    return jsonify({'success': False, 'message': 'Internal server error'}), 500


# ==================== Main ====================

if __name__ == '__main__':
    # Run the Flask development server
    app.run(debug=True, host='0.0.0.0', port=5000)
