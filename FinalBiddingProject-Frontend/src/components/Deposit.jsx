import React, { useState } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Deposit() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setMessage('Please enter a valid amount greater than 0.');
      return;
    }

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentBalance = userData.balance || 0; // Default to 0 if no balance exists
        const newBalance = currentBalance + parseFloat(amount);

        const updates = { balance: newBalance };
        if (newBalance >= 5000 && userData.role !== 'vip') {
          updates.role = 'vip';
          setMessage(
            `Congratulations! You've been promoted to VIP with a new balance of $${newBalance.toFixed(2)}.`
          );
        } else {
          setMessage(
            `Successfully deposited $${amount}. New balance: $${newBalance.toFixed(2)}`
          );
        }

        await updateDoc(userRef, updates);
        setAmount('');
      } else {
        setMessage('User document does not exist. Please contact support.');
      }
    } catch (error) {
      console.error('Error depositing money:', error);
      setMessage('An error occurred while processing your deposit. Please try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Deposit</h1>
      <form onSubmit={handleDeposit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ marginRight: '0.5rem' }}>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            style={{
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              width: '200px',
            }}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Deposit
        </button>
      </form>
      {message && (
        <p
          style={{
            marginTop: '1rem',
            color: message.includes('Congratulations') ? 'green' : 'red',
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default Deposit;
