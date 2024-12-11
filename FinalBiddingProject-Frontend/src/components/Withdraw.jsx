import React, { useState } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Withdraw() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleWithdraw = async (e) => {
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
        const withdrawAmount = parseFloat(amount);

        if (withdrawAmount > currentBalance) {
          setMessage('Insufficient balance.');
          return;
        }

        const newBalance = currentBalance - withdrawAmount;

        await updateDoc(userRef, { balance: newBalance });
        setMessage(`Successfully withdrew $${amount}. New balance: $${newBalance.toFixed(2)}`);
        setAmount('');
      } else {
        setMessage('User document does not exist.');
      }
    } catch (error) {
      console.error('Error withdrawing money:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Withdraw</h1>
      <form onSubmit={handleWithdraw}>
        <div>
          <label>Amount: </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit">Withdraw</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Withdraw;
