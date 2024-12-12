// utils/updateUserRoleStatus.js
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function updateUserRoleStatus(userId) {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) return;

  const userData = userDoc.data();
  const {
    balance = 0,
    transactionCount = 0,
    complaintCount = 0,
    role = 'visitor',
    suspended = false
  } = userData;

  // Check VIP conditions
  const qualifiesForVIP = (balance > 5000 && transactionCount > 5 && complaintCount === 0);

  if (role === 'vip') {
    // If user is VIP but doesn't meet conditions or is suspended
    if (suspended || !qualifiesForVIP) {
      // Downgrade to user and remove suspension if they were suspended
      await updateDoc(userRef, {
        role: 'user',
        suspended: false,
        suspensionReason: ''
      });
    }
  } else {
    // If user is not VIP but qualifies for VIP
    if (qualifiesForVIP) {
      await updateDoc(userRef, {
        role: 'vip'
      });
    }
  }
}
