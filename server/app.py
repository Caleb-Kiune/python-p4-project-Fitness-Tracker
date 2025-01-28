#!/usr/bin/env python3

# Standard library imports
from flask import Flask
from flask_migrate import Migrate

# Remote library imports
from flask import request,make_response
from flask_restful import Resource

# Local imports
from config import app, db, api
from models import User, Workout, Exercise, UserExercise

# Initialize Flask-Migrate
migrate = Migrate(app, db)

# Views go here!

@app.route('/')
def index():
    return '<h1>Welcome to Fitness Tracker</h1>'

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

if __name__ == '__main__':
    app.run(port=5555, debug=True)