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
    </div>
  </div>
);

const ReportItem = ({ name, sets, reps, description }) => (
  <li className="report-item">
    {name}: {sets && `${sets} sets x ${reps} reps`} {description && description}
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
  const [selectedUser, setSelectedUser] = useState(null);
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

    fetchData(usersURL, (data) => {
      setUsers(data);
      if (data.length > 0) {
        setSelectedUser(data[data.length - 1]);
      }
    });
  }, []);
  const handleUserChange = (e) => {
    const userId = e.target.value;
    const user = users.find((user) => user.id === parseInt(userId));
    setSelectedUser(user);
  };

  useEffect(() => {
    if (selectedUser) {
      fetch(`http://127.0.0.1:5555/user_workout_assignments?user_id=${selectedUser.id}`)
        .then(response => response.json())
        .then(data => {
          const workoutIds = data.filter(a => a.completed).map(a => a.workout_id);
          fetch(`http://127.0.0.1:5555/workouts`)
            .then(response => response.json())
            .then(workoutsData => {
              const userWorkouts = workoutsData.filter(workout => workoutIds.includes(workout.id));
              setWorkouts(userWorkouts);
            });
        })
        .catch(error => console.error('Error fetching workout assignments:', error));

      fetch(`http://127.0.0.1:5555/user_diet_assignments?user_id=${selectedUser.id}`)
        .then(response => response.json())
        .then(data => {
          const dietIds = data.filter(a => a.completed).map(a => a.diet_id);
          fetch(`http://127.0.0.1:5555/diets`)
            .then(response => response.json())
            .then(dietsData => {
              const userDiets = dietsData.filter(diet => dietIds.includes(diet.id));
              setCompletedDiets(userDiets);
            });
        })
        .catch(error => console.error('Error fetching diet assignments:', error));
    } else {
      setWorkouts([]);
      setCompletedDiets([]);
    }
  }, [selectedUser]);
  return (
    <div className="report-container">
      <h1>User Info</h1>
      <div className="filter-container">
        <select id="user-select" className="select-user" value={selectedUser ? selectedUser.id : ''} onChange={handleUserChange}>
          <option value="" disabled>Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>
      </div>
      <div className="cards-container">
        {selectedUser && <UserCard user={selectedUser} />}
        <ReportCard title="Completed Workouts" items={workouts} type="completed workouts" />
        <ReportCard title="Completed Diets" items={completedDiets} type="completed diets" />
      </div>
    </div>
  );
};

export default Report;


