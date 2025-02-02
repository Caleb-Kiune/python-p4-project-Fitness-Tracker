import React, { useEffect, useState, useMemo } from 'react';
import '../styles/Report.css';

const UserCard = ({ user }) => (
  <div key={user.id} className="user-card card">
    <div className="user-initial">
      {user.username.charAt(0)}
    </div>
    <div className="user-card-info">
      <h2>{user.username}</h2>
      <p><i className="fas fa-user"></i> Age: {user.age}</p>
      <p><i className="fas fa-venus-mars"></i> Gender: {user.gender}</p>
      <p><i className="fas fa-ruler-vertical"></i> Height: {user.height}</p>
      <p><i className="fas fa-weight"></i> Current Weight: {user.current_weight}</p>
    </div>
  </div>
);

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
  const [exercises, setExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [completedDiets, setCompletedDiets] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const exercisesURL = 'http://127.0.0.1:5555/exercises';
  const workoutsURL = 'http://127.0.0.1:5555/workouts';
  const dietsURL = 'http://127.0.0.1:5555/diets';
  const usersURL = 'http://127.0.0.1:5555/users';

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
    fetchData(exercisesURL, (data) => setExercises(data.exercises));
    fetchData(workoutsURL, (data) => setWorkouts(data.workouts));
    fetchData(dietsURL, (data) => setCompletedDiets(data.diets.filter(diet => diet.completed)));
    fetchData(usersURL, (data) => {
      setUsers(data.users);
      if (data.users.length > 0) {
        setSelectedUser(data.users[data.users.length - 1]); // Select the most recently added user
      }
    });
  }, []);
  const completedExercises = useMemo(() => exercises.filter(exercise => exercise.completed), [exercises]);
  const completedWorkouts = useMemo(() => workouts.filter(workout => workout.completed), [workouts]);

  return (
    <div className="report-container">
      <h1>User Info</h1>
      <div className="cards-container">
        {selectedUser && <UserCard user={selectedUser} />}
        <ReportCard title="Completed Exercises" items={completedExercises} type="completed exercises" />
        <ReportCard title="Completed Workouts" items={completedWorkouts} type="completed workouts" />
        <ReportCard title="Completed Diets" items={completedDiets} type="completed diets" />
      </div>
    </div>
  );
};

export default Report;

