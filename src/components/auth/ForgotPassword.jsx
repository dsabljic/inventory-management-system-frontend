import React, { useState } from 'react';
import UserService from '../../service/UserService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await UserService.forgotPassword(email);
      setMessage(res);
      setError('');
    } catch (error) {
      setError('Failed to send reset email.');
      setMessage('');
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Send reset link</button>
      </form>
      {message && <p className="message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ForgotPassword;