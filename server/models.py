from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin

from config import db

# models.py

# User Table
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'  # Label: Users Table

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    height = db.Column(db.Float, nullable=False)
    password = db.Column(db.String(128), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'age': self.age,
            'weight': self.weight,
            'gender': self.gender,
            'height': self.height,
            'password': self.password
        }
    
# Workout Table
class Workout(db.Model, SerializerMixin):
    __tablename__ = 'workouts'  # Label: Workouts Table

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    category = db.Column(db.String(80), nullable=False)
    sets = db.Column(db.Integer, nullable=False)
    reps = db.Column(db.Integer, nullable=False)

    def __repr__(self):
        return f'<Workout {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'category': self.category,
            'sets': self.sets,
            'reps': self.reps
        }
    
# Diet Table
class Diet(db.Model, SerializerMixin):
    __tablename__ = 'diets'  # Label: Diets Table

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return f'<Diet {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category
        }
    
# UserWorkoutAssignment Table
class UserWorkoutAssignment(db.Model, SerializerMixin):
    __tablename__ = 'user_workout_assignments'  # Label: User-Workout Assignments Table

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    workout_id = db.Column(db.Integer, db.ForeignKey('workouts.id'), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    date_assigned = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('workout_assignments', cascade='all, delete-orphan'))
    workout = db.relationship('Workout', backref=db.backref('user_assignments', cascade='all, delete-orphan'))

    def __repr__(self):
        return f'<UserWorkoutAssignment {self.user_id} - {self.workout_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'workout_id': self.workout_id,
            'completed': self.completed,
            'date_assigned': self.date_assigned.isoformat()  # Convert datetime to string
        }
    
# UserDietAssignment Table
class UserDietAssignment(db.Model, SerializerMixin):
    __tablename__ = 'user_diet_assignments'  # Label: User-Diet Assignments Table

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    diet_id = db.Column(db.Integer, db.ForeignKey('diets.id'), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    date_assigned = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('diet_assignments', cascade='all, delete-orphan'))
    diet = db.relationship('Diet', backref=db.backref('user_assignments', cascade='all, delete-orphan'))

    def __repr__(self):
        return f'<UserDietAssignment {self.user_id} - {self.diet_id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'diet_id': self.diet_id,
            'completed': self.completed,
            'date_assigned': self.date_assigned.isoformat()  # Convert datetime to string
        }
