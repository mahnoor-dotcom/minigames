"""
Database models for the Multi-Game Platform
Defines User and Score models using SQLAlchemy ORM
"""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Initialize SQLAlchemy database
db = SQLAlchemy()


class User(db.Model):
    """
    User model to store user information
    
    Attributes:
        id: Primary key
        username: Unique username for the user
        created_at: Timestamp when user was created
    """
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship to scores
    scores = db.relationship('Score', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<User {self.username}>'


class Score(db.Model):
    """
    Score model to track game scores for each user
    
    Attributes:
        id: Primary key
        user_id: Foreign key to User
        username: Username (denormalized for ease of querying)
        game_name: Name of the game (Tic Tac Toe, Number Puzzle, Car Game)
        score: The score achieved
        timestamp: When the score was recorded
    """
    __tablename__ = 'scores'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    username = db.Column(db.String(80), nullable=False, index=True)
    game_name = db.Column(db.String(80), nullable=False, index=True)
    score = db.Column(db.Integer, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    def __repr__(self):
        return f'<Score {self.username} - {self.game_name}: {self.score}>'
    
    def to_dict(self):
        """Convert score object to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'username': self.username,
            'game_name': self.game_name,
            'score': self.score,
            'timestamp': self.timestamp.strftime('%Y-%m-%d %H:%M:%S')
        }
