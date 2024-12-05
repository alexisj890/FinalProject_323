// frontend/src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:5000/users/pending', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => setPendingUsers(response.data))
      .catch((error) => console.error('Error fetching pending users:', error));
  }, []);

  const handleApprove = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://localhost:5000/users/${userId}/approve`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Update state to remove approved user
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      {/* Display pending users and provide approve/reject options */}
    </div>
  );
}

export default AdminDashboard;
