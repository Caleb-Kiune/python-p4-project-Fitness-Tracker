import React, { useState, useEffect } from "react";
import '../styles/Profile.css';

const Profile = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5555/user");
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleEdit = (user) => {
    // Handle edit functionality
  };

  const deleteUser = async (id) => {
    try {
      await fetch(`http://127.0.0.1:5555/user/${id}`, {
        method: "DELETE",
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  return (
    <div id="user-management">
      <h1 id="user-management-title">User Management</h1>
      <div id="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-initial">
              {user.username.charAt(0)}
            </div>
            <div className="user-card-info">
              <h2>{user.username}</h2>
              <p><i className="fas fa-user"></i> Age: {user.age}</p>
              <p><i className="fas fa-venus-mars"></i> Gender: {user.gender}</p>
              <p><i className="fas fa-ruler-vertical"></i> Height: {user.height}</p>
              <p><i className="fas fa-weight"></i> Current Weight: {user.current_weight}</p>
              <button className="edit-button" onClick={() => handleEdit(user)}>Edit</button>
              <button className="delete-button" onClick={() => deleteUser(user.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
