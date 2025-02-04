#!/usr/bin/env python3

# Standard library imports
from datetime import datetime
from flask import Flask, request, make_response, jsonify
from flask_migrate import Migrate
from flask_restful import Resource, Api
from flask_cors import CORS

# Local imports
from config import app, db
from models import User, Workout, Diet, UserWorkoutAssignment, UserDietAssignment, CustomExercise

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

# User Resource for CRUD operations
class UserResource(Resource):
    # Get All Users
    def get(self):
        users = User.query.all()
        return jsonify([user.to_dict() for user in users])

    # Create a new User
    def post(self):
        data = request.get_json()
        new_user = User(
            username=data['username'],
            age=data['age'],
            weight=data['weight'],
            gender=data['gender'],
            height=data['height'],
            password=data['password']
        )
        db.session.add(new_user)
        db.session.commit()
        return new_user.to_dict(), 201

class SingleUserResource(Resource):
    # Get User by ID
    def get(self, user_id):
        user = User.query.get(user_id)
        if user is None:
            return {'message': 'User not found'}, 404
        return user.to_dict()

    # Delete User by ID
    def delete(self, user_id):
        user = User.query.get(user_id)
        if user is None:
            return {'message': 'User not found'}, 404
        db.session.delete(user)
        db.session.commit()
        return {'message': 'User deleted'}, 200

# Add User Resource to API
api.add_resource(UserResource, '/users')  # Label: User Routes
api.add_resource(SingleUserResource, '/users/<int:user_id>')  # Label: Single User Routes
# Workout Resource for fetching workouts by muscle group
class WorkoutResource(Resource):
    def get(self):
        category = request.args.get('category')
        if category:
            workouts = Workout.query.filter_by(category=category).all()
        else:
            workouts = Workout.query.all()
        return jsonify([workout.to_dict() for workout in workouts])

api.add_resource(WorkoutResource, '/workouts')  # Label: Workouts Routes

# Diet Resource for fetching diets by muscle group
class DietResource(Resource):
    def get(self):
        category = request.args.get('category')
        if category:
            diets = Diet.query.filter_by(category=category).all()
        else:
            diets = Diet.query.all()
        return jsonify([diet.to_dict() for diet in diets])

api.add_resource(DietResource, '/diets')  # Label: Diets Routes
# UserWorkoutAssignment Resource for assigning and unassigning workouts
class UserWorkoutAssignmentResource(Resource):
    def get(self):
        user_id = request.args.get('user_id', type=int)
        if user_id:
            assignments = UserWorkoutAssignment.query.filter_by(user_id=user_id).all()
        else:
            assignments = UserWorkoutAssignment.query.all()
        return jsonify([assignment.to_dict() for assignment in assignments])

    def post(self):
        data = request.get_json()
        new_assignment = UserWorkoutAssignment(
            user_id=data['user_id'],
            workout_id=data['workout_id'],
            completed=data.get('completed', False)
        )
        db.session.add(new_assignment)
        db.session.commit()
        return new_assignment.to_dict(), 201


api.add_resource(UserWorkoutAssignmentResource, '/user_workout_assignments', '/user_workout_assignments/<int:assignment_id>')  # Label: User-Workout Assignments Routes
class SingleUserWorkoutAssignmentResource(Resource):
    def put(self, assignment_id):
        assignment = UserWorkoutAssignment.query.get(assignment_id)
        if assignment is None:
            return {'message': 'Assignment not found'}, 404
        data = request.get_json()
        assignment.completed = data.get('completed', assignment.completed)
        db.session.commit()
        return assignment.to_dict(), 200

api.add_resource(SingleUserWorkoutAssignmentResource, '/user_workout_assignments/<int:assignment_id>')
# UserDietAssignment Resource for assigning and unassigning diets
class UserDietAssignmentResource(Resource):
    def get(self):
        assignments = UserDietAssignment.query.all()
        return jsonify([assignment.to_dict() for assignment in assignments])

    def post(self):
        data = request.get_json()
        new_assignment = UserDietAssignment(
            user_id=data['user_id'],
            diet_id=data['diet_id'],
            completed=data.get('completed', False)  # Accept 'completed' from data
        )
        db.session.add(new_assignment)
        db.session.commit()
        return new_assignment.to_dict(), 201


api.add_resource(UserDietAssignmentResource, '/user_diet_assignments', '/user_diet_assignments/<int:assignment_id>')  # Label: User-Diet Assignments Routes

class SingleUserDietAssignmentResource(Resource):
    def put(self, assignment_id):
        assignment = UserDietAssignment.query.get(assignment_id)
        if assignment is None:
            return {'message': 'Assignment not found'}, 404
        data = request.get_json()
        assignment.completed = data.get('completed', assignment.completed)
        db.session.commit()
        return assignment.to_dict(), 200
    
class SingleUserDietAssignmentResource(Resource):
    def put(self, assignment_id):
        assignment = UserDietAssignment.query.get(assignment_id)
        if assignment is None:
            return {'message': 'Assignment not found'}, 404
        data = request.get_json()
        assignment.completed = data.get('completed', assignment.completed)
        db.session.commit()
        return assignment.to_dict(), 200

api.add_resource(SingleUserDietAssignmentResource, '/user_diet_assignments/<int:assignment_id>')


# CustomExercise Resource for CRUD operations
class CustomExerciseListResource(Resource):
    # Get all custom exercises
    def get(self):
        exercises = CustomExercise.query.all()
        return jsonify({'exercises': [exercise.to_dict() for exercise in exercises]})

    # Create a new custom exercise
    def post(self):
        data = request.get_json()
        new_exercise = CustomExercise(
            name=data['name'],
            sets=data['sets'],
            reps=data['reps'],
            weight=data['weight'],
            category=data['category'],
            day=data['day'],
            completed=False,
            user_id=None  # Initially unassigned
        )
        db.session.add(new_exercise)
        db.session.commit()
        return new_exercise.to_dict(), 201

api.add_resource(CustomExerciseListResource, '/custom_exercises')

class CustomExerciseResource(Resource):
    # Get a single custom exercise by ID
    def get(self, exercise_id):
        exercise = CustomExercise.query.get(exercise_id)
        if exercise is None:
            return {'message': 'Exercise not found'}, 404
        return exercise.to_dict()

    # Update a custom exercise by ID
    def put(self, exercise_id):
        exercise = CustomExercise.query.get(exercise_id)
        if exercise is None:
            return {'message': 'Exercise not found'}, 404
        data = request.get_json()
        for field in ['name', 'sets', 'reps', 'weight', 'category', 'day', 'completed', 'user_id']:
            if field in data:
                setattr(exercise, field, data[field])
        db.session.commit()
        return exercise.to_dict(), 200

    # Delete a custom exercise by ID
    def delete(self, exercise_id):
        exercise = CustomExercise.query.get(exercise_id)
        if exercise is None:
            return {'message': 'Exercise not found'}, 404
        db.session.delete(exercise)
        db.session.commit()
        return {'message': 'Exercise deleted'}, 200

api.add_resource(CustomExerciseResource, '/custom_exercises/<int:exercise_id>')



if __name__ == '__main__':
    app.run(port=5555, debug=True)























