// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; // Ensure correct path
import Header from './components/Header';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import RegistrationModal from './components/RegistrationModal';
import Banner from './components/Banner';
import Features from './components/Features';
import UserTypes from './components/UserTypes';
import ItemListings from './components/ItemListings';
// ... import other components as needed

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is logged in:', user.uid);
        setCurrentUser(user);
      } else {
        console.log('No user is logged in');
        setCurrentUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);

  const openRegistrationModal = () => setIsRegistrationOpen(true);
  const closeRegistrationModal = () => setIsRegistrationOpen(false);

  return (
    <Router>
      <Header
        onLoginClick={openLoginModal}
        onRegisterClick={openRegistrationModal}
        currentUser={currentUser} // Pass currentUser to Header
      />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Banner />
              <Features />
              <UserTypes />
            </>
          }
        />
        <Route path="/items" element={<ItemListings />} />
        {/* ... other routes */}
      </Routes>
      <Footer />
      <LoginModal isOpen={isLoginOpen} onClose={closeLoginModal} />
      <RegistrationModal isOpen={isRegistrationOpen} onClose={closeRegistrationModal} />
    </Router>
  );
}

export default App;
