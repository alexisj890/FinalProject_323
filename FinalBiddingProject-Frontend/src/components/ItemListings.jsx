// frontend/src/components/ItemListings.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemCard from './ItemCard';

function ItemListings() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/items')
      .then((response) => setItems(response.data))
      .catch((error) => console.error('Error fetching items:', error));
  }, []);

  return (
    <div className="item-listings">
      <h2>Available Items</h2>
      <div className="item-listings-grid">
        {items.map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default ItemListings;
