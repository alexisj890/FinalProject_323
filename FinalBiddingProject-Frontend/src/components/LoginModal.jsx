import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase'; // Ensure correct paths
import { collection, query, where, getDocs } from 'firebase/firestore';
import './LoginModal.css';

function LoginModal({ isOpen, onClose, setCurrentUser }) {
  if (!isOpen) return null;

  const [identifier, setIdentifier] = useState(''); // Can be username or email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      let email = identifier;

      // Check if the identifier is not an email (assume it's a username)
      if (!identifier.includes('@')) {
        // Fetch email from Firestore based on username
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('username', '==', identifier));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError('Username not found');
          return;
        }

        const userDoc = querySnapshot.docs[0];
        email = userDoc.data().email; // Get email associated with the username
      }

      // Log in using email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch additional user data if needed
      const userDoc = await getDocs(query(collection(db, 'users'), where('email', '==', email)));
      const userData = userDoc.empty ? null : userDoc.docs[0].data();

      // Pass current user data to parent
      setCurrentUser({ ...user, username: userData?.username });

      console.log('Login successful');
      onClose(); // Close the modal
    } catch (error) {
      console.error('Login failed:', error.message);
      setError('Invalid username/email or password');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Username or Email:</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder="Enter your username or email"
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="submit-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
