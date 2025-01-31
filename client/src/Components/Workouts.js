import React, { useState } from 'react';
import '../App.css';  

const workoutData = {
  "Chest": [
    { name: "Bench Press", sets: 4, reps: "8-12", weight: "50kg", completed: false },
    { name: "Incline Bench Press", sets: 4, reps: "8-12", weight: "45kg", completed: false },
    { name: "Chest Fly", sets: 4, reps: "8-12", weight: "15kg", completed: false },
    { name: "Push-Up", sets: 4, reps: "8-12", weight: "body weight", completed: false }
  ],
  "Back": [
    { name: "Deadlift", sets: 4, reps: "8-12", weight: "100kg", completed: false },
    { name: "Pull-Up", sets: 4, reps: "8-12", weight: "body weight", completed: false },
    { name: "Bent Over Row", sets: 4, reps: "8-12", weight: "60kg", completed: false },
    { name: "Lat Pulldown", sets: 4, reps: "8-12", weight: "70kg", completed: false }
  ],
  "Legs": [
    { name: "Squat", sets: 4, reps: "8-12", weight: "80kg", completed: false },
    { name: "Leg Press", sets: 4, reps: "8-12", weight: "150kg", completed: false },
    { name: "Lunges", sets: 4, reps: "8-12", weight: "20kg", completed: false },
    { name: "Leg Curl", sets: 4, reps: "8-12", weight: "25kg", completed: false }
  ],
  "Arms": [
    { name: "Bicep Curl", sets: 4, reps: "8-12", weight: "12kg", completed: false },
    { name: "Tricep Extension", sets: 4, reps: "8-12", weight: "15kg", completed: false },
    { name: "Hammer Curl", sets: 4, reps: "8-12", weight: "10kg", completed: false },
    { name: "Tricep Dip", sets: 4, reps: "8-12", weight: "body weight", completed: false }
  ],
  "Shoulders": [
    { name: "Shoulder Press", sets: 4, reps: "8-12", weight: "25kg", completed: false },
    { name: "Lateral Raise", sets: 4, reps: "8-12", weight: "8kg", completed: false },
    { name: "Front Raise", sets: 4, reps: "8-12", weight: "10kg", completed: false },
    { name: "Shrugs", sets: 4, reps: "8-12", weight: "30kg", completed: false }
  ]
};

function Workouts() {
  const [exercises, setExercises] = useState(workoutData);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState("Chest");
  const [selectedExercise, setSelectedExercise] = useState(null);

  const handleMuscleGroupChange = (event) => {
    setSelectedMuscleGroup(event.target.value);
    setSelectedExercise(null);
  };

  const toggleCompleted = (muscleGroup, exerciseName) => {
    const updatedExercises = {...exercises};
    updatedExercises[muscleGroup] = updatedExercises[muscleGroup].map(exercise =>
      exercise.name === exerciseName ? { ...exercise, completed: !exercise.completed } : exercise
    );
    setExercises(updatedExercises);
  };

  const handleWeightChange = (muscleGroup, exerciseName, newWeight) => {
    const updatedExercises = { ...exercises };
    updatedExercises[muscleGroup] = updatedExercises[muscleGroup].map(exercise =>
      exercise.name === exerciseName ? { ...exercise, weight: newWeight } : exercise
    );
    setExercises(updatedExercises);
  };

  return (
    <div className="workouts">
      <h2 className='workouts-heading'>Workouts by Muscle Group</h2>
      <select className='category-button' onChange={handleMuscleGroupChange} value={selectedMuscleGroup}>
        {Object.keys(exercises).map((muscleGroup) => (
          <option key={muscleGroup} value={muscleGroup}>
            {muscleGroup}
          </option>
        ))}
      </select>

      <div className="workout-cards">
        {exercises[selectedMuscleGroup].map((exercise, index) => (
          <div
            key={index}
            className={`workout-card ${exercise.completed ? 'completed' : ''}`}
            onClick={() => toggleCompleted(selectedMuscleGroup, exercise.name)}
          >
            <h3>{exercise.name}</h3>
            <p>{exercise.sets} Sets x {exercise.reps} Reps</p>
            <p>Weight: 
              <input 
                type="text" 
                value={exercise.weight}
                onChange={(e) => handleWeightChange(selectedMuscleGroup, exercise.name, e.target.value)}
              />
            </p>
            {exercise.completed && <span className="checkmark">✔️</span>}
          </div>
        ))}
      </div>

      {selectedExercise && (
        <div className="exercise-details">
          <h3>Details for {selectedExercise.name}</h3>
          <p>Sets: {selectedExercise.sets}</p>
          <p>Reps: {selectedExercise.reps}</p>
          <p>Weight: {selectedExercise.weight}</p>
        </div>
      )}
    </div>
  );
}

export default Workouts;
