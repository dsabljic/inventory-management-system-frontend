import React, { useState } from 'react';
import UserService from '../../service/UserService';

const VerificationPage = () => {
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');
  const pendingUser = localStorage.getItem('pendingUser') === 'true';
  const verified = localStorage.getItem('verified') === 'true';

  const handleResendVerification = async () => {
    try {
      const response = await UserService.resendVerificationEmail(token);
      setMessage('Verification email has been resent.');
    } catch (error) {
      setMessage('Failed to resend verification email.');
      console.error('Error resending verification email:', error);
    }
  };

  if (!pendingUser && !verified) {
    return (
      <div className="auth-container">
        <p>A verification email has been sent your way.</p>
        <button onClick={handleResendVerification} style={{ padding: '10px 20px', margin: '10px 0' }}>Resend verification link</button>
        {message && <p>{message}</p>}
      </div>
    );
  } else if (pendingUser && !verified) {
    return (
      <div>
        <p>Your verification is pending admin approval.</p>
      </div>
    );
  } else {
    return (
      <div>
        <p>Your account is verified.</p>
      </div>
    );
  }
};

export default VerificationPage;
