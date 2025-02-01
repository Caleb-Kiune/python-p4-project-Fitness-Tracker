import React, { useState, useEffect } from "react";
import '../styles/Profile.css';


const Profile = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    age: "",
    current_weight: "",
    gender: "",
    height: "",
    profile_picture: "",
    target_weight: "",
    username: "",
  });
  const [editingUser, setEditingUser] = useState(null); // State for editing

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (editingUser) {
        await fetch(`http://127.0.0.1:5555/user/${editingUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });
      } else {
        await fetch("http://127.0.0.1:5555/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
        });
      }
      fetchUsers();
      setNewUser({
        age: "",
        current_weight: "",
        gender: "",
        height: "",
        profile_picture: "",
        target_weight: "",
        username: "",
      });
      setEditingUser(null); // Reset editing user state
    } catch (error) {
      console.error("Error saving user", error);
    }
  };

  const handleEdit = (user) => {
    setNewUser({
      age: user.age,
      current_weight: user.current_weight,
      gender: user.gender,
      height: user.height,
      profile_picture: user.profile_picture,
      target_weight: user.target_weight,
      username: user.username,
    });
    setEditingUser(user);
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
      <div id="user-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={newUser.username}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="age"
          placeholder="Age"
          value={newUser.age}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="current_weight"
          placeholder="Current Weight"
          value={newUser.current_weight}
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
          type="text"
          name="height"
          placeholder="Height"
          value={newUser.height}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="profile_picture"
          placeholder="Profile Picture URL"
          value={newUser.profile_picture}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="target_weight"
          placeholder="Target Weight"
          value={newUser.target_weight}
          onChange={handleInputChange}
        />
        <button id="add-user-button" onClick={handleSubmit}>
          {editingUser ? "Save Changes" : "Add User"}
        </button>
      </div>
      <div id="user-list">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            <img
              src={user.profile_picture}
              alt={`${user.username}'s profile`}
              className="user-card-img"
            />
            <div className="user-card-info">
              <h2>{user.username}</h2>
              <p>Age: {user.age}</p>
              <p>Gender: {user.gender}</p>
              <p>Height: {user.height}</p>
              <p>Current Weight: {user.current_weight}</p>
              <p>Target Weight: {user.target_weight}</p>
              <button className="edit-button" onClick={() => handleEdit(user)}>
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => deleteUser(user.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
