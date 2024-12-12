// ComplaintForm.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';

function ComplaintForm({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complainedUserId, setComplainedUserId] = useState(null);
  const [complaintText, setComplaintText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      const itemRef = doc(db, 'items', id);
      const itemSnap = await getDoc(itemRef);
      if (!itemSnap.exists()) {
        setError('Item not found.');
        return;
      }
      const itemData = itemSnap.data();
      if (!itemData.sold) {
        setError('Transaction not completed. Cannot file complaint.');
        return;
      }
      // Determine who to complain about:
      // If currentUser is the buyer, they can complain about the seller.
      // If currentUser is the seller, they can complain about the buyer.
      if (currentUser.uid === itemData.buyerId) {
        setComplainedUserId(itemData.ownerId);
      } else if (currentUser.uid === itemData.ownerId) {
        setComplainedUserId(itemData.buyerId);
      } else {
        setError('You did not participate in this transaction.');
      }
    };
    fetchItem();
  }, [id, currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!complaintText.trim()) {
      alert('Please enter a complaint description.');
      return;
    }

    try {
      await addDoc(collection(db, 'complaints'), {
        complainantId: currentUser.uid,
        complainedUserId,
        itemId: id,
        text: complaintText,
        timestamp: new Date(),
      });

      alert('Complaint submitted successfully.');
      navigate('/items');
    } catch (err) {
      console.error('Error submitting complaint:', err);
      alert('Failed to submit complaint.');
    }
  };

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
  }

  if (!complainedUserId) {
    return <div style={{ padding: '20px' }}>Loading complaint form...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>File a Complaint</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={complaintText}
          onChange={(e) => setComplaintText(e.target.value)}
          placeholder="Describe your complaint..."
          style={{ width: '100%', height: '100px' }}
        />
        <br/><br/>
        <button type="submit">Submit Complaint</button>
      </form>
    </div>
  );
}

export default ComplaintForm;