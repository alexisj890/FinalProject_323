import React, { useEffect, useState } from 'react';
import './ItemListings.css'; // Import the CSS file
import ItemCard from './ItemCard';
import { Link } from 'react-router-dom';

function ItemListings({ newItems }) {
  const [items, setItems] = useState([]);

  // Hardcoded items for testing
  const hardcodedItems = [
    {
      _id: '1',
      title: '2021 Tesla Model S',
      description:
        'A pristine Tesla Model S with 20,000 miles, full self-driving capabilities, and a sleek red exterior.',
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
  ];

  // Combine hardcoded items with new ones passed as props
  useEffect(() => {
    setItems([...hardcodedItems, ...newItems]);
  }, [newItems]);

  return (
    <div className="item-listings">
      <h2>Available Items</h2>
      <div className="item-listings-grid">
        {items.map((item, index) => (
          <ItemCard key={item._id || index} item={item} />
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
