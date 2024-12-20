import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserTypes({ currentUser }) {
  const navigate = useNavigate();

  const handleQuestionClick = () => {
    if (!currentUser) {
      alert('You must be logged in to see the question.');
    } else if (currentUser.role === 'user' || currentUser.role === 'vip') {
      alert('You are already verified. You cannot access the verification question.');
    } else {
      navigate('/verification-question');
    }
  };

  return (
    <section id="user-types">
      <h2>User Types</h2>
      <div className="user-type">
        <h3>Visitors</h3>
        <p>
          Browse listings and provide comments. Apply to become a User by answering a human verification question.
        </p>
        {(!currentUser || (currentUser && currentUser.role !== 'user' && currentUser.role !== 'vip')) && (
          <button onClick={handleQuestionClick}>Question</button>
        )}
      </div>
      <div className="user-type">
        <h3>Users</h3>
        <p>
          Deposit/withdraw money, list items/services, bid on items, and rate other users after transactions.
        </p>
      </div>
      <div className="user-type">
        <h3>VIPs</h3>
        <p>
          Same privileges as Users, plus a 10% discount on every transaction.
          Must have more than $5,000, more than 5 transactions, and no complaints.
        </p>
      </div>
      <div className="user-type">
        <h3>Super-users</h3>
        <p>
          Approve new user applications, handle complaints, and manage user suspensions.
          To achieve Super User Status and check more information click on the link below.
        </p>
        <button onClick={() => navigate('/more-info')}>MORE INFO</button>
      </div>
    </section>
  );
}

export default UserTypes;
