import React from 'react';
import '../styles/Home.css';



function Home() {
  return (
    <div className="home">
      <h1>Welcome to Fitness Tracker</h1>
      <h4>Your journey to fitness starts here!</h4>
      <div className="quick-links">
        <h2>Quick Links</h2>
        <ul>
          <li><a href="/workouts">View Workouts</a></li>
          <li><a href="/add-workout">Add a Workout</a></li>
          <li><a href="/profile">Your Profile</a></li>
        </ul>
      </div>
      <div className="overview">
        <h2>Overview</h2>
        <p>Best 1 RM: 100KG</p>
        <p>Max Volume: 4200KG</p>
        <p>Achievements: 3</p>
      </div>
      <div className="motivational-quote">
        <h2>Stay Motivated</h2>
        <h4>"The only bad workout is the one that didn’t happen."</h4>
      </div>
    </div>
  );
}

export default Home;
