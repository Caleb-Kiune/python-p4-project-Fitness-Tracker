import React, { useState, useEffect } from 'react';
import '../styles/Workouts.css';

const muscleGroups = ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders']; // Moved outside the component

function Workouts() {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [diets, setDiets] = useState({});

  // Fetch workouts from backend
  useEffect(() => {
    fetch('http://127.0.0.1:5555/workouts')
      .then(response => response.json())
      .then(data => {
        setWorkouts(data.workouts);
      })
      .catch(error => {
        console.error('Error fetching workouts:', error);
      });

    // Fetch diets and assign them to each muscle group
    fetch('http://127.0.0.1:5555/diets')
      .then(response => response.json())
      .then(data => {
        muscleGroups.forEach(muscleGroup => {
          const randomDiet = data.diets[Math.floor(Math.random() * data.diets.length)];
          setDiets(prevDiets => ({
            ...prevDiets,
            [muscleGroup]: randomDiet
          }));
        });
      })
      .catch(error => {
        console.error('Error fetching diets:', error);
      });
  }, []); // Removed muscleGroups from the dependency array

  const handleButtonClick = (muscleGroup) => {
    setSelectedGroup(selectedGroup === muscleGroup ? '' : muscleGroup);
  };
  const markWorkoutAsDone = (id) => {
    const workoutToUpdate = workouts.find(workout => workout.id === id);
    const updatedWorkout = { ...workoutToUpdate, completed: !workoutToUpdate.completed };

    fetch(`http://127.0.0.1:5555/workouts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedWorkout),
    })
    .then(response => response.json())
    .then(data => {
      const updatedWorkouts = workouts.map(workout => 
        workout.id === id ? data : workout
      );
      setWorkouts(updatedWorkouts);
    })
    .catch(error => {
      console.error('Error updating workout:', error);
    });
  };

  const markDietAsDone = (muscleGroup) => {
    const dietToUpdate = diets[muscleGroup];
    const updatedDiet = { ...dietToUpdate, completed: !dietToUpdate.completed };

    fetch(`http://127.0.0.1:5555/diets/${updatedDiet.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedDiet),
    })
    .then(response => response.json())
    .then(data => {
      setDiets(prevDiets => ({
        ...prevDiets,
        [muscleGroup]: data
      }));
    })
    .catch(error => {
      console.error('Error updating diet:', error);
    });
  };
  return (
    <div className="workouts">
      <h2 className="workouts-heading">Workouts by Muscle Group</h2>
      <div className="muscle-group-buttons">
        {muscleGroups.map(muscleGroup => (
          <button 
            key={muscleGroup} 
            className={`muscle-group-button ${selectedGroup === muscleGroup ? 'selected' : ''}`}
            onClick={() => handleButtonClick(muscleGroup)}
          >
            {muscleGroup}
          </button>
        ))}
      </div>
      {selectedGroup && (
        <>
          <div className="card-row">
            {workouts.filter(workout => workout.category === selectedGroup).slice(0, 4).map(workout => (
              <div key={workout.id} className={`card workout-card ${workout.completed ? 'completed' : ''}`}>
                <h4>{workout.name}</h4>
                <p><strong>{workout.sets} Sets</strong> of <strong>{workout.reps} Reps</strong></p>
                <button onClick={() => markWorkoutAsDone(workout.id)}>
                  {workout.completed ? 'Undo' : 'Complete'}
                </button>
              </div>
            ))}
          </div>
          {diets[selectedGroup] && (
            <div className={`card diet-card ${diets[selectedGroup].completed ? 'completed' : ''}`}>
              <h4><strong>Diet Recommendation</strong></h4>
              <p>{diets[selectedGroup].name}</p>
              <p>{diets[selectedGroup].description}</p>
              <button onClick={() => markDietAsDone(selectedGroup)}>
                {diets[selectedGroup].completed ? 'Undo' : 'Complete'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Workouts;


