import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import "./TransactionRating.css";

function TransactionRating() {
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const sellerId = location.state?.sellerId; 
  // Make sure you passed sellerId from the previous page. 
  // For example: navigate("/transaction-rating", { state: { sellerId: "someSellerId"} });

  const handleRating = (value) => {
    setRating(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }

    try {
      // Update the seller's document with the new rating.
      const sellerRef = doc(db, "users", sellerId);
      await updateDoc(sellerRef, {
        ratings: arrayUnion(rating)
      });

      alert("Thank you for your rating!");
      navigate("/items"); 
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Error submitting rating. Please try again.");
    }
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
