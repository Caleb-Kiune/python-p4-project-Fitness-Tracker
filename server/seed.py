from random import randint, choice as rc, uniform
from faker import Faker
from config import app, db
from models import User, Workout, Exercise, ExerciseWorkout, UserWorkoutLog, Diet, WeightLog

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        # Clear existing data
        db.session.query(UserWorkoutLog).delete()
        db.session.query(ExerciseWorkout).delete()
        db.session.query(WeightLog).delete()
        db.session.query(User).delete()
        db.session.query(Workout).delete()
        db.session.query(Exercise).delete()
        db.session.query(Diet).delete()

        # Create sample diets
        diets = [
            Diet(name='Keto', description='Keto diet description', completed=False, notes=fake.sentence()),
            Diet(name='Vegan', description='Vegan diet description', completed=False, notes=fake.sentence()),
            Diet(name='Paleo', description='Paleo diet description', completed=False, notes=fake.sentence())
        ]
        db.session.add_all(diets)
        db.session.commit()

        # Create sample users
        users = []
        for _ in range(10):
            user = User(
                username=fake.user_name(),
                age=fake.random_int(min=18, max=60),
                gender=rc(['male', 'female']),
                weight=f"{fake.random_int(min=50, max=100)}kg",
                height=f"{fake.random_int(min=150, max=200)}cm",
                profile_picture=fake.image_url()
            )
            users.append(user)
        db.session.add_all(users)
        db.session.commit()

        # Create sample workouts
        workouts = []
        for _ in range(10):
            workout = Workout(
                name=fake.word() + " Workout",
                duration=fake.random_int(min=20, max=60),
                category=rc(['Chest', 'Back', 'Legs', 'Arms', 'Shoulders']),
                diet=rc(diets),
                completed=False
            )
            workouts.append(workout)
        db.session.add_all(workouts)
        db.session.commit()

        # Create sample exercises
        exercises = []
        for _ in range(10):
            exercise = Exercise(
                name=fake.word(),
                weight=f"{fake.random_int(min=5, max=50)}kg",
                sets=fake.random_int(min=1, max=5),
                reps=fake.random_int(min=5, max=20),
                category=rc(['Chest', 'Back', 'Legs', 'Arms', 'Shoulders']),
                day=rc(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
                completed=False
            )
            exercises.append(exercise)
        db.session.add_all(exercises)
        db.session.commit()

        # Assign random diets, exercises, and workouts to users
        for user in users:
            user.diets.append(rc(diets))       # Assign a random diet to each user
            user.exercises.append(rc(exercises)) # Assign a random exercise to each user
            user.workouts.append(rc(workouts))   # Assign a random workout to each user
        db.session.commit()

        # Create sample exercise workouts
        exercise_workouts = []
        for workout in workouts:
            for _ in range(3):
                exercise_workout = ExerciseWorkout(
                    exercise=rc(exercises),
                    workout=workout,
                    notes=fake.sentence()
                )
                exercise_workouts.append(exercise_workout)
        db.session.add_all(exercise_workouts)
        db.session.commit()

        # Create sample user workout logs
        user_workout_logs = []
        for user in users:
            for _ in range(3):
                user_workout_log = UserWorkoutLog(
                    user=user,
                    workout=rc(workouts),
                    date=fake.date_this_year(),
                    notes=fake.sentence()
                )
                user_workout_logs.append(user_workout_log)
        db.session.add_all(user_workout_logs)
        db.session.commit()

        # Create sample weight logs
        weight_logs = []
        for user in users:
            for _ in range(3):
                weight_log = WeightLog(
                    user=user,
                    date=fake.date_this_year(),
                    weight=round(uniform(50.0, 100.0), 2),
                    notes=fake.sentence()
                )
                weight_logs.append(weight_log)
        db.session.add_all(weight_logs)
        db.session.commit()

        print("Seeding complete!")
