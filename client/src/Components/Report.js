import React, { useEffect, useState } from 'react';
import '../styles/Report.css';



const Report = () => {
  const [workouts, setWorkouts] = useState([]);
  const apiURL = 'http://127.0.0.1:5555/exercise';

  useEffect(() => {
    fetch(apiURL)
      .then(response => response.json())
      .then(data => {
        console.log("Fetched exercises:", data);
        // Filter for completed workouts only
        const completedWorkouts = data.exercises.filter(workout => workout.completed);
        setWorkouts(completedWorkouts);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="report-container">
      <h1>My Reports</h1>
      <div className="report-summary">
        <h2>Completed Activities</h2>
        {workouts.length > 0 ? (
          <ul>
            {workouts.map((workout, index) => (
              <li key={index} className="report-item">
                {workout.date && <span>{workout.date} - </span>}
                {workout.name}: {workout.sets} sets x {workout.reps} reps, {workout.weight} kg
              </li>
            ))}
          </ul>
        ) : (
          <p>No completed exercises yet.</p>
        )}
      </div>
    </div>
  );
};

export default Report;
