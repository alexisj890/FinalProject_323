import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
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
  const [acceptSuccess, setAcceptSuccess] = useState(false);

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
          setError('Item not found.');
        }
      } catch (error) {
        console.error('Error fetching item:', error);
        setError('Failed to load item details.');
      }
    };

    fetchItem();
  }, [id]);

  // Helper function to re-fetch item data after updates
  const refetchItem = async () => {
    const itemRef = doc(db, 'items', id);
    const itemSnap = await getDoc(itemRef);
    if (itemSnap.exists()) {
      setItem({ id: itemSnap.id, ...itemSnap.data() });
      console.log('Item data re-fetched successfully:', itemSnap.data());
    }
  };

  // Handle placing a bid
  const handlePlaceBid = async (e) => {
    e.preventDefault();

    // Ensure the user is logged in
    if (!currentUser) {
      setError('You must be logged in to place a bid.');
      return;
    }

    if (!currentUser.uid) {
      setError('User ID is missing from your account data. Please re-login.');
      return;
    }

    if (!bidAmount || isNaN(bidAmount)) {
      setError('Please enter a valid bid amount.');
      return;
    }

    const parsedBid = parseFloat(bidAmount);

    if (item.curPrice && parsedBid <= item.curPrice) {
      setError('Bid amount must be higher than the current price.');
      return;
    }

    try {
      const itemRef = doc(db, 'items', id);
      await updateDoc(itemRef, {
        curPrice: parsedBid,
        curWinner: currentUser.email || 'Guest',
        buyerId: currentUser.uid,
      });
      console.log('Bid placed successfully by user:', currentUser.uid);

      // Re-fetch item to ensure local state is up-to-date
      await refetchItem();

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
    if (!currentUser) {
      alert('You must be logged in to buy this item.');
      return;
    }

    if (item.ownerId === currentUser.uid) {
      alert('You cannot buy your own item.');
      return;
    }

    if (item.sold) {
      alert('This item is already sold.');
      return;
    }

    try {
      // Fetch buyer and seller documents from Firestore
      const buyerRef = doc(db, 'users', currentUser.uid);
      const sellerRef = doc(db, 'users', item.ownerId);

      const [buyerSnap, sellerSnap] = await Promise.all([getDoc(buyerRef), getDoc(sellerRef)]);

      if (!buyerSnap.exists() || !sellerSnap.exists()) {
        alert('Unable to find buyer or seller information.');
        return;
      }

      const buyerData = buyerSnap.data();
      const sellerData = sellerSnap.data();

      const price = item.curPrice || item.price || item.startPrice || 0; // Ensure we have a price
      const buyerBalance = buyerData.balance || 0;
      const sellerBalance = sellerData.balance || 0;

      // Check if buyer has enough funds
      if (buyerBalance < price) {
        setError('You do not have enough funds to buy this item.');
        return;
      }

      // Update balances
      const buyerNewBalance = buyerBalance - price;
      const sellerNewBalance = sellerBalance + price;

      // Perform updates in Firestore
      await updateDoc(buyerRef, { balance: buyerNewBalance });
      await updateDoc(sellerRef, { balance: sellerNewBalance });

      // Mark the item as sold
      const itemRef = doc(db, 'items', id);
      await updateDoc(itemRef, {
        sold: true,
        curWinner: currentUser.email,
        buyerId: currentUser.uid,
        acceptedBid: price,
      });

      setBuySuccess(true);
      setError('');
      setTimeout(() => setBuySuccess(false), 3000); // Reset success message

      alert('Congratulations! You bought the item.');
      console.log('Item purchased successfully.');

      // Re-fetch updated item data
      await refetchItem();
    } catch (error) {
      console.error('Error processing Buy Now:', error);
      alert('Failed to complete purchase. Please try again.');
    }
  };

  // Handle accepting a bid
  const handleAcceptBid = async () => {
    if (!item || !item.curPrice || !item.curWinner) {
      setError('No valid bid to accept.');
      return;
    }

    // Ensure the bidder exists
    if (!item.buyerId) {
      setError('Bidder information is missing.');
      console.error('Error: item.buyerId is not set. Current item data:', item);
      return;
    }

    console.log('Attempting to accept bid. Item data:', item);
    console.log('Accepting bid from buyerId:', item.buyerId);

    try {
      // Fetch owner and bidder user data
      const ownerRef = doc(db, 'users', currentUser.uid);
      const bidderRef = doc(db, 'users', item.buyerId); // `buyerId` is the curWinner's UID.

      const [ownerSnap, bidderSnap] = await Promise.all([getDoc(ownerRef), getDoc(bidderRef)]);

      if (!ownerSnap.exists() || !bidderSnap.exists()) {
        setError('Unable to find owner or bidder data.');
        console.error('Owner or bidder doc does not exist in users collection.');
        return;
      }

      const ownerData = ownerSnap.data();
      const bidderData = bidderSnap.data();

      const ownerBalance = ownerData.balance || 0;
      const bidderBalance = bidderData.balance || 0;

      // Check if bidder has enough funds (safety check)
      if (bidderBalance < item.curPrice) {
        setError('The bidder does not have enough funds to complete this transaction.');
        return;
      }

      // Update balances
      const newOwnerBalance = ownerBalance + item.curPrice;
      const newBidderBalance = bidderBalance - item.curPrice;

      // Perform updates in Firestore
      await Promise.all([
        updateDoc(ownerRef, { balance: newOwnerBalance }),
        updateDoc(bidderRef, { balance: newBidderBalance }),
        updateDoc(doc(db, 'items', id), {
          sold: true,
          acceptedBid: item.curPrice,
        }),
      ]);

      setAcceptSuccess(true);
      setError('');
      setTimeout(() => setAcceptSuccess(false), 3000); // Reset success message

      alert('Bid accepted successfully!');
      console.log('Bid accepted successfully.');

      // Re-fetch updated item data
      await refetchItem();
    } catch (error) {
      console.error('Error accepting bid:', error);
      setError('Failed to accept bid. Please try again.');
    }
  };

  // Handle delete item functionality
  const handleDeleteItem = async () => {
    if (!item || item.ownerId !== currentUser?.uid) {
      alert('You are not authorized to delete this item.');
      return;
    }

    try {
      const itemRef = doc(db, 'items', id);
      await deleteDoc(itemRef);
      alert('Item deleted successfully.');
      console.log('Item deleted successfully.');
      window.location.href = '/items'; // Redirect to items list
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  if (!item) {
    return <p>Loading item details...</p>;
  }

  const isOwner = currentUser?.uid === item.ownerId;
  const displayPrice = item.curPrice || item.price || item.startPrice;

  return (
    <div className="item-details-container">
      <div className="item-details-main">
        {/* Item Image */}
        <img src={item.imageUrl} alt={item.title} className="item-details-image" />

        {/* Item Information */}
        <div className="item-details-info">
          <h1>{item.title}</h1>
          <p>{item.description}</p>
          <h2>Price: ${displayPrice}</h2>
          <p>Seller: {item.ownerUsername || 'Unknown'}</p>
          <p>
            {item.curWinner ? (
              <strong>Current Highest Bidder: {item.curWinner}</strong>
            ) : (
              <strong>No bids yet.</strong>
            )}
          </p>

          {/* Bid and Buy Actions */}
          {!isOwner && !item.sold && (
            <div className="actions">
              {currentUser ? (
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
              ) : (
                <p>You must be logged in to place a bid.</p>
              )}
              <button onClick={handleBuyNow} className="buy-now-button">
                Buy Now
              </button>
            </div>
          )}

          {isOwner && !item.sold && (
            <div>
              {item.curPrice && item.curWinner ? (
                <button onClick={handleAcceptBid} className="accept-bid-button">
                  Accept Bid
                </button>
              ) : (
                <p>No valid bid to accept yet.</p>
              )}
              <button onClick={handleDeleteItem} className="delete-button">
                Delete Item
              </button>
            </div>
          )}

          {item.sold && <p className="info-message">This item has been sold for ${item.acceptedBid}.</p>}

          {error && <p className="error-message">{error}</p>}
          {bidSuccess && <p className="success-message">Your bid was placed successfully!</p>}
          {buySuccess && <p className="success-message">Item purchased successfully!</p>}
          {acceptSuccess && <p className="success-message">Bid accepted successfully!</p>}
        </div>
      </div>

      {/* Comments Section */}
      <Comments itemId={id} /> {/* Render the comments section */}
    </div>
  );
}

export default ItemDetails;
