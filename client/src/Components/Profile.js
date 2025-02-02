// import React, { useState, useEffect } from 'react';
// import '../styles/Profile.css';

// const UserCard = ({ user, handleEdit, deleteUser }) => (
//   <div key={user.id} className="user-card">
//     <div className="user-initial">
//       {user.username.charAt(0)}
//     </div>
//     <div className="user-card-info">
//       <h2>{user.username}</h2>
//       <p><i className="fas fa-user"></i> Age: {user.age}</p>
//       <p><i className="fas fa-venus-mars"></i> Gender: {user.gender}</p>
//       <p><i className="fas fa-ruler-vertical"></i> Height: {user.height}</p>
//       <p><i className="fas fa-weight"></i> Current Weight: {user.current_weight}</p>
//       <button className="edit-button" onClick={() => handleEdit(user)}>Edit</button>
//       <button className="delete-button" onClick={() => deleteUser(user.id)}>Delete</button>
//     </div>
//   </div>
// );

// const UserList = ({ users, handleEdit, deleteUser }) => (
//   <div id="user-list">
//     {users.map(user => (
//       <UserCard key={user.id} user={user} handleEdit={handleEdit} deleteUser={deleteUser} />
//     ))}
//   </div>
// );

// const Profile = () => {
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await fetch("http://127.0.0.1:5555/user");
//       const data = await response.json();
//       setUsers(data.users);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error fetching users", error);
//       setError("Failed to fetch users.");
//       setIsLoading(false);
//     }
//   };

//   const handleEdit = (user) => {
//     // Handle edit functionality
//   };

//   const deleteUser = async (id) => {
//     try {
//       await fetch(`http://127.0.0.1:5555/user/${id}`, {
//         method: "DELETE",
//       });
//       fetchUsers();
//     } catch (error) {
//       console.error("Error deleting user", error);
//       setError("Failed to delete user.");
//     }
//   };

//   return (
//     <div id="user-management">
//       <h1 id="user-management-title">User Management</h1>
//       {error && <p className="error">{error}</p>}
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <UserList users={users} handleEdit={handleEdit} deleteUser={deleteUser} />
//       )}
//     </div>
//   );
// };

// export default Profile;
