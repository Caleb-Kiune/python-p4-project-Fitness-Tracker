from random import choice as rc, uniform
from faker import Faker
from config import app, db
from models import User, Workout, Diet, UserWorkoutAssignment, UserDietAssignment

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        # Clear existing data
        db.session.query(UserWorkoutAssignment).delete()
        db.session.query(UserDietAssignment).delete()
        db.session.query(Workout).delete()
        db.session.query(Diet).delete()
        db.session.query(User).delete()

        # Create sample diets
        diets = [
            Diet(name='High Protein Diet', description='A diet rich in protein to support muscle growth.', category='Chest'),
            Diet(name='Low Carb Diet', description='A diet low in carbohydrates to help with fat loss.', category='Legs'),
            Diet(name='Balanced Diet', description='A balanced diet with all necessary nutrients.', category='Back'),
            Diet(name='Vegan Diet', description='A plant-based diet with no animal products.', category='Shoulders'),
            Diet(name='Keto Diet', description='A high-fat, low-carb diet.', category='Arms')
        ]
        db.session.bulk_save_objects(diets)
        db.session.commit()

        # Create sample users
        users = []
        for _ in range(10):
            user = User(
                username=fake.user_name(),
                age=fake.random_int(min=18, max=60),
                weight=round(uniform(50, 100), 2),
                gender=rc(['male', 'female']),
                height=round(uniform(150, 200), 2),
                password=fake.password()
            )
            users.append(user)
        db.session.bulk_save_objects(users)
        db.session.commit()

        # Create sample workouts
        workouts = [
            Workout(name='Bench Press', category='Chest', sets=3, reps=10),
            Workout(name='Squat', category='Legs', sets=4, reps=8),
            Workout(name='Deadlift', category='Back', sets=3, reps=5),
            Workout(name='Shoulder Press', category='Shoulders', sets=3, reps=12),
            Workout(name='Bicep Curl', category='Arms', sets=3, reps=15)
        ]
        db.session.bulk_save_objects(workouts)
        db.session.commit()

        print("Seeding complete!")
