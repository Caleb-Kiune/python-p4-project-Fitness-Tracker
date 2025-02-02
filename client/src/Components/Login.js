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
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isLogin) {
      setCredentials({ ...credentials, [name]: value });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (isLogin) {
      if (!credentials.username) newErrors.username = 'Username is required';
      if (!credentials.password) newErrors.password = 'Password is required';
    } else {
      if (!newUser.username) newErrors.username = 'Username is required';
      if (!newUser.age) newErrors.age = 'Age is required';
      if (!newUser.weight) newErrors.weight = 'Weight is required';
      if (!newUser.gender) newErrors.gender = 'Gender is required';
      if (!newUser.height) newErrors.height = 'Height is required';
      if (!newUser.password) newErrors.password = 'Password is required';
      if (newUser.password !== newUser.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (isLogin) {
        // Handle login logic here (e.g., API call)
        console.log('Submitted login:', credentials);
      } else {
        // Handle sign-up logic here
        fetch('http://127.0.0.1:5555/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        })
        .then(response => response.json())
        .then(data => {
          console.log('User created:', data);
          // Handle successful user creation (e.g., show a success message or redirect)
        })
        .catch(error => {
          console.error('Error:', error);
          // Handle errors (e.g., show an error message)
        });
      }
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
          aria-label="Username"
          aria-required="true"
        />
        {errors.username && <div className="error">{errors.username}</div>}
        {!isLogin && (
          <>
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={newUser.age}
              onChange={handleInputChange}
              aria-label="Age"
              aria-required="true"
            />
            {errors.age && <div className="error">{errors.age}</div>}
            <input
              type="number"
              name="weight"
              placeholder="Weight"
              value={newUser.weight}
              onChange={handleInputChange}
              aria-label="Weight"
              aria-required="true"
            />
            {errors.weight && <div className="error">{errors.weight}</div>}
            <input
              type="text"
              name="gender"
              placeholder="Gender"
              value={newUser.gender}
              onChange={handleInputChange}
              aria-label="Gender"
              aria-required="true"
            />
            {errors.gender && <div className="error">{errors.gender}</div>}
            <input
              type="number"
              name="height"
              placeholder="Height"
              value={newUser.height}
              onChange={handleInputChange}
              aria-label="Height"
              aria-required="true"
            />
            {errors.height && <div className="error">{errors.height}</div>}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={newUser.password}
              onChange={handleInputChange}
              aria-label="Password"
              aria-required="true"
            />
            {errors.password && <div className="error">{errors.password}</div>}
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={newUser.confirmPassword}
              onChange={handleInputChange}
              aria-label="Confirm Password"
              aria-required="true"
            />
            {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
          </>
        )}
        {isLogin && (
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleInputChange}
            aria-label="Password"
            aria-required="true"
          />
        )}
        {errors.password && isLogin && <div className="error">{errors.password}</div>}
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>
    </div>
  );
};

export default Login;
