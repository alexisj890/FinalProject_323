import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Note: Use setDoc if doc doesn't exist
import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import RegistrationModal from './components/RegistrationModal';
import Banner from './components/Banner';
import Features from './components/Features';
import UserTypes from './components/UserTypes';
import ItemListings from './components/ItemListings';
import Profile from './components/Profile';
import MoreInfo from './components/MoreInfo';
import VerificationQuestion from './components/VerificationQuestion';
import Comments from './components/Comments';
import TransactionRating from './components/TransactionRating';
import Sidebar from './components/Sidebar';
import Deposit from './components/Deposit';
import Withdraw from './components/Withdraw';
import CreateItem from './components/CreateItem';
import LiveBidding from './components/LiveBidding';
import ItemDetails from './components/ItemDetails';
import RateUser from './components/RateUser';
import ComplaintForm from './components/ComplaintForm';
import CreateLiveBids from './components/CreateLiveBids';
import { updateUserRoleStatus } from './utils/updateUserRoleStatus';

import SuperUserDashboard from './components/SuperUserDashboard'; // Un-commented

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [newItems, setNewItems] = useState([]);

  const addItem = (newItem) => {
    setNewItems((prevItems) => [...prevItems, newItem]);
  };

  const fetchUserData = async (user) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      let userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        // If no user data, create it and set them as visitor
        await setDoc(userRef, { 
          role: 'visitor',
          balance: 0,
          transactionCount: 0,
          complaintCount: 0,
        });
        userDoc = await getDoc(userRef);
      }

      // Update currentUser state
      setCurrentUser({ uid: user.uid, email: user.email, ...userDoc.data() });

      // Ensure role status is up-to-date
      await updateUserRoleStatus(user.uid);
      const refreshedDoc = await getDoc(userRef);
      setCurrentUser({ uid: user.uid, email: user.email, ...refreshedDoc.data() });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchUserData(user);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);
  const openRegistrationModal = () => setIsRegistrationOpen(true);
  const closeRegistrationModal = () => setIsRegistrationOpen(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Router>
      <div className="App">
        <Header
          onLoginClick={openLoginModal}
          onRegisterClick={openRegistrationModal}
          toggleSidebar={toggleSidebar}
          currentUser={currentUser}
        />
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          currentUser={currentUser}
        />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Banner />
                <Features />
                <UserTypes currentUser={currentUser} />
              </>
            }
          />
          <Route path="/items" element={<ItemListings newItems={newItems} />} />
          <Route path="/items/:id" element={<ItemDetails currentUser={currentUser} />} />
          <Route path="/create-item" element={<CreateItem addItem={addItem} currentUser={currentUser} />} />
          <Route path="/profile" element={currentUser ? <Profile /> : <Navigate to="/" replace />} />
          <Route path="/more-info" element={<MoreInfo />} />
          <Route
            path="/verification-question"
            element={
              currentUser ? (
                <VerificationQuestion currentUser={currentUser} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/items/:id/comments" element={<Comments />} />
          <Route path="/Ratings" element={<TransactionRating />} />
          <Route
            path="/deposit"
            element={currentUser ? <Deposit /> : <Navigate to="/" replace />}
          />
          <Route
            path="/withdraw"
            element={currentUser ? <Withdraw /> : <Navigate to="/" replace />}
          />
          <Route
            path="/LiveBidding"
            element={
              currentUser?.role === 'vip' ? (
                <LiveBidding currentUser={currentUser} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/CreateLiveBids"
            element={
              currentUser?.role === 'vip' ? (
                <CreateLiveBids currentUser={currentUser} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/items/:id/rate-owner"
            element={currentUser ? <RateUser currentUser={currentUser} /> : <Navigate to="/" replace />}
          />
          <Route
            path="/items/:id/rate-buyer"
            element={currentUser ? <RateUser currentUser={currentUser} /> : <Navigate to="/" replace />}
          />
          <Route
            path="/items/:id/complain"
            element={currentUser ? <ComplaintForm currentUser={currentUser} /> : <Navigate to="/" replace />}
          />
          <Route
            path="/superuser-dashboard"
            element={
              currentUser?.username === '322Bidding' ? (
                <SuperUserDashboard currentUser={currentUser} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="*"
            element={<h1 style={{ textAlign: 'center' }}>404 - Page Not Found</h1>}
          />
        </Routes>
        <Footer />
        <LoginModal
          isOpen={isLoginOpen}
          onClose={closeLoginModal}
          setCurrentUser={setCurrentUser}
        />
        <RegistrationModal
          isOpen={isRegistrationOpen}
          onClose={closeRegistrationModal}
        />
      </div>
    </Router>
  );
}

export default App;
