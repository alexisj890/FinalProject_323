import React, { useEffect, useState } from 'react';
import './ItemListings.css'; 
import ItemCard from './ItemCard';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

function ItemListings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all items and then filter client-side
  useEffect(() => {
    const itemsRef = collection(db, 'items');

    const unsubscribe = onSnapshot(
      itemsRef,
      (snapshot) => {
        const fetchedItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filter items to only show those that are NOT live bids.
        // This includes items that have `isLiveBid: false` or no `isLiveBid` field at all.
        const nonLiveItems = fetchedItems.filter(item => item.isLiveBid !== true);
        setItems(nonLiveItems);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching items:', error);
        setError('Failed to load items. Please try again later.');
        setLoading(false);
      }
    );

    return () => unsubscribe(); 
  }, []);

  if (loading) {
    return <p className="loading-message">Loading items...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="item-listings">
      <div className="button-container top">
        <Link to="/create-item" className="view-create-item">
          Create Item
        </Link>
      </div>
      <h2>Available Items</h2>
      <div className="item-listings-grid">
        {items.length > 0 ? (
          items.map((item) => <ItemCard key={item.id} item={item} />)
        ) : (
          <p>No items available at the moment.</p>
        )}
      </div>
    </div>
  );
}

export default ItemListings;
