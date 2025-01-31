from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

# Models go here!

class User(db.Model, SerializerMixin):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    current_weight = db.Column(db.String(10))
    target_weight = db.Column(db.String(10))
    height = db.Column(db.String(10))
    profile_picture = db.Column(db.String(200))

    weight_logs = db.relationship('WeightLog', backref='user', lazy=True, cascade='all, delete-orphan')
    user_workout_logs = db.relationship('UserWorkoutLog', backref='user', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'age': self.age,
            'gender': self.gender,
            'current_weight': self.current_weight,
            'target_weight': self.target_weight,
            'height': self.height,
            'profile_picture': self.profile_picture,
        }


class Workout(db.Model, SerializerMixin):
    __tablename__ = 'workout'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    duration = db.Column(db.Integer)
    diet_id = db.Column(db.Integer, db.ForeignKey('diet.id'), nullable=True)

    exercise_workouts = db.relationship('ExerciseWorkout', backref='workout', lazy=True, cascade='all, delete-orphan')
    user_workout_logs = db.relationship('UserWorkoutLog', backref='workout', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'duration': self.duration,
            'diet_id': self.diet_id,
        }


class Exercise(db.Model, SerializerMixin):
    __tablename__ = 'exercise'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    weight = db.Column(db.String(10))
    sets = db.Column(db.String(10))
    reps = db.Column(db.String(10))
    category = db.Column(db.String(20), nullable=False, default='Chest')
    day = db.Column(db.String(10), nullable=False, default='Monday')
    completed = db.Column(db.Boolean, nullable=False, default=False)  # Add this line

    exercise_workouts = db.relationship('ExerciseWorkout', backref='exercise', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'weight': self.weight,
            'sets': self.sets,
            'reps': self.reps,
            'category': self.category,
            'day': self.day,
            'completed': self.completed  
        }




class ExerciseWorkout(db.Model, SerializerMixin):
    __tablename__ = 'exercise_workout'

    id = db.Column(db.Integer, primary_key=True)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercise.id'), nullable=False)
    workout_id = db.Column(db.Integer, db.ForeignKey('workout.id'), nullable=False)
    notes = db.Column(db.String(200), nullable=True) 

    def to_dict(self):
        return {
            'id': self.id,
            'exercise_id': self.exercise_id,
            'workout_id': self.workout_id,
            'notes': self.notes,
        }


class UserWorkoutLog(db.Model, SerializerMixin):
    __tablename__ = 'user_workout_log'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    workout_id = db.Column(db.Integer, db.ForeignKey('workout.id'), nullable=False)
    date = db.Column(db.String(10), nullable=False)
    notes = db.Column(db.String(200), nullable=True)  

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'workout_id': self.workout_id,
            'date': self.date,
            'notes': self.notes,
        }


class Diet(db.Model, SerializerMixin):
    __tablename__ = 'diet'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)

    workouts = db.relationship('Workout', backref='diet', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
        }


class WeightLog(db.Model, SerializerMixin):
    __tablename__ = 'weight_log'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    notes = db.Column(db.String(200))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'date': self.date,
            'weight': self.weight,
            'notes': self.notes,
        }
