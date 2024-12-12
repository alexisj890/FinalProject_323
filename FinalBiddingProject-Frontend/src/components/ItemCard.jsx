import React from 'react';
import { Link } from 'react-router-dom';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './ItemCard.css'; 

function ItemCard({ item }) {
  const { id, title, price, imageUrl } = item;

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'items', id));
        alert('Item deleted successfully.');
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete the item. Please try again.');
      }
    }
  };

  return (
    <div className="item-card">
      <img src={imageUrl} alt={title} />
      <h3>{title}</h3>
      <p className="price">${price}</p>
      <div className="button-container">
        <Link to={`/items/${id}`} className="view-details-button">
          View Details
        </Link>
        <Link to={`/items/${id}/comments`} className="view-comments-link">
          View Comments
        </Link>
      </div>
    </div>
  );
}

export default ItemCard;
