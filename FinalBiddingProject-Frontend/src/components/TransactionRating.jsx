import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TransactionRating.css"; // Assuming you have a CSS file for styling

function TransactionRating() {
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }

    const transactionData = {
      rating
    };

    console.log("Transaction Rating Submitted:", transactionData);

    navigate("/thank-you");
  };

  return (
    <div className="transaction-rating-container">
      <h1 className="transaction-rating-header">Rate the Seller</h1>
      <form className="transaction-rating-form" onSubmit={handleSubmit}>
        <div className="rating-section">
          <p className="rating-text">Select a Rating:</p>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((value) => (
              <span
                key={value}
                className={`star ${value <= rating ? "selected" : ""}`}
                onClick={() => handleRating(value)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <button type="submit" className="submit-button">
          Submit Rating
        </button>
      </form>
    </div>
  );
}

export default TransactionRating;
