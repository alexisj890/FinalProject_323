import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        navigate('/');
        return;
      }

      try {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);

          if (data.ratings && data.ratings.length > 0) {
            const totalRating = data.ratings.reduce((acc, r) => acc + r.value, 0);
            setAverageRating((totalRating / data.ratings.length).toFixed(2));
          } else {
            setAverageRating(null);
          }
        } else {
          console.error('User data not found in Firestore');
          setUserData(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserData(null);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (!userData) {
    return <p>Loading...</p>;
  }

  let roleDisplay = 'Visitor';
  if (userData.role === 'user') roleDisplay = 'Verified User';
  if (userData.role === 'vip') roleDisplay = 'VIP';

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Profile</h1>
      <p><strong>Username:</strong> {userData.username}</p>
      <p><strong>Email:</strong> {auth.currentUser.email}</p>
      <p><strong>Current Role:</strong> {roleDisplay}</p>
      <p><strong>Current Balance:</strong> ${userData.balance?.toFixed(2) || '0.00'}</p>
      <p><strong>Transactions Completed:</strong> {userData.transactionCount || 0}</p>
      <p><strong>Complaints:</strong> {userData.complaintCount || 0}</p>

      {averageRating !== null ? (
        <div style={{ marginTop: '1.5rem' }}>
          <h2>Average Rating</h2>
          <p>{averageRating} / 5</p>
        </div>
      ) : (
        <div style={{ marginTop: '1.5rem' }}>
          <h2>Average Rating</h2>
          <p>No ratings yet.</p>
        </div>
      )}
    </div>
  );
}

export default Profile;
