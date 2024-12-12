import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

function RateUser({ currentUser }) {
  const { id } = useParams(); 
  const location = useLocation();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [ratedUserId, setRatedUserId] = useState(null);
  const [error, setError] = useState('');


  const isRatingOwner = location.pathname.endsWith('rate-owner');

  useEffect(() => {
    const fetchItemAndDetermineUser = async () => {
      const itemRef = doc(db, 'items', id);
      const itemSnap = await getDoc(itemRef);
      if (!itemSnap.exists()) {
        setError('Item not found.');
        return;
      }

      const itemData = itemSnap.data();
      if (!itemData.sold) {
        setError('Transaction not completed. You cannot rate.');
        return;
      }

      // If rating owner: currentUser must be buyer
      // If rating buyer: currentUser must be owner
      if (isRatingOwner && currentUser.uid !== itemData.buyerId) {
        setError('You are not the buyer. Cannot rate owner.');
        return;
      }

      if (!isRatingOwner && currentUser.uid !== itemData.ownerId) {
        setError('You are not the owner. Cannot rate buyer.');
        return;
      }

      // Logic for user rating
      const userToRateId = isRatingOwner ? itemData.ownerId : itemData.buyerId;
      setRatedUserId(userToRateId);
    };

    fetchItemAndDetermineUser();
  }, [id, currentUser, isRatingOwner]);

  const handleRating = (value) => {
    setRating(value);
  };

  const updateUserSuspensionStatus = async (userRef) => {
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return;

    const userData = userSnap.data();
    const ratings = userData.ratings || [];
    if (ratings.length < 3) return; // Suspension checks apply only after >= 3 ratings.

    const avgRating = ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length;

    let suspended = false;
    let reason = '';

    // Check conditions:
    // If average < 2 => suspended for being too mean (or too low)
    if (avgRating < 2) {
      suspended = true;
      reason = 'low_ratings';
    } else if (avgRating > 4) {
      // If average > 4 => suspended for being too generous
      suspended = true;
      reason = 'high_ratings';
    }

    // Check if user has at least three ratings < 2 as well
    const lowRatingsCount = ratings.filter(r => r.value < 2).length;
    if (lowRatingsCount >= 3) {
      suspended = true;
      reason = 'multiple_low_ratings';
    }

    if (suspended) {
      await updateDoc(userRef, {
        suspended: true,
        suspensionReason: reason
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating before submitting.");
      return;
    }

    if (!ratedUserId) {
      setError('No user found to rate.');
      return;
    }

    try {
      const userRef = doc(db, 'users', ratedUserId);
      // Add rating anonymously (no reference to currentUser)
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        setError('User does not exist.');
        return;
      }

      const userData = userSnap.data();
      const updatedRatings = userData.ratings ? [...userData.ratings, { value: rating, transactionId: id }] : [{ value: rating, transactionId: id }];

      await updateDoc(userRef, {
        ratings: updatedRatings
      });

      // Update suspension status
      await updateUserSuspensionStatus(userRef);

      alert("Thank you for your rating!");
      navigate("/items");
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Error submitting rating. Please try again.");
    }
  };

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  }

  if (!ratedUserId) {
    return <div style={{ padding: '20px' }}>Loading rating form...</div>;
  }

  return (
    <div className="transaction-rating-container">
      <h1 className="transaction-rating-header">Rate the {isRatingOwner ? 'Owner' : 'Buyer'}</h1>
      <form className="transaction-rating-form" onSubmit={handleSubmit}>
        <div className="rating-section">
          <p className="rating-text">Select a Rating (1-Worst to 5-Best):</p>
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

export default RateUser;
