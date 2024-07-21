import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RequestService from '../../service/RequestService';

const RequestForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { item } = location.state;

  const [formData, setFormData] = useState({
    startDate: '',
    requestedQuantity: '',
    reason: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: '',
    });
  };

  const validateField = (name, value) => {
    let error = '';
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (name === 'startDate') {
      const selectedDate = new Date(value);
      if (selectedDate < today) {
        error = 'Start date cannot be in the past';
      } else if (selectedDate.getTime() === today.getTime()) {
        error = 'Start date cannot be today';
      }
    }

    if (name === 'requestedQuantity' && parseInt(value) > item.availableQuantity) {
      error = 'Requested quantity cannot be greater than available quantity';
    }

    setErrors({
      ...errors,
      [name]: error,
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const validate = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(formData.startDate) < today) {
      newErrors.startDate = 'Start date cannot be in the past';
    } else if (new Date(formData.startDate).getTime() === today.getTime()) {
      newErrors.startDate = 'Start date cannot be today';
    }

    if (parseInt(formData.requestedQuantity) > item.availableQuantity) {
      newErrors.requestedQuantity = 'Requested quantity cannot be greater than available quantity';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const token = localStorage.getItem('token');
      await RequestService.createRequest({
        itemId: item.id,
        startDate: formData.startDate,
        requestedQuantity: formData.requestedQuantity,
        reason: formData.reason
      }, token);
      alert('Request submitted successfully');
      navigate('/user/requests');
    } catch (error) {
      console.error('Error creating request:', error);
      alert('An error occurred while creating the request');
    }
  };

  return (
    <div className="auth-container">
      <h2>Request a loan</h2>
      <p><strong>Item name:</strong> {item.name}</p>
      <p><strong>Available quantity:</strong> {item.availableQuantity}</p>
      <br />
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required
          />
          {errors.startDate && <p className="error-text" style={{ fontSize: '12px', color: 'red' }}>{errors.startDate}</p>}
        </div>
        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            name="requestedQuantity"
            value={formData.requestedQuantity}
            onChange={handleInputChange}
            onBlur={handleBlur}
            required
          />
          {errors.requestedQuantity && <p className="error-text" style={{ fontSize: '12px', color: 'red' }}>{errors.requestedQuantity}</p>}
        </div>
        <div className="form-group">
          <label>Reason:</label>
          <input
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" disabled={Object.keys(errors).some(key => errors[key])}>Submit a request</button>
      </form>
    </div>
  );
};

export default RequestForm;