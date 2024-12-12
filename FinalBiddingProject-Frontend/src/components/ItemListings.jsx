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

  // Fetch items from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'items'),
      (snapshot) => {
        const fetchedItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(fetchedItems);
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
      <h2>Available Items</h2>
      <div className="item-listings-grid">
        {items.length > 0 ? (
          items.map((item) => <ItemCard key={item.id} item={item} />)
        ) : (
          <p>No items available at the moment.</p>
        )}
      </div>
      <div className="button-container">
        <Link to="/create-item" className="view-create-item">
          Create Item
        </Link>
      </div>
    </div>
  );
}

export default ItemListings;
