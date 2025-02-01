import React, { useState } from 'react';
import '../styles/Login.css'; // Import the CSS file

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // Default to Login form
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [newUser, setNewUser] = useState({
    username: '',
    age: '',
    weight: '',
    gender: '',
    height: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isLogin) {
      setCredentials({ ...credentials, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      // Handle login logic here (e.g., API call)
      console.log('Submitted login:', credentials);
    } else {
      // Handle sign-up logic here (e.g., API call)
      console.log('Submitted sign-up:', newUser);
    }
  };

  const showLoginForm = () => {
    setIsLogin(true);
  };

  const showSignUpForm = () => {
    setIsLogin(false);
  };

  return (
    <div className="login-container">
      <div className="toggle-buttons">
        <button onClick={showLoginForm} className={isLogin ? 'active' : ''}>
          Login
        </button>
        <button onClick={showSignUpForm} className={!isLogin ? 'active' : ''}>
          Sign Up
        </button>
      </div>
      <form onSubmit={handleSubmit} className="login-form">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={isLogin ? credentials.username : newUser.username}
          onChange={handleInputChange}
        />
        {!isLogin && (
          <>
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={newUser.age}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="weight"
              placeholder="Weight"
              value={newUser.weight}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="gender"
              placeholder="Gender"
              value={newUser.gender}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="height"
              placeholder="Height"
              value={newUser.height}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={newUser.password}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={newUser.confirmPassword}
              onChange={handleInputChange}
            />
          </>
        )}
        {isLogin && (
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleInputChange}
          />
        )}
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
    </div>
  );
};

export default Login;
