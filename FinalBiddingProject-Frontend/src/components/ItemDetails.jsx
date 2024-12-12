import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Comments from './Comments'; // Component to handle comments
import './ItemDetails.css';

function ItemDetails({ currentUser }) {
  const { id } = useParams(); // Get the item ID from the URL
  const [item, setItem] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidSuccess, setBidSuccess] = useState(false);
  const [error, setError] = useState('');
  const [buySuccess, setBuySuccess] = useState(false);

  // Fetch the item details from Firebase
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const itemRef = doc(db, 'items', id);
        const itemSnap = await getDoc(itemRef);

        if (itemSnap.exists()) {
          setItem({ id: itemSnap.id, ...itemSnap.data() });
        } else {
          console.error('No such item found!');
        }
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    };

    fetchItem();
  }, [id]);

  // Handle placing a bid
  const handlePlaceBid = async (e) => {
    e.preventDefault();

    if (!bidAmount || isNaN(bidAmount)) {
      setError('Please enter a valid bid amount.');
      return;
    }

    if (item.curPrice && parseFloat(bidAmount) <= item.curPrice) {
      setError('Bid amount must be higher than the current price.');
      return;
    }

    try {
      const itemRef = doc(db, 'items', id);
      await updateDoc(itemRef, {
        curPrice: parseFloat(bidAmount),
        curWinner: currentUser?.email || 'Guest',
      });
      setItem((prevItem) => ({
        ...prevItem,
        curPrice: parseFloat(bidAmount),
        curWinner: currentUser?.email || 'Guest',
      }));
      setBidAmount('');
      setBidSuccess(true);
      setTimeout(() => setBidSuccess(false), 3000); // Reset success message
      setError('');
    } catch (error) {
      console.error('Error placing bid:', error);
      setError('Failed to place bid. Please try again.');
    }
  };

  // Handle "Buy Now" functionality
  const handleBuyNow = async () => {
    try {
      const itemRef = doc(db, 'items', id);
      await updateDoc(itemRef, {
        sold: true,
        curWinner: currentUser?.email || 'Guest',
      });
      setBuySuccess(true);
      setTimeout(() => setBuySuccess(false), 3000); // Reset success message
      alert('Congratulations! You bought the item.');
    } catch (error) {
      console.error('Error processing Buy Now:', error);
      alert('Failed to complete purchase. Please try again.');
    }
  };

  if (!item) {
    return <p>Loading item details...</p>;
  }

  return (
    <div className="item-details-container">
      <div className="item-details-main">
        {/* Item Image */}
        <img src={item.imageUrl} alt={item.title} className="item-details-image" />

        {/* Item Information */}
        <div className="item-details-info">
          <h1>{item.title}</h1>
          <p>{item.description}</p>
          <h2>Price: ${item.curPrice || item.startPrice}</h2>
          <p>Seller: {item.owner || 'Unknown'}</p>
          <p>
            {item.curWinner ? (
              <strong>Current Highest Bidder: {item.curWinner}</strong>
            ) : (
              <strong>No bids yet.</strong>
            )}
          </p>

          {/* Bid and Buy Actions */}
          <div className="actions">
            <form onSubmit={handlePlaceBid} className="bid-form">
              <input
                type="number"
                placeholder="Enter your bid"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="bid-input"
                required
              />
              <button type="submit" className="bid-button">
                Place Bid
              </button>
            </form>
            <button onClick={handleBuyNow} className="buy-now-button">
              Buy Now
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
          {bidSuccess && <p className="success-message">Your bid was placed successfully!</p>}
          {buySuccess && <p className="success-message">Item purchased successfully!</p>}
        </div>
      </div>

      {/* Comments Section */}
      <Comments itemId={id} /> {/* Render the comments section */}
    </div>
  );
}

export default ItemDetails;
