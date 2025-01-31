import React, { useState } from 'react';
import '../App.css'; 

function Details() {
  const [searchTerm, setSearchTerm] = useState('');
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    setIsLoading(true);
    setError('');
    fetch(`https://api.algobook.info/v1/gym/exercises/${searchTerm}`)
      .then(response => response.json())
      .then(data => {
        setExercises(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to fetch exercises. Please try again.');
        setIsLoading(false);
      });
  };

  return (
    <div className="details-container">
      <h2>View Exercises</h2>
      <div className="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search exercises"
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="exercise-list">
        {exercises.map((exercise, index) => (
          <div key={index} className="exercise-item">
            <p>
              {exercise.name} - {exercise.muscle} 
              <a href={exercise.infoLink} target="_blank" rel="noopener noreferrer">Details</a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Details;
