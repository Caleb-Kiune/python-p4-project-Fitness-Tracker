import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navigation.css'; // Make sure this import is already here

function Navigation() {
  return (
    <header>
      <h1>Fitness Tracker</h1>
      <nav>
        <ul>
          <li><Link to="/login">Login</Link></li> {/* Move Login link to the first position */}
          <li><Link to="/">Home</Link></li>
          <li><Link to="/workouts">Workouts</Link></li>
          <li><Link to="/add-workout">Custom</Link></li>
          <li><Link to="/details">Exercises</Link></li>
          <li><Link to="/report">Reports</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Navigation;
