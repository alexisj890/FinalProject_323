import React, { useState } from 'react';
import axios from 'axios';

function CreateItem() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [bidDeadline, setBidDeadline] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/items', {
        title,
        description,
        price,
        imageUrl,
        bidDeadline,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Redirect or display success message
    } catch (error) {
      console.error('Error creating item:', error);
      // Display error message
    }
  };

  return (
    <div className="create-item">
      <h2>Create New Item</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields for item details */}
      </form>
    </div>
  );
}

export default CreateItem;
