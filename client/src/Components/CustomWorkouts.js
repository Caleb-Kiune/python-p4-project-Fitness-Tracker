// Part 1: Imports and Initial Setup

import React, { useState, useEffect } from 'react';
import '../styles/CustomWorkouts.css';

function CustomWorkouts() {
  // State variables
  const [workout, setWorkout] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    category: 'Chest',
    day: 'Monday',
    completed: false,
    user_id: null,
  });
  const [workoutList, setWorkoutList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  // API URLs
  const apiURL = 'http://127.0.0.1:5555/custom_exercises';
  const usersURL = 'http://127.0.0.1:5555/users';
  // Part 2: Fetching Data with useEffect

useEffect(() => {
  // Fetch custom exercises
  fetch(apiURL)
    .then(response => response.json())
    .then(data => setWorkoutList(data.exercises))
    .catch(error => console.error('Error fetching exercises:', error));

  // Fetch users
  fetch(usersURL)
    .then(response => response.json())
    .then(data => setUsers(data))
    .catch(error => console.error('Error fetching users:', error));
}, []);
// Part 3: Handling Input Changes

const handleChange = (e) => {
  setWorkout({
    ...workout,
    [e.target.name]: e.target.value,
  });
};

const handleUserChange = (e) => {
  setSelectedUser(e.target.value);
};
// Part 4: Submitting the Form

const handleSubmit = (e) => {
  e.preventDefault();
  const { name, sets, reps, weight } = workout;

  if (!name || !sets || !reps || !weight) {
    alert('Please fill in all fields');
    return;
  }

  if (isEditing) {
    // Editing an existing workout
    const updatedWorkout = { ...workout, id: editingId };
    fetch(`${apiURL}/${editingId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedWorkout),
    })
      .then(response => response.json())
      .then(data => {
        const updatedList = workoutList.map((item) =>
          item.id === data.id ? data : item
        );
        setWorkoutList(updatedList);
        setIsEditing(false);
        setEditingId(null);
        resetForm();
      })
      .catch(error => console.error('Error updating data:', error));
  } else {
    // Adding a new workout
    fetch(apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workout),
    })
      .then(response => response.json())
      .then(data => {
        setWorkoutList([data, ...workoutList]);
        resetForm();
      })
      .catch(error => console.error('Error adding data:', error));
  }
};

// Helper function to reset the form
const resetForm = () => {
  setWorkout({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    category: 'Chest',
    day: 'Monday',
    completed: false,
    user_id: null,
  });
};
// Part 5: Editing and Deleting Exercises

// Handle editing an exercise
const handleEdit = (exercise) => {
  setWorkout({
    name: exercise.name,
    sets: exercise.sets,
    reps: exercise.reps,
    weight: exercise.weight,
    category: exercise.category,
    day: exercise.day,
    completed: exercise.completed,
    user_id: exercise.user_id,
  });
  setIsEditing(true);
  setEditingId(exercise.id);
};

// Handle deleting an exercise
const handleDelete = (id) => {
  fetch(`${apiURL}/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      const updatedList = workoutList.filter((item) => item.id !== id);
      setWorkoutList(updatedList);
    })
    .catch(error => console.error('Error deleting data:', error));
};
// Part 6: Toggling Exercise Completion

const toggleComplete = (exercise) => {
  let updatedExercise;

  if (exercise.completed) {
    // Undo completion
    updatedExercise = {
      ...exercise,
      completed: false,
      user_id: null, // Remove the user assignment
    };
  } else {
    // Complete the exercise
    if (!selectedUser) {
      alert('Please select a user before marking as complete.');
      return;
    }
    updatedExercise = {
      ...exercise,
      completed: true,
      user_id: selectedUser,
    };
  }

  fetch(`${apiURL}/${exercise.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedExercise),
  })
    .then(response => response.json())
    .then((data) => {
      const updatedList = workoutList.map((item) =>
        item.id === data.id ? data : item
      );
      setWorkoutList(updatedList);
    })
    .catch(error => console.error('Error updating data:', error));
};
// Part 7: Rendering the Component

return (
  <div className="custom-workouts-container">
    {/* Form for adding/editing exercises */}
    <form onSubmit={handleSubmit} className="custom-workouts-form">
      <h2>{isEditing ? 'Edit Workout' : 'Add Custom Exercise'}</h2>
      <div className="form-row">
        {/* User selection dropdown */}
        <select
          name="user"
          value={selectedUser}
          onChange={handleUserChange}
          className="select-user"
        >
          <option value="" disabled>Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>
        {/* Input fields */}
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

    {/* List of exercises */}
    <div className="workout-list">
      {workoutList.map((exercise) => (
        <div
          key={exercise.id}
          className={`exercise-item ${exercise.completed ? 'completed' : ''}`}
        >
          <div className="content-item">
            <p><strong>Name:</strong> {exercise.name}</p>
          </div>
          <div className="content-item">
            <p><strong>Category:</strong> {exercise.category}</p>
          </div>
          <div className="content-item">
            <p><strong>Day:</strong> {exercise.day}</p>
          </div>
          <div className="content-item">
            <p><strong>Details:</strong> {exercise.sets} sets x {exercise.reps} reps at {exercise.weight} kg</p>
          </div>
          {exercise.completed && exercise.username && (
            <div className="content-item">
              <p><strong>Completed by:</strong> {exercise.username}</p>
            </div>
          )}
          <div className="buttons-container">
            <div className="buttons">
              <button
                onClick={() => toggleComplete(exercise)}
                disabled={!exercise.completed && !selectedUser}
              >
                {exercise.completed ? 'Undo' : 'Complete'}
              </button>
              <button onClick={() => handleEdit(exercise)}>Edit</button>
              <button onClick={() => handleDelete(exercise.id)}>Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
// Part 8: Exporting the Component

}

export default CustomWorkouts;









  // Continue to Part 2...
