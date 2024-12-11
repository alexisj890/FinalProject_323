import React, { useState } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Deposit() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) {
      setMessage('Please enter a valid amount.');
      return;
    }

    try {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const currentBalance = userDoc.data().balance || 0; // Default to 0 if no balance exists
        const newBalance = currentBalance + parseFloat(amount);

        await updateDoc(userRef, { balance: newBalance });
        setMessage(`Successfully deposited $${amount}. New balance: $${newBalance.toFixed(2)}`);
        setAmount('');
      } else {
        setMessage('User document does not exist.');
      }
    } catch (error) {
      console.error('Error depositing money:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Deposit</h1>
      <form onSubmit={handleDeposit}>
        <div>
          <label>Amount: </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Deposit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Deposit;
