import React, { useEffect, useState } from 'react';
import './ItemListings.css'; // Import the CSS file
import ItemCard from './ItemCard';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

function ItemListings() {
  const [items, setItems] = useState([]);

  // Get the items from the db
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'items'), (snapshot) => {
      const fetchedItems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(fetchedItems);
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <div className="item-listings">
      <h2>Available Items</h2>
      <div className="item-listings-grid">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
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
