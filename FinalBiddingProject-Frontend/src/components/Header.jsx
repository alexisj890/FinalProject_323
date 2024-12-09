import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase'; // Ensure correct paths
import { doc, getDoc } from 'firebase/firestore';
import './Header.css';

<<<<<<< HEAD
function Header({ onLoginClick, onRegisterClick, currentUser, onLogout }) {
=======
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

>>>>>>> 8cabb40dfcd9c23c64848d3bd6c15fc2e49301c4
  return (
    <header className="header">
      <nav className="nav-bar">
        <h1 className="brand">
          <Link to="/" className="brand-link">TEAM R BIDDING</Link>
        </h1>
        <ul className="nav-links">
          {/* Navigation Links */}
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/items">Items</Link>
          </li>
          {currentUser ? (
            <>
              {/* Welcome Message */}
              <li>
                <Link to="/profile" className="nav-username">
                  Welcome, {username || 'User'}
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="nav-button">
                  Logout
                </button>
              </li>
<<<<<<< HEAD
              {/* Create Item Link */}
              <li>
                <Link to="/create-item" className="nav-button">
                  Create Listing
                </Link>
              </li>
              {/* Logout Button */}
              <li>
                <button onClick={onLogout} className="nav-button">
                  Logout
                </button>
              </li>
=======
>>>>>>> 8cabb40dfcd9c23c64848d3bd6c15fc2e49301c4
            </>
          ) : (
            <>
              {/* Login and Register Buttons */}
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
