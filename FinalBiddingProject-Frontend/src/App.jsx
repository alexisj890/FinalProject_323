import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

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

    return () => unsubscribe();
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
              <UserTypes />
            </>
          }
        />
        <Route path="/items" element={<ItemListings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/more-info" element={<MoreInfo />} /> {/* Add MoreInfo route */}
        <Route path="/verification-question" element={<VerificationQuestion />} />
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
    </Router>
  );
}

export default App;
