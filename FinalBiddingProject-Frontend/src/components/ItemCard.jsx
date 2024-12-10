// ItemCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './ItemCard.css'; // Import the CSS file

function ItemCard({ item }) {
  const { _id, title, price, imageUrl, description } = item;

  return (
    <div className="item-card">
      <Link to={`/items/${_id}`}>
        <img src={imageUrl} alt={title} />
      </Link>
      <h3>{title}</h3>
      <p>{description}</p>
      <p className="price">${price}</p>
      <Link to={`/items/${_id}`} className="view-details-button">
        View Details
      </Link>
    </div>
  );
}

export default ItemCard;
