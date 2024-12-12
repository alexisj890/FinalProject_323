import React, { useState } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function Withdraw() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleWithdraw = async (e) => {
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

        // Only allow withdrawal if role is 'vip' or 'user'
        if (userData.role !== 'vip' && userData.role !== 'user') {
          setMessage('You are not allowed to withdraw. Please upgrade your account.');
          return;
        }

        const currentBalance = userData.balance || 0;
        const withdrawalAmount = parseFloat(amount);

        if (withdrawalAmount > currentBalance) {
          setMessage('Insufficient funds. Please enter a smaller amount.');
          return;
        }

        const newBalance = currentBalance - withdrawalAmount;
        const updates = { balance: newBalance };

        if (newBalance < 5000 && userData.role === 'vip') {
          updates.role = 'user';
          setMessage(
            `Withdrawal successful! Your new balance is $${newBalance.toFixed(2)}. You are no longer a VIP.`
          );
        } else {
          setMessage(
            `Successfully withdrew $${amount}. New balance: $${newBalance.toFixed(2)}`
          );
        }

        await updateDoc(userRef, updates);
        setAmount('');
      } else {
        setMessage('User document does not exist. Please contact support.');
      }
    } catch (error) {
      console.error('Error withdrawing money:', error);
      setMessage('An error occurred while processing your withdrawal. Please try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Withdraw</h1>
      <form onSubmit={handleWithdraw}>
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
          Withdraw
        </button>
      </form>
      {message && (
        <p
          style={{
            marginTop: '1rem',
            color: message.includes('successful') ? 'green' : 'red',
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

export default Withdraw;
