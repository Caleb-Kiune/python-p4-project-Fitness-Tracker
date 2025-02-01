import React, { useState, useEffect } from 'react';
import '../styles/CustomWorkouts.css';


function CustomWorkouts() {
  const [workout, setWorkout] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    category: 'Chest',
    day: 'Monday',
    completed: false 
  });
  const [workoutList, setWorkoutList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const apiURL = 'http://127.0.0.1:5555/exercise';

  useEffect(() => {
    fetch(apiURL)
      .then(response => response.json())
      .then(data => setWorkoutList(data.exercises))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleChange = (e) => {
    setWorkout({
      ...workout,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, sets, reps, weight } = workout;

    if (!name || !sets || !reps || !weight) {
      alert('Please fill in all fields');
      return;
    }

    let updatedList;
    if (isEditing) {
      const updatedWorkout = { ...workout, id: workoutList[editingIndex].id };
      updatedList = workoutList.map((item, index) =>
        index === editingIndex ? updatedWorkout : item
      );

      fetch(`${apiURL}/${updatedWorkout.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedWorkout),
      })
        .then(() => setIsEditing(false))
        .catch(error => console.error('Error updating data:', error));

      setEditingIndex(null);
    } else {
      const newWorkout = { ...workout, id: Date.now() };
      updatedList = [...workoutList, newWorkout];

      fetch(apiURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newWorkout),
      })
        .catch(error => console.error('Error adding data:', error));
    }

    setWorkoutList(updatedList);
    setWorkout({ name: '', sets: '', reps: '', weight: '', category: 'Chest', day: 'Monday', completed: false });
  };

  const handleEdit = (index) => {
    setWorkout(workoutList[index]);
    setIsEditing(true);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const workoutToDelete = workoutList[index];
    const updatedList = workoutList.filter((_, i) => i !== index);

    fetch(`${apiURL}/${workoutToDelete.id}`, {
      method: 'DELETE',
    })
      .then(() => setWorkoutList(updatedList))
      .catch(error => console.error('Error deleting data:', error));
  };

  const toggleComplete = (index) => {
    const updatedWorkout = { ...workoutList[index], completed: !workoutList[index].completed };
    const updatedList = workoutList.map((workout, i) =>
      i === index ? updatedWorkout : workout
    );

    fetch(`${apiURL}/${updatedWorkout.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedWorkout),
    })
      .catch(error => console.error('Error updating data:', error));

    setWorkoutList(updatedList);
  };

  return (
    <div className="custom-workouts-container">
      <form onSubmit={handleSubmit} className="custom-workouts-form">
        <h2>{isEditing ? 'Edit Workout' : 'Add Custom Exercise'}</h2>
        <div className="form-row">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={workout.name}
            onChange={handleChange}
          />
          <input
            type="number"
            name="sets"
            placeholder="Sets"
            value={workout.sets}
            onChange={handleChange}
          />
          <input
            type="number"
            name="reps"
            placeholder="Reps"
            value={workout.reps}
            onChange={handleChange}
          />
          <input
            type="number"
            name="weight"
            placeholder="Weight"
            value={workout.weight}
            onChange={handleChange}
          />
          <select name="category" value={workout.category} onChange={handleChange}>
            <option value="Chest">Chest</option>
            <option value="Back">Back</option>
            <option value="Legs">Legs</option>
            <option value="Arms">Arms</option>
            <option value="Shoulders">Shoulders</option>
          </select>
          <select name="day" value={workout.day} onChange={handleChange}>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
        </div>
        <button type="submit">{isEditing ? 'Save Changes' : 'Add Exercise'}</button>
      </form>

      <div className="workout-list">
        <h3>Exercises</h3>
        {workoutList.map((workout, index) => (
          <div key={index} className={`custom-workout-card ${workout.completed ? 'completed' : ''}`}>
            <h3>{workout.name}</h3>
            <p>Sets: {workout.sets}</p>
            <p>Reps: {workout.reps}</p>
            <p>Weight: {workout.weight}</p>
            <p>Category: {workout.category}</p>
            <p>Day: {workout.day}</p>
            <button onClick={() => toggleComplete(index)}>
              {workout.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
            </button>
            <button onClick={() => handleEdit(index)}>Edit</button>
            <button onClick={() => handleDelete(index)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomWorkouts;
