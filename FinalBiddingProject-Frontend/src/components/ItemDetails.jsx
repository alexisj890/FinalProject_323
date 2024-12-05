// frontend/src/components/ItemDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/items/${id}`)
      .then((response) => setItem(response.data))
      .catch((error) => console.error('Error fetching item:', error));
  }, [id]);

  if (!item) return <p>Loading...</p>;

  return (
    <div className="item-details">
      <img src={item.imageUrl} alt={item.title} className="item-details-image" />
      <div className="item-details-content">
        <h2>{item.title}</h2>
        <p>{item.description}</p>
        <p className="item-details-price">${item.price}</p>
        {/* Add bid form and comments here */}
      </div>
    </div>
  );
}

export default ItemDetails;
