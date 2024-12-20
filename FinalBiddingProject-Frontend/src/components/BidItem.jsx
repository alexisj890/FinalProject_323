import React, { useState, useEffect } from 'react';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const BidItem = ({ item, currentUser }) => {
  const [currentBid, setCurrentBid] = useState(item.curPrice || item.startPrice);
  const [highestBidder, setHighestBidder] = useState(item.curWinner || 'No bids yet');
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isBiddingOver, setIsBiddingOver] = useState(false);

  // Calculate time remaining based on endTime
  useEffect(() => {
    const end = new Date(item.endTime).getTime(); // Convert ISO string to timestamp

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((end - now) / 1000); // time in seconds

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft(0);
        setIsBiddingOver(true);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [item.endTime]);

  // Real-time updates from Firestore
  useEffect(() => {
    const itemRef = doc(db, 'items', item.id);
    const unsubscribe = onSnapshot(itemRef, (doc) => {
      const data = doc.data();
      if (data) {
        setCurrentBid(data.curPrice || item.startPrice);
        setHighestBidder(data.curWinner || 'No bids yet');
      }
    });

    return () => unsubscribe();
  }, [item.id, item.startPrice]);

  const handleBid = async () => {
    if (!bidAmount || isNaN(bidAmount)) {
      setBidError('Please enter a valid bid amount.');
      return;
    }

    if (parseFloat(bidAmount) <= currentBid) {
      setBidError('Your bid must be higher than the current price.');
      return;
    }

    try {
      const itemRef = doc(db, 'items', item.id);
      await updateDoc(itemRef, {
        curPrice: parseFloat(bidAmount),
        curWinner: currentUser?.email || 'Guest',
      });
      setBidAmount('');
      setBidError('');
    } catch (error) {
      console.error('Error placing bid:', error);
      setBidError('Failed to place bid. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="bid-item">
      <h3>{item.title}</h3>
      <img
        src={item.imageUrl}
        alt={item.title}
        style={{ maxWidth: '200px', borderRadius: '8px', marginBottom: '10px' }}
      />
      <p>{item.description}</p>
      <p>
        <strong>Current Price:</strong> ${currentBid}
      </p>
      <p>
        <strong>Highest Bidder:</strong> {highestBidder}
      </p>
      <p>
        <strong>Time Left:</strong> {timeLeft > 0 ? formatTime(timeLeft) : 'Bidding has ended'}
      </p>
      {!isBiddingOver ? (
        <div className="bid-actions">
          <input
            type="number"
            placeholder="Enter your bid"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <button
            onClick={handleBid}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Place Bid
          </button>
        </div>
      ) : (
        <p style={{ color: 'red', fontWeight: 'bold' }}>Bidding has ended</p>
      )}
      {bidError && <p style={{ color: 'red', marginTop: '10px' }}>{bidError}</p>}
    </div>
  );
};

export default BidItem;
