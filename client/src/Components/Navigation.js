import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaDumbbell, FaClipboard, FaSignInAlt, FaPlusSquare, FaListAlt } from 'react-icons/fa';
import '../styles/Navigation.css';

function Navigation() {
  const location = useLocation();

  return (
    <div className="navbar">
      <nav aria-label="Main Navigation">
        <ul role="menubar">
          <li role="none" className={location.pathname === "/login" ? "active" : ""}><Link to="/login" role="menuitem"><FaSignInAlt aria-hidden="true" /> <span>Login</span></Link></li>
          <li role="none" className={location.pathname === "/" ? "active" : ""}><Link to="/" role="menuitem"><FaHome aria-hidden="true" /> <span>Home</span></Link></li>
          <li role="none" className={location.pathname === "/workouts" ? "active" : ""}><Link to="/workouts" role="menuitem"><FaDumbbell aria-hidden="true" /> <span>Workouts</span></Link></li>
          <li role="none" className={location.pathname === "/add-workout" ? "active" : ""}><Link to="/add-workout" role="menuitem"><FaPlusSquare aria-hidden="true" /> <span>Custom</span></Link></li>
          <li role="none" className={location.pathname === "/details" ? "active" : ""}><Link to="/details" role="menuitem"><FaListAlt aria-hidden="true" /> <span>Exercises</span></Link></li>
          <li role="none" className={location.pathname === "/report" ? "active" : ""}><Link to="/report" role="menuitem"><FaClipboard aria-hidden="true" /> <span>Reports</span></Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Navigation;
