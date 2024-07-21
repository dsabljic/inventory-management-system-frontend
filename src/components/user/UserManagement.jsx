import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UserService from "../../service/UserService";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await UserService.getAllUsers(token);
      console.log("response");
      console.log(response);
      console.log("response.users");
      console.log(response.users);
      setUsers(response.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete this user (id: ${userId})?`
      );

      const token = localStorage.getItem("token");
      if (confirmDelete) {
        await UserService.deleteUser(userId, token);
        fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Unable to delete user");
    }
  };

  const approveVerification = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await UserService.approveVerification(userId, token);
      fetchUsers();
    } catch (error) {
      console.error("Error approving verification:", error);
      alert("Unable to approve verification");
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "" ||
      (filterStatus === "PENDING_USER" && user.pendingUser && !user.verified) ||
      (filterStatus === "VERIFIED" && user.verified) ||
      (filterStatus === "ADMIN" && user.role === "ADMIN");

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="user-management-container">
      <h2>Users</h2>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginRight: '10px', padding: '5px', width: '200px' }}
        />
        <select value={filterStatus} onChange={handleFilterChange} style={{ padding: '5px', marginRight: '10px' }}>
          <option value="">All statuses</option>
          <option value="PENDING_USER">Pending User</option>
          <option value="VERIFIED">Verified</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
      <button className="reg-button">
        {" "}
        <Link to="/users/create">Add user</Link>
      </button>
      <table>
        <thead>
          <tr>
            {/* <th>ID</th> */}
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              {/* <td>{user.id}</td> */}
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
                <button>
                  <Link to={`/users/update/${user.id}`}>Update</Link>
                </button>
                <br />
                {user.pendingUser && !user.verified && (
                  <button onClick={() => approveVerification(user.id)}>
                    Approve Account
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
