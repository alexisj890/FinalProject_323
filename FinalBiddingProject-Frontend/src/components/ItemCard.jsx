import React from 'react';
import { Link } from 'react-router-dom';
import './ItemCard.css'; // Import styles if needed

function ItemCard({ item }) {
  const { _id, title, price, imageUrl, description } = item;

  return (
    <div className="item-card">
      <Link to={`/items/${_id}`}>
        <img src={imageUrl} alt={title} className="item-image" />
      </Link>
      <h3>{title}</h3>
      <p>{description}</p>
      <p className="price">${price}</p>
      
      {/* Comment Button */}
      <Link to={`/items/${_id}/comments`} className="comment-button">
        <img
          src="https://via.placeholder.com/30?text=💬" // Replace with your comment icon
          alt="Comments"
          className="inline-block mr-2"
        />
        View Comments
      </Link>
    </div>
  );
}

export default ItemCard;
