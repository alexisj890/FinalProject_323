import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ItemCard from './ItemCard';

function ItemListings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/items')
      .then((response) => setItems(response.data))
      .catch((error) => console.error('Error fetching items:', error));
  }, []);

  //if (loading) return <p>Loading items...</p>;
  //if (error) return <p>{error}</p>;

  return (
    <div className="item-listings">
      <h2>Current Available Items</h2>
      <div className="item-listings-grid">
        {items.map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default ItemListings;
