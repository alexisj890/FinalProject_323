// src/components/LoginModal.jsx
import React, { useState } from 'react';
import './LoginModal.css'; // Optional: Add styles here

function LoginModal({ isOpen, onClose }) {
  if (!isOpen) return null; // Do not render if the modal is not open

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Perform login logic here
    if (!username || !password) {
      setError('Please enter both username and password');
    } else {
      setError('');
      console.log('Logging in with', { username, password });
      // Example success:
      onClose(); // Close the modal after successful login
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
