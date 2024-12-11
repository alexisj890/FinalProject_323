import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
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

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is logged in:', user); // Debug log
        setCurrentUser(user);
      } else {
        console.log('No user logged in'); // Debug log
        setCurrentUser(null);
      }
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);
  const openRegistrationModal = () => setIsRegistrationOpen(true);
  const closeRegistrationModal = () => setIsRegistrationOpen(false);

  return (
    <Router>
      <div className="App">
        <Header
          onLoginClick={openLoginModal}
          onRegisterClick={openRegistrationModal}
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
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
          <Route path="/items" element={<ItemListings />} />
          <Route path="/profile" element={<Profile />} />
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
          <Route path="/Ratings" element={<TransactionRating />} /> {/* New route */}
          <Route
            path="*"
            element={<h1 style={{ textAlign: 'center' }}>404 - Page Not Found</h1>}
          />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/withdraw" element={<Withdraw />} />
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
