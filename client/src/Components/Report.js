import React, { useEffect, useState } from 'react';
import '../styles/Report.css';

const Report = () => {
  const [workouts, setWorkouts] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [completedDiets, setCompletedDiets] = useState([]);
  const [weightLogs, setWeightLogs] = useState([]);
  const apiURL = 'http://127.0.0.1:5555/exercise';
  const dietURL = 'http://127.0.0.1:5555/diet';
  const weightURL = 'http://127.0.0.1:5555/weight';

  useEffect(() => {
    // Fetch workouts
    fetch(apiURL)
      .then(response => response.json())
      .then(data => {
        console.log("Fetched exercises:", data);
        const completed = data.exercises.filter(workout => workout.completed);
        setWorkouts(data.exercises);
        setCompletedWorkouts(completed);
      })
      .catch(error => console.error('Error fetching data:', error));

    // Fetch diets
    fetch(dietURL)
      .then(response => response.json())
      .then(data => {
        console.log("Fetched diets:", data);
        const completed = data.diets.filter(diet => diet.completed);
        setCompletedDiets(completed);
      })
      .catch(error => console.error('Error fetching data:', error));

    // Fetch weight logs
    fetch(weightURL)
      .then(response => response.json())
      .then(data => {
        console.log("Fetched weight logs:", data);
        setWeightLogs(data.weightLogs);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="report-container">
      <h1>My Reports</h1>
      <div className="cards-container">
        <div className="report-summary card">
          <div className="card-title">Exercises</div>
          {completedWorkouts.length > 0 ? (
            <ul>
              {completedWorkouts.map((workout, index) => (
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

        <div className="report-summary card">
          <div className="card-title">Workouts</div>
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
            <p>No workouts found.</p>
          )}
        </div>

        <div className="report-summary card">
          <div className="card-title">Diets</div>
          {completedDiets.length > 0 ? (
            <ul>
              {completedDiets.map((diet, index) => (
                <li key={index} className="report-item">
                  {diet.date && <span>{diet.date} - </span>}
                  {diet.name}: {diet.calories} calories
                </li>
              ))}
            </ul>
          ) : (
            <p>No completed diets yet.</p>
          )}
        </div>

        <div className="report-summary card">
          <div className="card-title">Weight Logs</div>
          {weightLogs.length > 0 ? (
            <ul>
              {weightLogs.map((log, index) => (
                <li key={index} className="report-item">
                  {log.date && <span>{log.date} - </span>}
                  Weight: {log.weight} kg
                </li>
              ))}
            </ul>
          ) : (
            <p>No weight logs found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Report;
