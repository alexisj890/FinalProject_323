import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from './Icons'; // Import the specific icon from your utility
import BiddingRoom from './BiddingRoom';
import RockPaperScissors from './RockPaperScissors';

const LiveBidding = ({ currentUser }) => {
  const [vipItems, setVipItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tieBidders, setTieBidders] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      alert('Please log in to access Live Bidding.');
      navigate('/');
      return;
    }

    if (!currentUser.role || currentUser.role.toLowerCase() !== 'vip') {
      alert('Access restricted: Only VIP members can access Live Bidding.');
      navigate('/');
      return;
    }

    const itemsRef = collection(db, 'items');
    // Query only items that are live bid items
    const q = query(itemsRef, where('isLiveBid', '==', true));

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

  const handleTieBreak = (bidders) => {
    setTieBidders(bidders);
  };

  const handleGameEnd = (winner) => {
    alert(`${winner} wins the tie breaker!`);
    setTieBidders(null);
  };

  const simulateTie = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const mockBidders = ['User1', 'User2'];
      setTieBidders(mockBidders);
      setIsSimulating(false);
    }, 1000);
  };

  if (loading) {
    return <p>Loading live bidding items...</p>;
  }

  return (
    <div className="live-bidding" style={{ padding: '1rem' }}>
      <h2>Live Bidding Session</h2>
      <p>Only VIPs can participate in bidding on these exclusive live bidding items.</p>

      {/* Button to create a new live bid */}
      <button
        onClick={() => navigate('/CreateLiveBids')}
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
        <FontAwesomeIcon icon={faPlus} /> Create Live Bid
      </button>

      {/* Button to simulate a tie */}
      <button
        onClick={simulateTie}
        disabled={isSimulating}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: isSimulating ? '#ccc' : '#ff4500',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: isSimulating ? 'not-allowed' : 'pointer',
        }}
      >
        {isSimulating ? 'Simulating...' : 'Simulate Tie'}
      </button>

      {/* Tie-breaking game */}
      {tieBidders ? (
        <RockPaperScissors players={tieBidders} onGameEnd={handleGameEnd} />
      ) : vipItems.length > 0 ? (
        <BiddingRoom
          items={vipItems}
          currentUser={currentUser}
          onTieBreak={handleTieBreak}
        />
      ) : (
        <p>No items available for live bidding at the moment.</p>
      )}
    </div>
  );
};

export default LiveBidding;
