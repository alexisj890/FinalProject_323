import React from 'react';

function UserTypes() {
  return (
    <section id="user-types">
      <h2>User Types</h2>
      <div className="user-type">
        <h3>Visitors</h3>
        <p>
          Browse listings and provide comments. Apply to become a User by answering a human verification question.
        </p>
        <button>Question</button>
      </div>
      <div className="user-type">
        <h3>Users</h3>
        <p>
          Deposit/withdraw money, list items/services, bid on items, and rate other users after transactions.
        </p>
      </div>
      <div className="user-type">
        <h3>Super-users</h3>
        <p>
          Approve new user applications, handle complaints, and manage user suspensions.
        </p>
      </div>
    </section>
  );
}

export default UserTypes;