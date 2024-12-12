import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CreateLiveBids = ({ currentUser }) => {
  const [formData, setFormData] = useState({
    itemName: '',
    startPrice: '',
    duration: '', // In minutes
    imageUrl: '', // For uploading images (could be extended later)
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file change for image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Temporarily show a local preview
      setFormData((prev) => ({ ...prev, imageUrl }));
      setPreviewImage(imageUrl);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.itemName || !formData.startPrice || !formData.duration) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      // Calculate the end time for the bidding
      const endTime = new Date();
      endTime.setMinutes(endTime.getMinutes() + parseInt(formData.duration, 10));

      const newBidItem = {
        title: formData.itemName,
        startPrice: parseFloat(formData.startPrice),
        curPrice: parseFloat(formData.startPrice),
        imageUrl: formData.imageUrl,
        owner: currentUser.email,
        ownerRole: currentUser.role ? currentUser.role.toUpperCase() : 'VIP', // ensure consistent casing
        endTime: endTime.toISOString(), // Store as ISO string
        createdAt: serverTimestamp(),
        isLiveBid: true // This field distinguishes live bidding items
      };

      // Add the bid item to the "items" collection in Firebase
      await addDoc(collection(db, 'items'), newBidItem);

      setMessage('Live bid created successfully!');
      setTimeout(() => {
        navigate('/LiveBidding'); // Redirect to Live Bidding page
      }, 2000);
    } catch (error) {
      console.error('Error creating live bid:', error);
      setMessage('Failed to create live bid. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <h2>Create Live Bid</h2>
      <form onSubmit={handleSubmit}>
        {/* Item Name */}
        <div>
          <label>Item Name:</label>
          <input
            type="text"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            required
            placeholder="Enter item name"
          />
        </div>

        {/* Starting Price */}
        <div>
          <label>Starting Price ($):</label>
          <input
            type="number"
            name="startPrice"
            value={formData.startPrice}
            onChange={handleChange}
            required
            placeholder="Enter starting price"
          />
        </div>

        {/* Duration */}
        <div>
          <label>Bidding Duration (Minutes):</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            placeholder="Enter bidding duration"
          />
        </div>

        {/* Image Upload */}
        <div>
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
        <button type="submit">Create Live Bid</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default CreateLiveBids;
