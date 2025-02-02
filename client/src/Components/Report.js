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
  const [workouts, setWorkouts] = useState([]);
  const [completedDiets, setCompletedDiets] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const apiURL = 'http://127.0.0.1:5555/exercise';
  const dietURL = 'http://127.0.0.1:5555/diet';
  const userURL = 'http://127.0.0.1:5555/user';

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
    fetchData(userURL, (data) => setUsers(data.users));
  }, []);

  const completedWorkouts = useMemo(() => workouts.filter(workout => workout.completed), [workouts]);

  const handleUserSelection = (e) => {
    setSelectedUserId(e.target.value);
  };

  const selectedUser = users.find(user => user.id === parseInt(selectedUserId));

  return (
    <div className="report-container">
      <h1>User Info</h1>
      <div className="filter-container">
        <label htmlFor="user-select">Select User ID:</label>
        <select id="user-select" onChange={handleUserSelection} value={selectedUserId || ''}>
          <option value="">Select a User</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>
      </div>
      <div className="cards-container">
        {selectedUser && <UserCard user={selectedUser} />}
        <ReportCard title="Exercises" items={completedWorkouts} type="completed exercises" />
        <ReportCard title="Workouts" items={workouts} type="workouts" />
        <ReportCard title="Diets" items={completedDiets} type="completed diets" />
      </div>
    </div>
  );
};

export default Report;


