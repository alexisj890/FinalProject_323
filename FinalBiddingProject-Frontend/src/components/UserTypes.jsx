import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

// ADD AN ALERT TO THE QUESTION BUTTON IF NOT LOGGED IN
function UserTypes() {
  return (
    <section id="user-types">
      <h2>User Types</h2>
      <div className="user-type">
        <h3>Visitors</h3>
        <p>
          Browse listings and provide comments. Apply to become a User by answering a human verification question.
        </p>
        <Link to="/verification-question">
          <button>Question</button>
        </Link>
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
          To achieve Super User Status and check more information click on the link below.
        </p>
        <Link to="/more-info">
          <button>MORE INFO</button>
        </Link>
      </div>
    </section>
  );
}

export default UserTypes;
