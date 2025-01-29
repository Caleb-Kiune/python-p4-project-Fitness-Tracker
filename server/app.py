#!/usr/bin/env python3

# Standard library imports
from datetime import datetime
from flask import Flask
from flask_migrate import Migrate


# Remote library imports
from flask import request,make_response
from flask_restful import Resource

# Local imports
from config import app, db, api
from models import User, Workout, Exercise, TrainingLog, Diet, WeightLog 

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Views go here!

@app.route('/')
def index():
    return '<h1>Welcome to Fitness Tracker</h1>'



# User model endpoints

class UserResource(Resource):
    def get(self):
        users = User.query.all()
        user_list = [user.to_dict() for user in users]
        return make_response({"users": user_list}, 200)

    def post(self):
        data = request.get_json()
        new_user = User(
            username=data['username'],
            age=data.get('age'),
            gender=data.get('gender'),
            current_weight=data.get('current_weight'),
            target_weight=data.get('target_weight'),
            height=data.get('height'),
            profile_picture=data.get('profile_picture')
        )
        db.session.add(new_user)
        db.session.commit()

        return make_response(new_user.to_dict(), 201)

class SingleUserResource(Resource):
    def get(self, user_id):
        user = User.query.get_or_404(user_id)
        return make_response(user.to_dict(), 200)

    def put(self, user_id):
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        
        user.username = data.get('username', user.username)
        user.age = data.get('age', user.age)
        user.gender = data.get('gender', user.gender)
        user.current_weight = data.get('current_weight', user.current_weight)
        user.target_weight = data.get('target_weight', user.target_weight)
        user.height = data.get('height', user.height)
        user.profile_picture = data.get('profile_picture', user.profile_picture)
        
        db.session.commit()

        return make_response(user.to_dict(), 200)

    def delete(self, user_id):
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return make_response({"message": "User deleted successfully"}, 200)

api.add_resource(UserResource, '/user')
api.add_resource(SingleUserResource, '/user/<int:user_id>')


# Workout model endpoints

class WorkoutResource(Resource):
    def get(self):
        workouts = Workout.query.all()
        workout_list = [workout.to_dict() for workout in workouts]
        return make_response({"workouts": workout_list}, 200)

    def post(self):
        data = request.get_json()
        if not data.get('user_id') or not data.get('name'):
            return make_response({"error": "Missing required fields"}, 400)
        
        new_workout = Workout(
            user_id=data['user_id'],
            name=data['name'],
            duration=data.get('duration')
        )
        db.session.add(new_workout)
        db.session.commit()

        return make_response(new_workout.to_dict(), 201)

class SingleWorkoutResource(Resource):
    def get(self, workout_id):
        workout = Workout.query.get_or_404(workout_id)
        return make_response(workout.to_dict(), 200)

    def put(self, workout_id):
        workout = Workout.query.get_or_404(workout_id)
        data = request.get_json()
        
        workout.name = data.get('name', workout.name)
        workout.duration = data.get('duration', workout.duration)
        
        db.session.commit()

        return make_response(workout.to_dict(), 200)

    def delete(self, workout_id):
        workout = Workout.query.get_or_404(workout_id)
        db.session.delete(workout)
        db.session.commit()
        return make_response({"message": "Workout deleted successfully"}, 200)

api.add_resource(WorkoutResource, '/workout')
api.add_resource(SingleWorkoutResource, '/workout/<int:workout_id>')


# exercise endpoints

class ExerciseResource(Resource):
    def get(self):
        exercises = Exercise.query.all()
        exercise_list = [exercise.to_dict() for exercise in exercises]
        return make_response({"exercises": exercise_list}, 200)

    def post(self):
        data = request.get_json()
        new_exercise = Exercise(
            workout_id=data['workout_id'],
            name=data['name'],
            weight=data.get('weight'),
            sets=data.get('sets'),
            reps=data.get('reps')
        )
        db.session.add(new_exercise)
        db.session.commit()
        return make_response(new_exercise.to_dict(), 201)

class SingleExerciseResource(Resource):
    def get(self, exercise_id):
        exercise = Exercise.query.get_or_404(exercise_id)
        return make_response(exercise.to_dict(), 200)

    def put(self, exercise_id):
        exercise = Exercise.query.get_or_404(exercise_id)
        data = request.get_json()
        
        exercise.name = data.get('name', exercise.name)
        exercise.weight = data.get('weight', exercise.weight)
        exercise.sets = data.get('sets', exercise.sets)
        exercise.reps = data.get('reps', exercise.reps)
        
        db.session.commit()
        return make_response(exercise.to_dict(), 200)

    def delete(self, exercise_id):
        exercise = Exercise.query.get_or_404(exercise_id)
        db.session.delete(exercise)
        db.session.commit()
        return make_response({"message": "Exercise deleted successfully"}, 200)

