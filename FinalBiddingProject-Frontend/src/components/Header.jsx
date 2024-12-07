// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase'; // Ensure correct paths
import { doc, getDoc } from 'firebase/firestore';
import './Header.css';

function Header({ onLoginClick, onRegisterClick, currentUser, setCurrentUser }) {
  const [username, setUsername] = React.useState('');

  // Fetch the username from Firestore
  React.useEffect(() => {
    if (currentUser) {
      const fetchUsername = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUsername(userDoc.data().username);
          }
        } catch (error) {
          console.error('Error fetching username:', error);
        }
      };
      fetchUsername();
    }
  }, [currentUser]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null); // Clear the current user in parent state
      console.log('User logged out');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="header">
      <nav className="nav-bar">
        <h1 className="brand">TEAM R BIDDING</h1>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/items">Items</Link>
          </li>
          {currentUser ? (
            <>
              <li>
                <span>Welcome, {username || 'User'}</span>
              </li>
              <li>
                <button onClick={handleLogout} className="nav-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <button onClick={onLoginClick} className="nav-button">
                  Login
                </button>
              </li>
              <li>
                <button onClick={onRegisterClick} className="nav-button">
                  Register
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
