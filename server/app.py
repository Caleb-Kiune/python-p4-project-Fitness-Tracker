#!/usr/bin/env python3

# Standard library imports
from datetime import datetime
from flask import Flask, request, make_response
from flask_migrate import Migrate
from flask_restful import Resource, Api
from flask_cors import CORS

# Local imports
from config import app, db
from models import User, Workout, Exercise, ExerciseWorkout, UserWorkoutLog, Diet, WeightLog

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Enable CORS
CORS(app)

# Instantiate REST API
api = Api(app)

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
            weight=data.get('weight'),
            height=data.get('height'),
            profile_picture=data.get('profile_picture')
        )
        db.session.add(new_user)
        db.session.commit()
        return make_response(new_user.to_dict(), 201)

api.add_resource(UserResource, '/users')

class UserDetailResource(Resource):
    def get(self, user_id):
        user = User.query.get_or_404(user_id)
        return make_response(user.to_dict(), 200)

    def put(self, user_id):
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        user.username = data.get('username', user.username)
        user.age = data.get('age', user.age)
        user.gender = data.get('gender', user.gender)
        user.weight = data.get('weight', user.weight)
        user.height = data.get('height', user.height)
        user.profile_picture = data.get('profile_picture', user.profile_picture)
        db.session.commit()
        return make_response(user.to_dict(), 200)

    def delete(self, user_id):
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return make_response({"message": "User deleted successfully"}, 200)

api.add_resource(UserDetailResource, '/users/<int:user_id>')

# User association endpoints (workouts, exercises, diets)
class UserWorkoutResource(Resource):
    def get(self, user_id):
        user = User.query.get_or_404(user_id)
        workouts = [workout.to_dict() for workout in user.workouts]
        return make_response({"workouts": workouts}, 200)

    def post(self, user_id):
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        workout = Workout.query.get_or_404(data['workout_id'])
        user.workouts.append(workout)
        db.session.commit()
        return make_response({"message": "Workout added successfully"}, 201)

api.add_resource(UserWorkoutResource, '/users/<int:user_id>/workouts')

class UserExerciseResource(Resource):
    def get(self, user_id):
        user = User.query.get_or_404(user_id)
        exercises = [exercise.to_dict() for exercise in user.exercises]
        return make_response({"exercises": exercises}, 200)

    def post(self, user_id):
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        exercise = Exercise.query.get_or_404(data['exercise_id'])
        user.exercises.append(exercise)
        db.session.commit()
        return make_response({"message": "Exercise added successfully"}, 201)

api.add_resource(UserExerciseResource, '/users/<int:user_id>/exercises')
class UserDietResource(Resource):
    def get(self, user_id):
        user = User.query.get_or_404(user_id)
        diets = [diet.to_dict() for diet in user.diets]
        return make_response({"diets": diets}, 200)

    def post(self, user_id):
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        diet = Diet.query.get_or_404(data['diet_id'])
        user.diets.append(diet)
        db.session.commit()
        return make_response({"message": "Diet added successfully"}, 201)

api.add_resource(UserDietResource, '/users/<int:user_id>/diets')

# Diet model endpoints
class DietResource(Resource):
    def get(self):
        diets = Diet.query.all()
        diet_list = [diet.to_dict() for diet in diets]
        return make_response({"diets": diet_list}, 200)

    def post(self):
        data = request.get_json()
        new_diet = Diet(
            name=data['name'],
            description=data.get('description'),
            completed=data.get('completed', False),
            notes=data.get('notes')
        )
        db.session.add(new_diet)
        db.session.commit()
        return make_response(new_diet.to_dict(), 201)

api.add_resource(DietResource, '/diets')

class DietDetailResource(Resource):
    def get(self, diet_id):
        diet = Diet.query.get_or_404(diet_id)
        return make_response(diet.to_dict(), 200)

    def put(self, diet_id):
        diet = Diet.query.get_or_404(diet_id)
        data = request.get_json()
        diet.name = data.get('name', diet.name)
        diet.description = data.get('description', diet.description)
        diet.completed = data.get('completed', diet.completed)
        diet.notes = data.get('notes', diet.notes)
        db.session.commit()
        return make_response(diet.to_dict(), 200)

    def delete(self, diet_id):
        diet = Diet.query.get_or_404(diet_id)
        db.session.delete(diet)
        db.session.commit()
        return make_response({"message": "Diet deleted successfully"}, 200)

api.add_resource(DietDetailResource, '/diets/<int:diet_id>')

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
            category=data.get('category', 'Chest'),
            completed=data.get('completed', False),
            diet_id=data.get('diet_id')
        )
        db.session.add(new_workout)
        db.session.commit()
        return make_response(new_workout.to_dict(), 201)

api.add_resource(WorkoutResource, '/workouts')

