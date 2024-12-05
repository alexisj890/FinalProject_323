// frontend/src/components/ItemCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function ItemCard({ item }) {
  return (
    <div className="item-card">
      <img src={item.imageUrl} alt={item.title} className="item-card-image" />
      <div className="item-card-content">
        <h3 className="item-card-title">{item.title}</h3>
        <p className="item-card-description">{item.description}</p>
        <p className="item-card-price">${item.price}</p>
        <Link to={`/items/${item._id}`} className="item-card-button">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ItemCard;
