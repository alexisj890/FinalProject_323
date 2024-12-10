import React from 'react';
import { Link } from 'react-router-dom';
import './ItemCard.css'; // Ensure this is the correct path to your CSS file

function ItemCard({ item }) {
  const { _id, title, price, imageUrl } = item;

  return (
    <div className="item-card">
      <img src={imageUrl} alt={title} />
      <h3>{title}</h3>
      <p className="price">${price}</p>
      <div className="button-container">
        <Link to={`/items/${_id}`} className="view-details-button">
          View Details
        </Link>
        <Link to={`/items/${_id}/comments`} className="view-comments-link">
          View Comments
        </Link>
      </div>
    </div>
  );
}

export default ItemCard;
