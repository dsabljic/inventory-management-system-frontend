import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import UserService from '../../service/UserService';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmNewPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const res = await UserService.resetPassword(token, formData.newPassword);
      setMessage(res);
      setError('');
      navigate('/login');
    } catch (error) {
      setError('Failed to reset password.');
      setMessage('');
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>New password:</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm new password:</label>
          <input
            type="password"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Reset password</button>
      </form>
      <br />
      {message && <p className="message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ResetPassword;