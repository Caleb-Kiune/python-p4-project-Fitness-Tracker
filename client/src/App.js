import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './Components/Navigation';
import Workouts from './Components/Workouts';
import Details from './Components/Details';
import CustomWorkouts from './Components/CustomWorkouts';
import Report from './Components/Report';
import Home from './Components/Home';
import './App.css';
import Login from './Components/Login';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5555/user')
      .then(response => response.json())
      .then(data => setUsers(data.users))  
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Navigation />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/add-workout" element={<CustomWorkouts />} />
          <Route path="/details" element={<Details />} />
          <Route path="/report" element={<Report />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/users" element={<UserList users={users} />} />  {/* Display user data */}
        </Routes>
      </div>
    </Router>
  );
}

// Example component to display users
function UserList({ users }) {
  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} - {user.current_weight} - {user.target_weight}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
