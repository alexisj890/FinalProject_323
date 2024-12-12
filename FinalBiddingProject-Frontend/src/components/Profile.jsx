import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, onSnapshot } from 'firebase/firestore';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [ongoingBids, setOngoingBids] = useState([]);
  const [itemsBought, setItemsBought] = useState([]);
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

  // Fetch transaction history (ongoing bids and items bought)
  useEffect(() => {
    if (!auth.currentUser) return; // Wait until the user is signed in

    const itemsRef = collection(db, 'items');
    const unsubscribe = onSnapshot(
      itemsRef,
      (snapshot) => {
        const allItems = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const userEmail = auth.currentUser.email;
        const now = new Date();

        // Ongoing bids: user is current highest bidder, item is live, not sold, and hasn't ended
        const userOngoingBids = allItems.filter(
          (item) =>
            item.curWinner === userEmail &&
            item.isLiveBid === true &&
            item.sold !== true &&
            item.endTime &&
            new Date(item.endTime) > now
        );

        // Items bought: user is the winner and the item is sold
        const userItemsBought = allItems.filter(
          (item) => item.sold === true && item.curWinner === userEmail
        );

        setOngoingBids(userOngoingBids);
        setItemsBought(userItemsBought);
      },
      (error) => {
        console.error('Error fetching items:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  if (!userData) {
    return <p>Loading...</p>;
  }

  const roleDisplay =
    userData.role === 'vip'
      ? 'VIP'
      : userData.role === 'user'
      ? 'Verified User'
      : 'Visitor';

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', textAlign: 'center' }}>
      <h1>Profile</h1>
      <p><strong>Username:</strong> {userData.username || 'N/A'}</p>
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

      <div style={{ marginTop: '2rem', textAlign: 'left' }}>
        <h2>Ongoing Bids</h2>
        {ongoingBids.length > 0 ? (
          <ul>
            {ongoingBids.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong> - Current Price: ${item.curPrice}, Ends: {new Date(item.endTime).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No ongoing bids at the moment.</p>
        )}

        <h2 style={{ marginTop: '2rem' }}>Items Bought</h2>
        {itemsBought.length > 0 ? (
          <ul>
            {itemsBought.map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong> - Final Price: ${item.curPrice}, Purchased On: {item.endTime ? new Date(item.endTime).toLocaleString() : 'N/A'}
              </li>
            ))}
          </ul>
        ) : (
          <p>You haven't bought any items yet.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
