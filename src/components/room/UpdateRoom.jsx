import React, { useState, useEffect } from 'react';
import RoomService from '../../service/RoomService';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    building: '',
    floor: '',
    totalDesks: ''
  });

  useEffect(() => {
    fetchRoomDataById(roomId);
  }, [roomId]);

  const fetchRoomDataById = async (roomId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await RoomService.getRoomById(roomId, token);
      setFormData(response);
    } catch (error) {
      console.error('Error fetching room data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await RoomService.updateRoom(roomId, formData, token);
      navigate('/rooms');
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  return (
    <div className="auth-container">
      <h2>Update room</h2>
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
        <button type="submit">Update room</button>
      </form>
    </div>
  );
};

export default UpdateRoom;