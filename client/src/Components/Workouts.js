import React, { useState, useEffect } from 'react';
import '../styles/Workouts.css';

const muscleGroups = ['Chest', 'Back', 'Legs', 'Arms', 'Shoulders'];

function Workouts() {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [diets, setDiets] = useState({});
  const [users, setUsers] = useState([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);
  const [loadingDiets, setLoadingDiets] = useState(false);
  const [error, setError] = useState(null);

  // Fetch users
  useEffect(() => {
    fetch('http://127.0.0.1:5555/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  // Fetch workouts and diets based on selected muscle group
  useEffect(() => {
    if (selectedGroup) {
      setLoadingWorkouts(true);
      fetch(`http://127.0.0.1:5555/workouts?category=${selectedGroup}`)
        .then(response => response.json())
        .then(data => {
          setWorkouts(data);
          setLoadingWorkouts(false);
        })
        .catch(error => {
          console.error('Error fetching workouts:', error);
          setLoadingWorkouts(false);
        });

      setLoadingDiets(true);
      fetch(`http://127.0.0.1:5555/diets?category=${selectedGroup}`)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            const randomDiet = data[Math.floor(Math.random() * data.length)];
            setDiets(prevDiets => ({
              ...prevDiets,
              [selectedGroup]: randomDiet
            }));
          } else {
            setDiets(prevDiets => ({
              ...prevDiets,
              [selectedGroup]: null
            }));
          }
          setLoadingDiets(false);
        })
        .catch(error => {
          console.error('Error fetching diets:', error);
          setLoadingDiets(false);
        });
    }
  }, [selectedGroup]);
  const handleButtonClick = (muscleGroup) => {
    setSelectedGroup(selectedGroup === muscleGroup ? '' : muscleGroup);
  };

  const handleUserSelect = (e) => {
    setSelectedUser(e.target.value);
  };

  const markWorkoutAsDone = (workout) => {
    if (!selectedUser) {
      alert('Please select a user first.');
      return;
    }

    if (!workout.assignmentId) {
      // Assign the workout
      fetch('http://127.0.0.1:5555/user_workout_assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: parseInt(selectedUser),
          workout_id: workout.id,
          completed: true, // Set completed to true
        }),
      })
        .then(response => response.json())
        .then(data => {
          setWorkouts(prevWorkouts =>
            prevWorkouts.map(w =>
              w.id === workout.id ? { ...w, assignmentId: data.id, completed: data.completed } : w
            )
          );
        })
        .catch(error => {
          console.error('Error assigning workout:', error);
        });
    } else {
      // Toggle the completed status instead of unassigning
      fetch(`http://127.0.0.1:5555/user_workout_assignments/${workout.assignmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !workout.completed, // Toggle completed status
        }),
      })
        .then(response => response.json())
        .then(data => {
          setWorkouts(prevWorkouts =>
            prevWorkouts.map(w =>
              w.id === workout.id ? { ...w, completed: data.completed } : w
            )
          );
        })
        .catch(error => {
          console.error('Error updating workout assignment:', error);
        });
    }
  };

  const markDietAsDone = (diet) => {
    if (!selectedUser) {
      alert('Please select a user first.');
      return;
    }

    if (!diet.assignmentId) {
      // Assign the diet
      fetch('http://127.0.0.1:5555/user_diet_assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: parseInt(selectedUser),
          diet_id: diet.id,
          completed: true, // Set completed to true
        }),
      })
        .then(response => response.json())
        .then(data => {
          setDiets(prevDiets => ({
            ...prevDiets,
            [selectedGroup]: { ...diet, assignmentId: data.id, completed: data.completed }
          }));
        })
        .catch(error => {
          console.error('Error assigning diet:', error);
        });
    } else {
      // Toggle the completed status instead of unassigning
      fetch(`http://127.0.0.1:5555/user_diet_assignments/${diet.assignmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !diet.completed, // Toggle completed status
        }),
      })
        .then(response => response.json())
        .then(data => {
          setDiets(prevDiets => ({
            ...prevDiets,
            [selectedGroup]: { ...diet, completed: data.completed }
          }));
        })
        .catch(error => {
          console.error('Error updating diet assignment:', error);
        });
    }
  };
  return (
    <div className="workouts">
      <h2 className="workouts-heading">Workouts by Muscle Group</h2>
      <div className="muscle-group-buttons">
        <select className="user-select" onChange={handleUserSelect} value={selectedUser}>
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
        {muscleGroups.map(muscleGroup => (
          <button 
            key={muscleGroup} 
            className={`muscle-group-button ${selectedGroup === muscleGroup ? 'selected' : ''}`}
            onClick={() => handleButtonClick(muscleGroup)}
          >
            {muscleGroup}
          </button>
        ))}
      </div>
      {selectedGroup && (
        <div className="card-row">
          {loadingWorkouts ? (
            <p>Loading workouts...</p>
          ) : (
            workouts
              .filter(workout => workout.category === selectedGroup)
              .slice(0, 1)
              .map(workout => (
                <div key={workout.id} className={`card workout-card ${workout.completed ? 'completed' : ''}`}>
                  <h4>{workout.name}</h4>
                  <p><strong>{workout.sets} Sets</strong> of <strong>{workout.reps} Reps</strong></p>
                  <button onClick={() => markWorkoutAsDone(workout)} disabled={!selectedUser}>
                    {workout.completed ? 'Undo' : 'Complete'}
                  </button>
                </div>
              ))
          )}
          {loadingDiets ? (
            <p>Loading diets...</p>
          ) : (
            diets[selectedGroup] && (
              <div className={`card diet-card ${diets[selectedGroup].completed ? 'completed' : ''}`}>
                <h4><strong>Diet Recommendation</strong></h4>
                <p>{diets[selectedGroup].name}</p>
                <p>{diets[selectedGroup].description}</p>
                <button onClick={() => markDietAsDone(diets[selectedGroup])} disabled={!selectedUser}>
                  {diets[selectedGroup].completed ? 'Undo' : 'Complete'}
                </button>
              </div>
            )
          )}
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default Workouts;


