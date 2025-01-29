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
    training_logs = db.relationship('TrainingLog', backref='user', lazy=True, cascade='all, delete-orphan')

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
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  
    name = db.Column(db.String(80), nullable=False)
    duration = db.Column(db.Integer)
    diet_id = db.Column(db.Integer, db.ForeignKey('diet.id'), nullable=True)

    exercises = db.relationship('Exercise', backref='workout', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,  
            'name': self.name,
            'duration': self.duration,
            'diet_id': self.diet_id,
        }


class Exercise(db.Model, SerializerMixin):
    __tablename__ = 'exercise'

    id = db.Column(db.Integer, primary_key=True)
    workout_id = db.Column(db.Integer, db.ForeignKey('workout.id'), nullable=False)  
    name = db.Column(db.String(80), nullable=False)
    weight = db.Column(db.String(10))
    sets = db.Column(db.String(10))
    reps = db.Column(db.String(10))

    training_logs = db.relationship('TrainingLog', backref='exercise', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'workout_id': self.workout_id,  
            'name': self.name,
            'weight': self.weight,
            'sets': self.sets,
            'reps': self.reps,
        }


    
    
class TrainingLog(db.Model, SerializerMixin):
    __tablename__ = 'training_log'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    exercise_id = db.Column(db.Integer, db.ForeignKey('exercise.id'), nullable=False)
    workout_id = db.Column(db.Integer, db.ForeignKey('workout.id'), nullable=False)
    date = db.Column(db.String(10), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'exercise_id': self.exercise_id,
            'workout_id': self.workout_id,
            'date': self.date,
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