class WorkoutDetailResource(Resource):
    def get(self, workout_id):
        workout = Workout.query.get_or_404(workout_id)
        return make_response(workout.to_dict(), 200)

    def put(self, workout_id):
        workout = Workout.query.get_or_404(workout_id)
        data = request.get_json()
        workout.name = data.get('name', workout.name)
        workout.duration = data.get('duration', workout.duration)
        workout.category = data.get('category', workout.category)
        workout.completed = data.get('completed', workout.completed)
        workout.diet_id = data.get('diet_id', workout.diet_id)
        db.session.commit()
        return make_response(workout.to_dict(), 200)

    def delete(self, workout_id):
        workout = Workout.query.get_or_404(workout_id)
        db.session.delete(workout)
        db.session.commit()
        return make_response({"message": "Workout deleted successfully"}, 200)

api.add_resource(WorkoutDetailResource, '/workouts/<int:workout_id>')
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

api.add_resource(ExerciseResource, '/exercises')

class ExerciseDetailResource(Resource):
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
        exercise.completed = data.get('completed', exercise.completed)
        db.session.commit()
        return make_response(exercise.to_dict(), 200)

    def delete(self, exercise_id):
        exercise = Exercise.query.get_or_404(exercise_id)
        db.session.delete(exercise)
        db.session.commit()
        return make_response({"message": "Exercise deleted successfully"}, 200)

api.add_resource(ExerciseDetailResource, '/exercises/<int:exercise_id>')

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

api.add_resource(ExerciseWorkoutResource, '/exercise_workouts')

class ExerciseWorkoutDetailResource(Resource):
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
        return make_response({"message": "ExerciseWorkout deleted successfully"}, 200)

api.add_resource(ExerciseWorkoutDetailResource, '/exercise_workouts/<int:exercise_workout_id>')
# UserWorkoutLog model endpoints
class UserWorkoutLogResource(Resource):
    def get(self):
        logs = UserWorkoutLog.query.all()
        log_list = [log.to_dict() for log in logs]
        return make_response({"workout_logs": log_list}, 200)

    def post(self):
        data = request.get_json()
        new_log = UserWorkoutLog(
            user_id=data['user_id'],
            workout_id=data['workout_id'],
            date=data['date'],
            notes=data.get('notes')
        )
        db.session.add(new_log)
        db.session.commit()
        return make_response(new_log.to_dict(), 201)

api.add_resource(UserWorkoutLogResource, '/workout_logs')

class UserWorkoutLogDetailResource(Resource):
    def get(self, log_id):
        log = UserWorkoutLog.query.get_or_404(log_id)
        return make_response(log.to_dict(), 200)

    def put(self, log_id):
        log = UserWorkoutLog.query.get_or_404(log_id)
        data = request.get_json()
        log.user_id = data.get('user_id', log.user_id)
        log.workout_id = data.get('workout_id', log.workout_id)
        log.date = data.get('date', log.date)
        log.notes = data.get('notes', log.notes)
        db.session.commit()
        return make_response(log.to_dict(), 200)

    def delete(self, log_id):
        log = UserWorkoutLog.query.get_or_404(log_id)
        db.session.delete(log)
        db.session.commit()
        return make_response({"message": "UserWorkoutLog deleted successfully"}, 200)

api.add_resource(UserWorkoutLogDetailResource, '/workout_logs/<int:log_id>')

# WeightLog model endpoints
class WeightLogResource(Resource):
    def get(self):
        logs = WeightLog.query.all()
        log_list = [log.to_dict() for log in logs]
        return make_response({"weight_logs": log_list}, 200)

    def post(self):
        data = request.get_json()
        new_log = WeightLog(
            user_id=data['user_id'],
            date=data['date'],
            weight=data['weight'],
            notes=data.get('notes')
        )
        db.session.add(new_log)
        db.session.commit()
        return make_response(new_log.to_dict(), 201)

api.add_resource(WeightLogResource, '/weight_logs')

class WeightLogDetailResource(Resource):
    def get(self, log_id):
        log = WeightLog.query.get_or_404(log_id)
        return make_response(log.to_dict(), 200)

    def put(self, log_id):
        log = WeightLog.query.get_or_404(log_id)
        data = request.get_json()
        log.user_id = data.get('user_id', log.user_id)
        log.date = data.get('date', log.date)
        log.weight = data.get('weight', log.weight)
        log.notes = data.get('notes', log.notes)
        db.session.commit()
        return make_response(log.to_dict(), 200)

    def delete(self, log_id):
        log = WeightLog.query.get_or_404(log_id)
        db.session.delete(log)
        db.session.commit()
        return make_response({"message": "WeightLog deleted successfully"}, 200)

api.add_resource(WeightLogDetailResource, '/weight_logs/<int:log_id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)
