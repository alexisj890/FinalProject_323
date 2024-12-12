import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Comments from './Comments'; // Component to handle comments
import './ItemDetails.css';

function ItemDetails({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidSuccess, setBidSuccess] = useState(false);
  const [error, setError] = useState('');
  const [buySuccess, setBuySuccess] = useState(false);
  const [acceptSuccess, setAcceptSuccess] = useState(false);

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

  const refetchItem = async () => {
    const itemRef = doc(db, 'items', id);
    const itemSnap = await getDoc(itemRef);
    if (itemSnap.exists()) {
      setItem({ id: itemSnap.id, ...itemSnap.data() });
      console.log('Item data re-fetched successfully:', itemSnap.data());
    }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to place a bid.');
      return;
    }
    if (!currentUser.uid) {
      setError('User ID is missing. Please re-login.');
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

      await refetchItem();
      setBidAmount('');
      setBidSuccess(true);
      setTimeout(() => setBidSuccess(false), 3000);
      setError('');
    } catch (error) {
      console.error('Error placing bid:', error);
      setError('Failed to place bid. Please try again.');
    }
  };

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
      const buyerRef = doc(db, 'users', currentUser.uid);
      const sellerRef = doc(db, 'users', item.ownerId);

      const [buyerSnap, sellerSnap] = await Promise.all([getDoc(buyerRef), getDoc(sellerRef)]);
      if (!buyerSnap.exists() || !sellerSnap.exists()) {
        alert('Unable to find buyer or seller information.');
        return;
      }

      const buyerData = buyerSnap.data();
      const sellerData = sellerSnap.data();

      // **Updated Line: Use seller-set price instead of current bid**
      const price = item.price || item.startPrice || 0;

      const buyerBalance = buyerData.balance || 0;
      const sellerBalance = sellerData.balance || 0;

      if (buyerBalance < price) {
        setError('You do not have enough funds to buy this item.');
        return;
      }

      const buyerNewBalance = buyerBalance - price;
      const sellerNewBalance = sellerBalance + price;

      await updateDoc(buyerRef, { balance: buyerNewBalance });
      await updateDoc(sellerRef, { balance: sellerNewBalance });

      const itemRef = doc(db, 'items', id);
      await updateDoc(itemRef, {
        sold: true,
        curWinner: currentUser.email,
        buyerId: currentUser.uid,
        acceptedBid: price,
      });

      setBuySuccess(true);
      setError('');
      setTimeout(() => setBuySuccess(false), 3000);

      alert('Congratulations! You bought the item.');
      console.log('Item purchased successfully.');

      await refetchItem();
    } catch (error) {
      console.error('Error processing Buy Now:', error);
      alert('Failed to complete purchase. Please try again.');
    }
  };

  const handleAcceptBid = async () => {
    if (!item || !item.curPrice || !item.curWinner) {
      setError('No valid bid to accept.');
      return;
    }
    if (!item.buyerId) {
      setError('Bidder information is missing.');
      console.error('item.buyerId is not set.', item);
      return;
    }

    try {
      const ownerRef = doc(db, 'users', currentUser.uid);
      const bidderRef = doc(db, 'users', item.buyerId);

      const [ownerSnap, bidderSnap] = await Promise.all([getDoc(ownerRef), getDoc(bidderRef)]);
      if (!ownerSnap.exists() || !bidderSnap.exists()) {
        setError('Unable to find owner or bidder data.');
        return;
      }

      const ownerData = ownerSnap.data();
      const bidderData = bidderSnap.data();

      const ownerBalance = ownerData.balance || 0;
      const bidderBalance = bidderData.balance || 0;

      if (bidderBalance < item.curPrice) {
        setError('The bidder does not have enough funds to complete this transaction.');
        return;
      }

      const newOwnerBalance = ownerBalance + item.curPrice;
      const newBidderBalance = bidderBalance - item.curPrice;

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
      setTimeout(() => setAcceptSuccess(false), 3000);

      alert('Bid accepted successfully!');
      console.log('Bid accepted successfully.');

      await refetchItem();
    } catch (error) {
      console.error('Error accepting bid:', error);
      setError('Failed to accept bid. Please try again.');
    }
  };

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
      navigate('/items'); // Use navigate instead of window.location.href
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
        <img src={item.imageUrl} alt={item.title} className="item-details-image" />

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
                  <button type="submit" className="bid-button">Place Bid</button>
                </form>
              ) : (
                <p>You must be logged in to place a bid.</p>
              )}
              <button onClick={handleBuyNow} className="buy-now-button">Buy Now for ${item.price || item.startPrice}</button>
            </div>
          )}

          {isOwner && !item.sold && (
            <div>
              {item.curPrice && item.curWinner ? (
                <button onClick={handleAcceptBid} className="accept-bid-button">Accept Bid</button>
              ) : (
                <p>No valid bid to accept yet.</p>
              )}
              <button onClick={handleDeleteItem} className="delete-button">Delete Item</button>
            </div>
          )}

          {item.sold && (
            <div className="post-transaction-actions">
              <p className="info-message">This item has been sold for ${item.acceptedBid}.</p>
              {currentUser && (
                <>
                  {currentUser.uid === item.buyerId && (
                    <>
                      <p>You bought this item. Rate the owner?</p>
                      <button onClick={() => navigate(`/items/${id}/rate-owner`)}>Rate Owner</button>
                    </>
                  )}

                  {currentUser.uid === item.ownerId && (
                    <>
                      <p>You sold this item. Rate the buyer?</p>
                      <button onClick={() => navigate(`/items/${id}/rate-buyer`)}>Rate Buyer</button>
                    </>
                  )}

                  {(currentUser.uid === item.buyerId || currentUser.uid === item.ownerId) && (
                    <button onClick={() => navigate(`/items/${id}/complain`)}>
                      File a Complaint
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {error && <p className="error-message">{error}</p>}
          {bidSuccess && <p className="success-message">Your bid was placed successfully!</p>}
          {buySuccess && <p className="success-message">Item purchased successfully!</p>}
          {acceptSuccess && <p className="success-message">Bid accepted successfully!</p>}
        </div>
      </div>

      <Comments itemId={id} />
    </div>
  );
}

export default ItemDetails;
