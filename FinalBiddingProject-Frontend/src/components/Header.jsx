import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header({ onLoginClick, onRegisterClick, currentUser }) {
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
                <span>Welcome, {currentUser.email}</span>
              </li>
              {/* Include a logout option or user dashboard link */}
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
