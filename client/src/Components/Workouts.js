import React, { useState } from 'react';
import '../styles/Workouts.css';

function Workouts() {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [workouts, setWorkouts] = useState([
    { id: 1, name: 'Push-Up', sets: 4, reps: 8, category: 'Chest', completed: false },
    { id: 2, name: 'Pull-Up', sets: 4, reps: 8, category: 'Back', completed: false },
    { id: 3, name: 'Squat', sets: 4, reps: 8, category: 'Legs', completed: false },
    { id: 4, name: 'Bicep Curl', sets: 4, reps: 8, category: 'Arms', completed: false },
    { id: 5, name: 'Shoulder Press', sets: 4, reps: 8, category: 'Shoulders', completed: false },
    { id: 6, name: 'Bench Press', sets: 4, reps: 8, category: 'Chest', completed: false },
    { id: 7, name: 'Deadlift', sets: 4, reps: 8, category: 'Back', completed: false },
    { id: 8, name: 'Lunges', sets: 4, reps: 8, category: 'Legs', completed: false },
    { id: 9, name: 'Tricep Dip', sets: 4, reps: 8, category: 'Arms', completed: false },
    { id: 10, name: 'Lateral Raise', sets: 4, reps: 8, category: 'Shoulders', completed: false },
    { id: 11, name: 'Chest Fly', sets: 4, reps: 8, category: 'Chest', completed: false },
    { id: 12, name: 'Incline Bench Press', sets: 4, reps: 8, category: 'Chest', completed: false },
    { id: 13, name: 'Seated Row', sets: 4, reps: 8, category: 'Back', completed: false },
    { id: 14, name: 'Lat Pulldown', sets: 4, reps: 8, category: 'Back', completed: false },
    { id: 15, name: 'Leg Press', sets: 4, reps: 8, category: 'Legs', completed: false },
    { id: 16, name: 'Leg Extension', sets: 4, reps: 8, category: 'Legs', completed: false },
    { id: 17, name: 'Hammer Curl', sets: 4, reps: 8, category: 'Arms', completed: false },
    { id: 18, name: 'Tricep Pushdown', sets: 4, reps: 8, category: 'Arms', completed: false },
    { id: 19, name: 'Front Raise', sets: 4, reps: 8, category: 'Shoulders', completed: false },
    { id: 20, name: 'Shoulder Shrug', sets: 4, reps: 8, category: 'Shoulders', completed: false }
  ]);

  const [dietCompleted, setDietCompleted] = useState(false);

  const diets = {
    Chest: ['High Protein Diet', 'Balanced Diet'],
    Back: ['High Protein Diet', 'Low Carb Diet'],
    Legs: ['High Protein Diet', 'Balanced Diet', 'High Carb Diet'],
    Arms: ['Balanced Diet', 'High Protein Diet'],
    Shoulders: ['High Protein Diet', 'Low Fat Diet']
  };

  const getWorkoutsByCategory = (category) => {
    return workouts.filter(workout => workout.category === category).slice(0, 4);
  };

  const handleButtonClick = (muscleGroup) => {
    setSelectedGroup(selectedGroup === muscleGroup ? '' : muscleGroup);
  };

  const markAsDone = (id) => {
    const updatedWorkouts = workouts.map(workout => 
      workout.id === id ? { ...workout, completed: !workout.completed } : workout
    );
    setWorkouts(updatedWorkouts);
  };

  const markDietAsDone = () => {
    setDietCompleted(!dietCompleted);
  };

  return (
    <div className="workouts">
      <h2 className="workouts-heading">Workouts by Muscle Group</h2>
      <div className="muscle-group-buttons">
        {['Chest', 'Back', 'Legs', 'Arms', 'Shoulders'].map(muscleGroup => (
          <button 
            key={muscleGroup} 
            className="muscle-group-button"
            onClick={() => handleButtonClick(muscleGroup)}
          >
            {muscleGroup}
          </button>
        ))}
      </div>
      {selectedGroup && (
        <>
          <div className="card-row">
            {getWorkoutsByCategory(selectedGroup).map(workout => (
              <div 
                key={workout.id} 
                className={`card workout-card ${workout.completed ? 'completed' : ''}`}
                onClick={() => markAsDone(workout.id)}
              >
                <h4>{workout.name}</h4>
                <p><strong>{workout.sets} Sets</strong> of <strong>{workout.reps} Reps</strong></p>
              </div>
            ))}
          </div>
          <div 
            className={`card diet-card ${dietCompleted ? 'completed' : ''}`}
            onClick={markDietAsDone}
          >
            <h4><strong>Diet Recommendations</strong></h4>
            <ul>
              {diets[selectedGroup].map((diet, index) => (
                <li key={index}>{diet}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default Workouts;
