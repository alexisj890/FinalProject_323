import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

function Profile() {
  const [userData, setUserData] = useState(null);
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
          setUserData(userDoc.data());
        } else {
          console.error('User data not found in Firestore');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (!userData) {
    return <p>Loading...</p>;
  }

  let averageRating = null;
  if (userData.ratings && userData.ratings.length > 0) {
    const sum = userData.ratings.reduce((acc, val) => acc + val, 0);
    averageRating = (sum / userData.ratings.length).toFixed(2);
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Profile</h1>
      <p><strong>Username:</strong> {userData.username}</p>
      <p><strong>Email:</strong> {auth.currentUser.email}</p>
      <p><strong>Current Role:</strong> {userData.role === 'vip' ? 'VIP' : userData.role === 'user' ? 'Verified User' : 'Visitor'}</p>
      <p><strong>Current Balance:</strong> ${userData.balance?.toFixed(2) || '0.00'}</p>
      
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

      <div style={{ marginTop: '1.5rem' }}>
        <h2>Previous Transactions</h2>
        {userData.transactions && userData.transactions.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {userData.transactions.map((transaction, index) => (
              <li key={index} style={{ margin: '0.5rem 0', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
                <strong>{transaction.type}:</strong> ${transaction.amount.toFixed(2)} on {new Date(transaction.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No transactions yet.</p>
        )}
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h2>Cart</h2>
        <p>View your current cart and items you are bidding on.</p>
        <Link to="/cart" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
          Go to Cart
        </Link>
      </div>
    </div>
  );
}

export default Profile;
