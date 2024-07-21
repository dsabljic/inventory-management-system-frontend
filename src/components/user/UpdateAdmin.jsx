import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserService from "../../service/UserService";

function UpdateAdmin() {
  const navigate = useNavigate();
  const { adminId } = useParams();
  const [userData, setUserData] = useState({
    id: adminId,
    name: "",
    email: "",
    role: "ADMIN",
    verified: true,
  });

  useEffect(() => {
    fetchAdminData();
  }, [adminId]);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await UserService.getUserById(adminId, token);
      const { name, email } = response.user;
      setUserData({ id: adminId, name, email, role: "ADMIN", verified: true });
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const confirmUpdate = window.confirm("Are you sure you want to update your profile?");
      if (confirmUpdate) {
        const token = localStorage.getItem("token");
        await UserService.updateUser(adminId, userData, token);

        // Logout the user after profile update
        UserService.logout();
        navigate("/login");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Update Admin Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default UpdateAdmin;