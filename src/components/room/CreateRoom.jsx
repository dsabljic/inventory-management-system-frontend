import React, { useState } from 'react';
import RoomService from '../../service/RoomService';
import { useNavigate } from 'react-router-dom';

const CreateRoom = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    building: '',
    floor: '',
    totalDesks: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await RoomService.createRoom(formData, token);
      navigate('/rooms');
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Add new room</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Building:</label>
          <input
            type="text"
            name="building"
            value={formData.building}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Floor:</label>
          <input
            type="number"
            name="floor"
            value={formData.floor}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Total desks:</label>
          <input
            type="number"
            name="totalDesks"
            value={formData.totalDesks}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Add room</button>
      </form>
    </div>
  );
};

export default CreateRoom;