// src/App.jsx
import React, { useState } from 'react';
import LoginModal from './components/LoginModal';
import Header from './components/Header';
import Banner from './components/Banner';
import Features from './components/Features';
import UserTypes from './components/UserTypes';
import Footer from './components/Footer';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLoginModal = () => {
    setIsLoginOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginOpen(false);
  };

  return (
    <div>
      <Header onLoginClick={openLoginModal} />
      <Banner />
      <Features />
      <UserTypes />
      <Footer />
      <LoginModal isOpen={isLoginOpen} onClose={closeLoginModal} />
    </div>
  );
}

export default App;
