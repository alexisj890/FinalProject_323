// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Optional: Add your styles here

function Header({ onLoginClick, onRegisterClick }) {
  return (
    <header className="header">
      <nav className="nav-bar">
        <h1 className="brand">TEAM R BIDDING</h1>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/items">Items</Link></li>
          <li>
            <button onClick={onLoginClick} className="nav-button">Login</button>
          </li>
          <li>
            <button onClick={onRegisterClick} className="nav-button">Register</button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
