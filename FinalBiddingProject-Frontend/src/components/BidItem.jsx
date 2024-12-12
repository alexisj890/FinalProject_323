import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const BidItem = ({ item, currentUser }) => {
  const [currentBid, setCurrentBid] = useState(item.curPrice || item.startPrice);
  const [bidError, setBidError] = useState('');

  const handleBid = async () => {
    const newBid = currentBid + 10;

    if (newBid <= currentBid) {
      setBidError('Bid must be higher than the current bid.');
      return;
    }

    try {
      const itemRef = doc(db, 'items', item.id);
      await updateDoc(itemRef, {
        curPrice: newBid,
        curWinner: currentUser.email,
      });
      setCurrentBid(newBid);
      setBidError('');
    } catch (error) {
      console.error('Error placing bid:', error);
      setBidError('Failed to place bid. Please try again.');
    }
  };

  return (
    <div className="bid-item">
      <h4>{item.title}</h4>
      <p>{item.description}</p>
      <p>
        <strong>Current Price:</strong> ${currentBid}
      </p>
      <p>
        <strong>Seller:</strong> {item.owner}
      </p>
      {bidError && <p style={{ color: 'red' }}>{bidError}</p>}
      <button onClick={handleBid}>Bid +$10</button>
    </div>
  );
};

export default BidItem;
