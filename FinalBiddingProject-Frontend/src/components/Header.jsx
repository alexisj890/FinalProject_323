import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import './Header.css';

function Header({ onLoginClick, onRegisterClick, currentUser, setCurrentUser }) {
  const [username, setUsername] = React.useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      console.log('User logged out');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  return (
    <>
      <header className="header">
        <div className="hamburger-menu" onClick={toggleSidebar}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <h1 className="brand">
          <Link to="/" className="brand-link">TEAM R BIDDING</Link>
        </h1>
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
                <Link to="/profile" className="nav-username">
                  Welcome, {username || 'User'}
                </Link>
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
      </header>

      {sidebarOpen && (
        <div className="sidebar">
          <button className="close-sidebar" onClick={toggleSidebar}>&times;</button>
          <ul className="sidebar-links">
            <li>
              <Link to="/profile" onClick={toggleSidebar}>Profile</Link>
            </li>
            <li>
              <Link to="/withdraw" onClick={toggleSidebar}>Withdraw</Link>
            </li>
            <li>
              <Link to="/deposit" onClick={toggleSidebar}>Deposit</Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Header;
