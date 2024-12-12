import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, collection, onSnapshot } from 'firebase/firestore';
import './ItemCard.css'; // Reuse the same CSS for styling cards

function Profile() {
  const [userData, setUserData] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [ongoingBids, setOngoingBids] = useState([]);
  const [liveBidsWon, setLiveBidsWon] = useState([]);
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

          // Calculate average rating based on ratings array
          if (data.ratings && data.ratings.length > 0) {
            const totalRating = data.ratings.reduce((acc, r) => acc + r.value, 0);
            setAverageRating((totalRating / data.ratings.length).toFixed(2));
          } else {
            setAverageRating(null); // No ratings yet
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

        // Live Bids Won: user is winner, item is live bid, and sold == true
        const userLiveBidsWon = allItems.filter(
          (item) =>
            item.isLiveBid === true &&
            item.sold === true &&
            item.curWinner === userEmail
        );

        // Items Bought (Regular): user is winner, item is not a live bid, and sold == true
        const userItemsBought = allItems.filter(
          (item) =>
            (item.isLiveBid !== true) &&
            item.sold === true &&
            item.curWinner === userEmail
        );

        setOngoingBids(userOngoingBids);
        setLiveBidsWon(userLiveBidsWon);
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

  const renderItemsAsCards = (itemsArray) => {
    if (itemsArray.length === 0) return <p>No items available.</p>;

    return (
      <div className="item-listings-grid">
        {itemsArray.map((item) => {
          const itemPrice = item.curPrice || item.price || 0;
          return (
            <div className="item-card" key={item.id}>
              <img src={item.imageUrl} alt={item.title} />
              <h3>{item.title}</h3>
              <p className="price">${itemPrice}</p>
              <div className="button-container">
                <Link to={`/items/${item.id}`} className="view-details-button">
                  View Details
                </Link>
                <Link to={`/items/${item.id}/comments`} className="view-comments-link">
                  View Comments
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', textAlign: 'center' }}>
      <h1>Profile</h1>
      <p><strong>Username:</strong> {userData.username || 'N/A'}</p>
      <p><strong>Email:</strong> {auth.currentUser.email}</p>
      <p><strong>Current Role:</strong> {roleDisplay}</p>
      <p><strong>Current Balance:</strong> ${userData.balance?.toFixed(2) || '0.00'}</p>

      {averageRating !== null ? (
        <div style={{ marginTop: '1.5rem' }}>
          <h2>Average Rating</h2>
          <p>{averageRating} / 5.00</p>
        </div>
      ) : (
        <div style={{ marginTop: '1.5rem' }}>
          <h2>Average Rating</h2>
          <p>No ratings yet.</p>
        </div>
      )}

      <div style={{ marginTop: '2rem', textAlign: 'left' }}>
        <h2>Ongoing Bids</h2>
        {renderItemsAsCards(ongoingBids)}

        <h2 style={{ marginTop: '2rem' }}>Live Bids Won</h2>
        {renderItemsAsCards(liveBidsWon)}

        <h2 style={{ marginTop: '2rem' }}>Items Bought</h2>
        {renderItemsAsCards(itemsBought)}
      </div>
    </div>
  );
}

export default Profile;
