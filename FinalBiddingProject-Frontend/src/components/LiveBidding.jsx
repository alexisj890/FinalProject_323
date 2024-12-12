import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import BiddingRoom from './BiddingRoom';

const LiveBidding = ({ currentUser }) => {
  const [vipItems, setVipItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      alert('Please log in to access Live Bidding.');
      navigate('/');
      return;
    }

    if (!currentUser.role || currentUser.role.toLowerCase() !== 'vip') {
      alert('Access restricted to VIP members.');
      navigate('/');
      return;
    }

    const itemsRef = collection(db, 'items');
    const q = query(itemsRef, where('ownerRole', '==', 'VIP'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setVipItems(items);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching VIP items:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser, navigate]);

  if (loading) {
    return <p>Loading live bidding items...</p>;
  }

  return (
    <div className="live-bidding" style={{ padding: '1rem' }}>
      <h2>Live Bidding Session</h2>
      <p>Only VIPs can participate in bidding on items listed by other VIPs.</p>
      <button
        onClick={() => navigate('/CreateLiveBid')}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Create Live Bid
      </button>
      {vipItems.length > 0 ? (
        <BiddingRoom items={vipItems} currentUser={currentUser} />
      ) : (
        <p>No VIP items available for bidding at the moment.</p>
      )}
    </div>
  );
};

export default LiveBidding;
