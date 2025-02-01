import React, { useState, useEffect } from 'react';
import '../styles/Workouts.css';


function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [diets, setDiets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch workout and diet data from backend
    const fetchData = async () => {
      try {
        const workoutResponse = await fetch('http://127.0.0.1:5555/workout');
        const dietResponse = await fetch('http://127.0.0.1:5555/diet');
        const workoutData = await workoutResponse.json();
        const dietData = await dietResponse.json();

        setWorkouts(workoutData.workouts);
        setDiets(dietData.diets);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const getWorkoutsByCategory = (category) => {
    return workouts.filter(workout => workout.category === category);
  };

  const toggleExerciseCompleted = (workoutId) => {
    const updatedWorkouts = workouts.map(workout =>
      workout.id === workoutId ? { ...workout, completed: !workout.completed } : workout
    );
    setWorkouts(updatedWorkouts);
  };

  const handleWeightChange = (workoutId, newWeight) => {
    const updatedWorkouts = workouts.map(workout =>
      workout.id === workoutId ? { ...workout, weight: newWeight } : workout
    );
    setWorkouts(updatedWorkouts);
  };
  const toggleDietCompleted = (dietId) => {
    const updatedDiets = diets.map(diet =>
      diet.id === dietId ? { ...diet, completed: !diet.completed } : diet
    );
    setDiets(updatedDiets);
  };
  return (
    <div className="workouts">
      <h2 className="workouts-heading">Workouts by Muscle Group</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="category-cards">
          {['Chest', 'Back', 'Legs', 'Arms', 'Shoulders'].map(muscleGroup => (
            <div key={muscleGroup} className="category-card">
              <h3>{muscleGroup}</h3>

              <div className="workout-cards">
                {getWorkoutsByCategory(muscleGroup).map((workout, index) => (
                  <div
                    key={index}
                    className={`workout-card ${workout.completed ? 'completed' : ''}`}
                    onClick={() => toggleExerciseCompleted(workout.id)}
                  >
                    <h4>{workout.name}</h4>
                    <p>Duration: {workout.duration} minutes</p>
                    <p>Weight:
                      <input
                        type="text"
                        value={workout.weight}
                        onChange={(e) => handleWeightChange(workout.id, e.target.value)}
                      />
                    </p>
                    {workout.completed && <span className="checkmark">✔️</span>}
                  </div>
                ))}
              </div>
              {diets.map(diet => (
                <div
                  key={diet.id}
                  className={`diet-card ${diet.completed ? 'completed' : ''}`}
                  onClick={() => toggleDietCompleted(diet.id)}
                >
                  <h4>Diet Plan</h4>
                  <p>{diet.description}</p>
                  {diet.completed && <span className="checkmark">✔️</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Workouts;




