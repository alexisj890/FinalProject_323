import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Navigate } from 'react-router-dom';

function SuperUserDashboard({ currentUser }) {
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    if (!currentUser || currentUser.username !== '322Bidding') return;

    const fetchPendingRequests = async () => {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('roleRequestStatus', '==', 'pending'));
      const snapshot = await getDocs(q);
      const requests = snapshot.docs.map(docSnap => ({ uid: docSnap.id, ...docSnap.data() }));
      setPendingRequests(requests);
    };

    fetchPendingRequests();
  }, [currentUser]);

  if (!currentUser || currentUser.username !== '322Bidding') {
    return <Navigate to="/" replace />;
  }

  const handleApprove = async (uid, requestedRole) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      role: requestedRole,
      roleRequestStatus: null,
      requestedRole: null
    });
    setPendingRequests(prev => prev.filter(req => req.uid !== uid));
  };

  const handleDeny = async (uid) => {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      role: 'visitor',
      roleRequestStatus: null,
      requestedRole: null
    });
    setPendingRequests(prev => prev.filter(req => req.uid !== uid));
  };

  return (
    <div>
      <h1>322Bidding's Super User Dashboard</h1>
      {pendingRequests.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>User Email</th>
              <th>Requested Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map(user => (
              <tr key={user.uid}>
                <td>{user.email || 'No Email Found'}</td>
                <td>{user.requestedRole}</td>
                <td>
                  <button onClick={() => handleApprove(user.uid, user.requestedRole)}>Approve</button>
                  <button onClick={() => handleDeny(user.uid)}>Deny</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending requests at this time.</p>
      )}
    </div>
  );
}

export default SuperUserDashboard;
