from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin

from config import db

# Association tables
user_workouts = db.Table('user_workouts',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('workout_id', db.Integer, db.ForeignKey('workout.id'), primary_key=True)
)

user_exercises = db.Table('user_exercises',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('exercise_id', db.Integer, db.ForeignKey('exercise.id'), primary_key=True)
)

user_diets = db.Table('user_diets',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('diet_id', db.Integer, db.ForeignKey('diet.id'), primary_key=True)
)

class User(db.Model, SerializerMixin):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False, unique=True)
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    weight = db.Column(db.String(10))
    height = db.Column(db.String(10))
    profile_picture = db.Column(db.String(200))

    weight_logs = db.relationship('WeightLog', backref='user', lazy=True, cascade='all, delete-orphan')
    user_workout_logs = db.relationship('UserWorkoutLog', backref='user', lazy=True, cascade='all, delete-orphan')
    workouts = db.relationship('Workout', secondary=user_workouts, backref=db.backref('users', lazy=True))
    exercises = db.relationship('Exercise', secondary=user_exercises, backref=db.backref('users', lazy=True))
    diets = db.relationship('Diet', secondary=user_diets, backref=db.backref('users', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'age': self.age,
            'gender': self.gender,
            'weight': self.weight,
            'height': self.height,
            'profile_picture': self.profile_picture,
        }

class Diet(db.Model, SerializerMixin):
    __tablename__ = 'diet'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.Text, nullable=True)
    completed = db.Column(db.Boolean, default=False)
    notes = db.Column(db.Text, nullable=True)

    workouts = db.relationship('Workout', backref='diet', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'completed': self.completed,
            'notes': self.notes,
        }
class Workout(db.Model, SerializerMixin):
    __tablename__ = 'workout'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    duration = db.Column(db.Integer)
    category = db.Column(db.String(80), nullable=False, default='Chest')
    completed = db.Column(db.Boolean, default=False)
    diet_id = db.Column(db.Integer, db.ForeignKey('diet.id'), nullable=True)

    exercise_workouts = db.relationship('ExerciseWorkout', backref='workout', lazy=True, cascade='all, delete-orphan')
    user_workout_logs = db.relationship('UserWorkoutLog', backref='workout', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'duration': self.duration,
            'category': self.category,
            'completed': self.completed,
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
    completed = db.Column(db.Boolean, nullable=False, default=False)

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
