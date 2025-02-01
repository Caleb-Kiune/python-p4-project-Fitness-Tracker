import React from 'react';
import '../styles/Home.css';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function Home() {
  return (
    <div className="home lazyload" data-bg="url('/public/pexels-leonardho-1552242.jpg')" role="main">
      <div className="welcome">
        <h1>Welcome to Fitness Tracker</h1>
        <h4>Your journey to fitness starts here!</h4>
      </div>
      <div className="quick-links" role="navigation" aria-label="Quick Links">
        <h2>Quick Links</h2>
        <ul>
          <li><Link to="/workouts" aria-label="View Workouts"><i className="fas fa-dumbbell"></i> View Workouts</Link></li>
          <li><Link to="/add-workout" aria-label="Add a Workout"><i className="fas fa-plus"></i> Add a Workout</Link></li>
          <li><Link to="/profile" aria-label="Your Profile"><i className="fas fa-user"></i> Your Profile</Link></li>
        </ul>
      </div>
      <div className="motivational-quote" role="contentinfo">
        <h2>Stay Motivated</h2>
        <h4>"The only bad workout is the one that didn’t happen."</h4>
      </div>
    </div>
  );
}

export default Home;
