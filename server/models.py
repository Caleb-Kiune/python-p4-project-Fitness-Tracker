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

    workouts = db.relationship('Workout', backref='user', lazy=True)
    user_exercises = db.relationship('UserExercise', backref='user', lazy=True)

class Workout(db.Model, SerializerMixin):
    __tablename__ = 'workout'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(80), nullable=False)
    date = db.Column(db.Date)
    duration = db.Column(db.Integer)

    exercises = db.relationship('Exercise', backref='workout', lazy=True)

class Exercise(db.Model, SerializerMixin):
    __tablename__ = 'exercise'

    id = db.Column(db.Integer, primary_key=True)
    workout_id = db.Column(db.Integer, db.ForeignKey('workout.id'), nullable=False)
    name = db.Column(db.String(80), nullable=False)
    weight = db.Column(db.String(10))
    sets = db.Column(db.String(10))
    reps = db.Column(db.String(10))

    user_exercises = db.relationship('UserExercise', backref='exercise', lazy=True)

class UserExercise(db.Model, SerializerMixin):
    __tablename__ = 'user_exercise'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercise.id'), nullable=False)
    notes = db.Column(db.String(200))
