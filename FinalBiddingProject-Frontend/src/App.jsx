import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
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
import CreateLiveBids from './components/CreateLiveBids'; // Import CreateLiveBids component
import ItemDetails from './components/ItemDetails'; // Import the ItemDetails component

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // State for newly created items
  const [newItems, setNewItems] = useState([]);

  // Add new items to the state
  const addItem = (newItem) => {
    setNewItems((prevItems) => [...prevItems, newItem]);
  };

  // Fetch user data from Firestore
  const fetchUserData = async (user) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setCurrentUser({ uid: user.uid, email: user.email, ...userDoc.data() });
      } else {
        console.error('No user data found in Firestore.');
        setCurrentUser({ uid: user.uid, email: user.email, role: 'visitor' }); // Default to visitor role
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('User is logged in:', user);
        await fetchUserData(user);
      } else {
        console.log('No user logged in.');
        setCurrentUser(null);
      }
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  // Modal Handlers
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
          {/* Home Page */}
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
          {/* Item Listings */}
          <Route
            path="/items"
            element={<ItemListings newItems={newItems} />}
          />
          {/* Item Details */}
          <Route
            path="/items/:id"
            element={<ItemDetails currentUser={currentUser} />}
          />
          {/* Create Item */}
          <Route
            path="/create-item"
            element={<CreateItem addItem={addItem} />}
          />
          {/* Profile */}
          <Route
            path="/profile"
            element={currentUser ? <Profile /> : <Navigate to="/" replace />}
          />
          {/* More Info */}
          <Route path="/more-info" element={<MoreInfo />} />
          {/* Verification Question */}
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
          {/* Comments */}
          <Route path="/items/:id/comments" element={<Comments />} />
          {/* Ratings */}
          <Route path="/Ratings" element={<TransactionRating />} />
          {/* Deposit */}
          <Route
            path="/deposit"
            element={currentUser ? <Deposit /> : <Navigate to="/" replace />}
          />
          {/* Withdraw */}
          <Route
            path="/withdraw"
            element={currentUser ? <Withdraw /> : <Navigate to="/" replace />}
          />
          {/* Live Bidding */}
          <Route
            path="/LiveBidding"
            element={
              currentUser?.role?.toLowerCase() === 'vip' ? (
                <LiveBidding currentUser={currentUser} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          {/* Create Live Bids */}
          <Route
            path="/CreateLiveBids"
            element={
              currentUser?.role?.toLowerCase() === 'vip' ? (
                <CreateLiveBids currentUser={currentUser} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          {/* 404 Page */}
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