api.add_resource(ExerciseResource, '/exercise')
api.add_resource(SingleExerciseResource, '/exercise/<int:exercise_id>')



# TrainingLog model endpoints
class TrainingLogResource(Resource):
    def get(self):
        training_logs = TrainingLog.query.all()
        training_log_list = [training_log.to_dict() for training_log in training_logs]
        return make_response({"training_logs": training_log_list}, 200)

    def post(self):
        data = request.get_json()
        new_training_log = TrainingLog(
            user_id=data['user_id'],
            exercise_id=data['exercise_id'],
            workout_id=data['workout_id'],
            date=data['date']
        )
        db.session.add(new_training_log)
        db.session.commit()
        return make_response(new_training_log.to_dict(), 201)

class SingleTrainingLogResource(Resource):
    def get(self, training_log_id):
        training_log = TrainingLog.query.get_or_404(training_log_id)
        return make_response(training_log.to_dict(), 200)

    def put(self, training_log_id):
        training_log = TrainingLog.query.get_or_404(training_log_id)
        data = request.get_json()
        
        training_log.user_id = data.get('user_id', training_log.user_id)
        training_log.exercise_id = data.get('exercise_id', training_log.exercise_id)
        training_log.workout_id = data.get('workout_id', training_log.workout_id)
        training_log.date = data.get('date', training_log.date)
        
        db.session.commit()
        return make_response(training_log.to_dict(), 200)

    def delete(self, training_log_id):
        training_log = TrainingLog.query.get_or_404(training_log_id)
        db.session.delete(training_log)
        db.session.commit()
        return make_response({"message": "Training log deleted successfully"}, 200)

api.add_resource(TrainingLogResource, '/training_log')
api.add_resource(SingleTrainingLogResource, '/training_log/<int:training_log_id>')

# Diet model endpoints
class DietResource(Resource):
    def get(self):
        diets = Diet.query.all()
        diet_list = [diet.to_dict() for diet in diets]
        return make_response({"diets": diet_list}, 200)

    def post(self):
        data = request.get_json()
        new_diet = Diet(
            name=data['name']
        )
        db.session.add(new_diet)
        db.session.commit()
        return make_response(new_diet.to_dict(), 201)

class SingleDietResource(Resource):
    def get(self, diet_id):
        diet = Diet.query.get_or_404(diet_id)
        return make_response(diet.to_dict(), 200)

    def put(self, diet_id):
        diet = Diet.query.get_or_404(diet_id)
        data = request.get_json()
        
        diet.name = data.get('name', diet.name)
        
        db.session.commit()
        return make_response(diet.to_dict(), 200)

    def delete(self, diet_id):
        diet = Diet.query.get_or_404(diet_id)
        db.session.delete(diet)
        db.session.commit()
        return make_response({"message": "Diet deleted successfully"}, 200)

api.add_resource(DietResource, '/diet')
api.add_resource(SingleDietResource, '/diet/<int:diet_id>')



# WeightLog model endpoints
class WeightLogResource(Resource):
    def get(self):
        weight_logs = WeightLog.query.all()
        weight_log_list = [weight_log.to_dict() for weight_log in weight_logs]
        return make_response({"weight_logs": weight_log_list}, 200)

    def post(self):
        data = request.get_json()
        user = User.query.get(data['user_id'])
        if not user:
            return make_response({"error": "Invalid user_id"}, 400)
        
        date = datetime.strptime(data['date'], '%Y-%m-%d').date() 
        new_weight_log = WeightLog(
            user_id=data['user_id'],
            date=date,
            weight=data['weight'],
            notes=data.get('notes')
        )
        db.session.add(new_weight_log)
        db.session.commit()
        return make_response(new_weight_log.to_dict(), 201)

class SingleWeightLogResource(Resource):
    def get(self, weight_log_id):
        weight_log = WeightLog.query.get_or_404(weight_log_id)
        return make_response(weight_log.to_dict(), 200)

    def put(self, weight_log_id):
        weight_log = WeightLog.query.get_or_404(weight_log_id)
        data = request.get_json()
        
        weight_log.user_id = data.get('user_id', weight_log.user_id)
        weight_log.date = datetime.strptime(data['date'], '%Y-%m-%d').date()  # Convert string to date object
        weight_log.weight = data.get('weight', weight_log.weight)
        weight_log.notes = data.get('notes', weight_log.notes)
        
        db.session.commit()
        return make_response(weight_log.to_dict(), 200)

    def delete(self, weight_log_id):
        weight_log = WeightLog.query.get_or_404(weight_log_id)
        db.session.delete(weight_log)
        db.session.commit()
        return make_response({"message": "Weight log deleted successfully"}, 200)

api.add_resource(WeightLogResource, '/weight_log')
api.add_resource(SingleWeightLogResource, '/weight_log/<int:weight_log_id>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)