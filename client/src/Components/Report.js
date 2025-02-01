import React, { useEffect, useState, useMemo } from 'react';
import '../styles/Report.css';

const ReportItem = ({ date, name, sets, reps, weight, calories }) => (
  <li className="report-item">
    {date && <span>{date} - </span>}
    {name}: {sets && `${sets} sets x ${reps} reps,`} {weight && `${weight} kg`} {calories && `${calories} calories`}
  </li>
);

const ReportCard = ({ title, items, type }) => (
  <div className="report-summary card">
    <div className="card-title">{title}</div>
    {items.length > 0 ? (
      <ul>
        {items.map((item, index) => (
          <ReportItem key={index} {...item} />
        ))}
      </ul>
    ) : (
      <p>No {type} found.</p>
    )}
  </div>
);

const Report = () => {
  const [workouts, setWorkouts] = useState([]);
  const [completedDiets, setCompletedDiets] = useState([]);
  const [weightLogs, setWeightLogs] = useState([]);
  const apiURL = 'http://127.0.0.1:5555/exercise';
  const dietURL = 'http://127.0.0.1:5555/diet';
  const weightURL = 'http://127.0.0.1:5555/weight';

  useEffect(() => {
    const fetchData = async (url, setter, filterFunc = null) => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        const items = filterFunc ? filterFunc(data) : data;
        setter(items);
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
      }
    };

    fetchData(apiURL, (data) => setWorkouts(data.exercises));
    fetchData(dietURL, (data) => setCompletedDiets(data.diets.filter(diet => diet.completed)));
    fetchData(weightURL, (data) => setWeightLogs(data.weightLogs));
  }, []);

  const completedWorkouts = useMemo(() => workouts.filter(workout => workout.completed), [workouts]);

  return (
    <div className="report-container">
      <h1>My Reports</h1>
      <div className="cards-container">
        <ReportCard title="Exercises" items={completedWorkouts} type="completed exercises" />
        <ReportCard title="Workouts" items={workouts} type="workouts" />
        <ReportCard title="Diets" items={completedDiets} type="completed diets" />
        <ReportCard title="Weight Logs" items={weightLogs} type="weight logs" />
      </div>
    </div>
  );
};

export default Report;
