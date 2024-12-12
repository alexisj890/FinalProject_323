import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CreateItem = ({ addItem, currentUser }) => {
  const [formData, setFormData] = useState({
    itemName: '',
    amount: '',
    description: '',
    imageUrl: '',
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // If user is not logged in
  if (!currentUser) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p>You must be logged in to create an item.</p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imageUrl }));
      setPreviewImage(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.itemName || !formData.amount || isNaN(formData.amount)) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const price = parseFloat(formData.amount);
      const newItem = {
        title: formData.itemName,
        description: formData.description,
        price,
        imageUrl: formData.imageUrl,
        createdAt: serverTimestamp(),
        ownerId: currentUser.uid,
        ownerEmail: currentUser.email,
        sold: false,
      };

      const docRef = await addDoc(collection(db, 'items'), newItem);

      if (typeof addItem === 'function') {
        addItem({ id: docRef.id, ...newItem });
      }

      setMessage('Item created successfully!');
      setFormData({
        itemName: '',
        amount: '',
        description: '',
        imageUrl: '',
      });
      setPreviewImage(null);

      navigate(`/items/${docRef.id}`);
    } catch (error) {
      console.error('Error creating item:', error);
      setMessage('Failed to create item. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <h2>Create New Item</h2>
      <form onSubmit={handleSubmit}>
        {/* Item Name */}
        <div style={{ marginBottom: '1rem' }}>
          <label>Item Name:</label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            required
            placeholder="Enter item name"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        {/* Amount */}
        <div style={{ marginBottom: '1rem' }}>
          <label>Amount ($):</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            placeholder="Enter amount"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: '1rem' }}>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter a description (optional)"
            style={{ width: '100%', padding: '0.5rem', height: '100px' }}
          />
        </div>

        {/* Image Upload */}
        <div style={{ marginBottom: '1rem' }}>
          <label>Upload Image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {/* Image Preview */}
        {previewImage && (
          <div style={{ margin: '20px 0' }}>
            <p>Image Preview:</p>
            <img src={previewImage} alt="Preview" style={{ maxWidth: '100%' }} />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create Item
        </button>
        {message && <p style={{ marginTop: '1rem', color: 'green' }}>{message}</p>}
      </form>
    </div>
  );
};

export default CreateItem;
