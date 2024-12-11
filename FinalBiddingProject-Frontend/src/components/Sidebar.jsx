import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isOpen, toggleSidebar, currentUser }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-sidebar" onClick={toggleSidebar}>&times;</button>
      <ul className="sidebar-links">
        <li>
          <Link to="/" onClick={toggleSidebar}>Home</Link>
        </li>
        <li>
          <Link to="/items" onClick={toggleSidebar}>Items</Link>
        </li>
        {currentUser ? (
          <>
            <li>
              <Link to="/profile" onClick={toggleSidebar}>Profile</Link>
            </li>
            <li>
              <Link to="/verification-question" onClick={toggleSidebar}>Verification Question</Link>
            </li>
          </>
        ) : (
          <li>
            <p style={{ color: 'gray' }}>Login to access more features</p>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
