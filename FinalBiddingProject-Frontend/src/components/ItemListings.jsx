// ItemListings.jsx

import React, { useState, useEffect } from 'react';
import './ItemListings.css'; // Import the CSS file
import ItemCard from './ItemCard';

function ItemListings() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hardcoded items for testing
  const hardcodedItems = [
    {
      _id: '1',
      title: '2021 Tesla Model S',
      description: 'A pristine Tesla Model S with 20,000 miles, full self-driving capabilities, and a sleek red exterior.',
      price: 79999,
      imageUrl: 'https://via.placeholder.com/300?text=Tesla+Model+S',
    },
    {
      _id: '2',
      title: 'iPhone 14 Pro Max',
      description: 'Brand new iPhone 14 Pro Max, 256GB, Space Black.',
      price: 1199,
      imageUrl: 'https://via.placeholder.com/300?text=iPhone+14+Pro+Max',
    },
    {
      _id: '3',
      title: 'Gaming Laptop',
      description: 'High-performance gaming laptop with RTX 3070 and 32GB RAM.',
      price: 2499,
      imageUrl: 'https://via.placeholder.com/300?text=Gaming+Laptop',
    },
    {
      _id: '4',
      title: 'Sony WH-1000XM5 Headphones',
      description: 'Noise-cancelling wireless headphones with amazing sound quality.',
      price: 399,
      imageUrl: 'https://via.placeholder.com/300?text=Sony+Headphones',
    },
  ];

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      setItems(hardcodedItems);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <p>Loading items...</p>;

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
