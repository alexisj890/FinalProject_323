import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateItem = ({ addItem }) => {
  // State for form data
  const [formData, setFormData] = useState({
    itemName: '',
    amount: '',
    description: '',
    image: null, // To hold the file
  });

  const [previewImage, setPreviewImage] = useState(null); // For image preview
  const navigate = useNavigate(); // Hook to navigate to another page

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file change for image upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file)); // Show a preview
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.itemName || !formData.amount || !formData.image) {
      alert('Please fill in all required fields.');
      return;
    }

    // Create the new item object
    const newItem = {
      id: Date.now().toString(), // Generate a unique ID
      title: formData.itemName,
      description: formData.description,
      price: parseFloat(formData.amount),
      imageUrl: URL.createObjectURL(formData.image), // Temporary URL for preview
    };

    // Add the item to the list using the passed function
    addItem(newItem);

    // Reset the form
    setFormData({
      itemName: '',
      amount: '',
      description: '',
      image: null,
    });
    setPreviewImage(null);

    // Navigate to the Items page
    navigate('/items');
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h2>Create New Item</h2>
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

        {/* Amount */}
        <div>
          <label>Amount ($):</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            placeholder="Enter amount"
          />
        </div>

        {/* Description */}
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter a description (optional)"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label>Upload Image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} required />
        </div>

        {/* Image Preview */}
        {previewImage && (
          <div>
            <p>Image Preview:</p>
            <img src={previewImage} alt="Preview" style={{ maxWidth: '100%' }} />
          </div>
        )}

        {/* Submit Button */}
        <button type="submit">Create Item</button>
      </form>
    </div>
  );
};

export default CreateItem;
