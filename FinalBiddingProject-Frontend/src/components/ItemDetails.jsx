import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [bid, setBid] = useState('');
  const [bidSuccess, setBidSuccess] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/items/${id}`)
      .then((response) => setItem(response.data))
      .catch((error) => console.error('Error fetching item:', error));
  }, [id]);

  const handleBidSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://localhost:5000/items/${id}/bid`, { bid })
      .then(() => {
        setBidSuccess(true);
        setTimeout(() => setBidSuccess(false), 3000); // Reset after 3 seconds
      })
      .catch((error) => console.error('Error submitting bid:', error));
  };

  if (!item) return <p>Loading...</p>;

  return (
    <div className="item-details">
      <img src={item.imageUrl} alt={item.title} className="item-details-image" />
      <div className="item-details-content">
        <h2>{item.title}</h2>
        <p>{item.description}</p>
        <p className="item-details-price">${item.price}</p>
        {/* Add bid form and comments here */}
        <form onSubmit={handleBidSubmit} className="bid-form">
          <label>
            Your Bid:
            <input
              type="number"
              value={bid}
              onChange={(e) => setBid(e.target.value)}
              required
            />
          </label>
          <button type="submit">Place Bid</button>
        </form>

        {bidSuccess && <p className="bid-success">Bid submitted successfully!</p>}
      </div>
    </div>
  );
}

export default ItemDetails;
