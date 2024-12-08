import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ onLoginClick, onRegisterClick, currentUser, onLogout }) {
  return (
    <header className="header">
      <nav className="nav-bar">
        <h1 className="brand">TEAM R BIDDING</h1>
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
                <span>Welcome, {currentUser.email}</span>
              </li>
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
