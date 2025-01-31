#!/usr/bin/env python3

# Standard library imports
from datetime import datetime
from flask import Flask
from flask_migrate import Migrate

# Remote library imports
from flask import request, make_response
from flask_restful import Resource
from flask_cors import CORS
# Local imports
from config import app, db, api
from models import User, Workout, Exercise, ExerciseWorkout, UserWorkoutLog, Diet, WeightLog, db

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Enable CORS
CORS(app)

# Views go here!

@app.route('/')
def index():
    return '<h1>Welcome to Fitness Tracker</h1>'

# User model endpoints
from flask_restful import Resource
from flask import request, jsonify, make_response
from models import User, UserWorkoutLog, WeightLog, db

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
        
        user_details = user.to_dict()

        return make_response(user_details, 200)

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


class UserWorkoutLogsResource(Resource):
    def get(self, user_id):
        user = User.query.get_or_404(user_id)

        workout_logs = UserWorkoutLog.query.filter_by(user_id=user_id).all()
        workout_logs_list = [log.to_dict() for log in workout_logs]

        return make_response({"workout_logs": workout_logs_list}, 200)


class UserWeightLogsResource(Resource):
    def get(self, user_id):
        user = User.query.get_or_404(user_id)

        weight_logs = WeightLog.query.filter_by(user_id=user_id).all()
        weight_logs_list = [log.to_dict() for log in weight_logs]

        return make_response({"weight_logs": weight_logs_list}, 200)

api.add_resource(UserResource, '/user')
api.add_resource(SingleUserResource, '/user/<int:user_id>')
api.add_resource(UserWorkoutLogsResource, '/user/<int:user_id>/workout_logs')
api.add_resource(UserWeightLogsResource, '/user/<int:user_id>/weight_logs')


# Workout model endpoints
class WorkoutResource(Resource):
    def get(self):
        workouts = Workout.query.all()
        workout_list = [workout.to_dict() for workout in workouts]
        return make_response({"workouts": workout_list}, 200)

    def post(self):
        data = request.get_json()
        new_workout = Workout(
            name=data['name'],
            duration=data.get('duration'),
            diet_id=data.get('diet_id')
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
        workout.diet_id = data.get('diet_id', workout.diet_id)

        db.session.commit()
        return make_response(workout.to_dict(), 200)

    def delete(self, workout_id):
        workout = Workout.query.get_or_404(workout_id)
        db.session.delete(workout)
        db.session.commit()
        return make_response({"message": "Workout deleted successfully"}, 200)

api.add_resource(WorkoutResource, '/workout')
api.add_resource(SingleWorkoutResource, '/workout/<int:workout_id>')

class WorkoutExercisesResource(Resource):
    def get(self, workout_id):
        workout = Workout.query.get_or_404(workout_id)
        exercises = [ew.exercise.to_dict() for ew in workout.exercise_workouts]
        return make_response({"exercises": exercises}, 200)

api.add_resource(WorkoutExercisesResource, '/workout/<int:workout_id>/exercises')

class WorkoutUsersResource(Resource):
    def get(self, workout_id):
        workout_logs = UserWorkoutLog.query.filter_by(workout_id=workout_id).all()
        users = [log.user.to_dict() for log in workout_logs]
        return make_response({"users": users}, 200)

api.add_resource(WorkoutUsersResource, '/workout/<int:workout_id>/users')


# Exercise model endpoints
class ExerciseResource(Resource):
    def get(self):
        exercises = Exercise.query.all()
        exercise_list = [exercise.to_dict() for exercise in exercises]
        return make_response({"exercises": exercise_list}, 200)

    def post(self):
        data = request.get_json()
        new_exercise = Exercise(
            name=data['name'],
            weight=data.get('weight'),
            sets=data.get('sets'),
            reps=data.get('reps'),
            category=data.get('category', 'Chest'),
            day=data.get('day', 'Monday'),
            completed=data.get('completed', False)  
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
        exercise.category = data.get('category', exercise.category)
        exercise.day = data.get('day', exercise.day)
        exercise.completed = data.get('completed', exercise.completed)  # Handle the completed field

        db.session.commit()
        return make_response(exercise.to_dict(), 200)

    def delete(self, exercise_id):
        exercise = Exercise.query.get_or_404(exercise_id)
        db.session.delete(exercise)
        db.session.commit()
        return make_response({"message": "Exercise deleted successfully"}, 200)


class ExerciseWorkoutsResource(Resource):
    def get(self, exercise_id):
        exercise = Exercise.query.get_or_404(exercise_id)
        workouts = [ew.workout.to_dict() for ew in exercise.exercise_workouts]
        return make_response({"workouts": workouts}, 200)

api.add_resource(ExerciseResource, '/exercise')
api.add_resource(SingleExerciseResource, '/exercise/<int:exercise_id>')
api.add_resource(ExerciseWorkoutsResource, '/exercise/<int:exercise_id>/workouts')


# ExerciseWorkout model endpoints
class ExerciseWorkoutResource(Resource):
    def get(self):
        exercise_workouts = ExerciseWorkout.query.all()
        exercise_workout_list = [ew.to_dict() for ew in exercise_workouts]
        return make_response({"exercise_workouts": exercise_workout_list}, 200)

    def post(self):
        data = request.get_json()
        new_exercise_workout = ExerciseWorkout(
            exercise_id=data['exercise_id'],
            workout_id=data['workout_id'],
            notes=data.get('notes')
        )
        db.session.add(new_exercise_workout)
        db.session.commit()
        return make_response(new_exercise_workout.to_dict(), 201)

class SingleExerciseWorkoutResource(Resource):
    def get(self, exercise_workout_id):
        exercise_workout = ExerciseWorkout.query.get_or_404(exercise_workout_id)
        return make_response(exercise_workout.to_dict(), 200)

    def put(self, exercise_workout_id):
        exercise_workout = ExerciseWorkout.query.get_or_404(exercise_workout_id)
        data = request.get_json()

        exercise_workout.exercise_id = data.get('exercise_id', exercise_workout.exercise_id)
        exercise_workout.workout_id = data.get('workout_id', exercise_workout.workout_id)
        exercise_workout.notes = data.get('notes', exercise_workout.notes)

        db.session.commit()
        return make_response(exercise_workout.to_dict(), 200)

    def delete(self, exercise_workout_id):
        exercise_workout = ExerciseWorkout.query.get_or_404(exercise_workout_id)
        db.session.delete(exercise_workout)
        db.session.commit()
        return make_response({"message": "ExerciseWorkout association deleted successfully"}, 200)

api.add_resource(ExerciseWorkoutResource, '/exercise_workout')
api.add_resource(SingleExerciseWorkoutResource, '/exercise_workout/<int:exercise_workout_id>')


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

class DietWorkoutsResource(Resource):
    def get(self, diet_id):
        diet = Diet.query.get_or_404(diet_id)
        workouts = [workout.to_dict() for workout in diet.workouts]
        return make_response({"workouts": workouts}, 200)

api.add_resource(DietResource, '/diet')
api.add_resource(SingleDietResource, '/diet/<int:diet_id>')
api.add_resource(DietWorkoutsResource, '/diet/<int:diet_id>/workouts')


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
        
        try:
            weight_log.date = datetime.strptime(data['date'], '%Y-%m-%d').date()
        except ValueError:
            weight_log.date = datetime.strptime(data['date'], '%a, %d %b %Y %H:%M:%S GMT').date()
        
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