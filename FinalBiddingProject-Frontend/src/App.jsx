// frontend/src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Banner from './components/Banner';
import Features from './components/Features';
import UserTypes from './components/UserTypes';
import ItemListings from './components/ItemListings';
import ItemDetails from './components/ItemDetails';
import LoginModal from './components/LoginModal';
import RegistrationModal from './components/RegistrationModal';
import Login from './components/Login'; // New standalone Login component
import Register from './components/Register'; // New standalone Registration component
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import Account from './components/Account';
import CreateItem from './components/CreateItem';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  const openLoginModal = () => setIsLoginOpen(true);
  const closeLoginModal = () => setIsLoginOpen(false);

  const openRegistrationModal = () => setIsRegistrationOpen(true);
  const closeRegistrationModal = () => setIsRegistrationOpen(false);

  return (
    <Router>
      <Header onLoginClick={openLoginModal} onRegisterClick={openRegistrationModal} />
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
        <Route path="/items/:id" element={<ItemDetails />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/account" element={<Account />} />
        <Route path="/create-item" element={<CreateItem />} />
        <Route path="/login" element={<Login />} /> {/* Standalone Login */}
        <Route path="/register" element={<Register />} /> {/* Standalone Registration */}
      </Routes>
      <Footer />
      <LoginModal isOpen={isLoginOpen} onClose={closeLoginModal} />
      <RegistrationModal isOpen={isRegistrationOpen} onClose={closeRegistrationModal} />
    </Router>
  );
}

export default App;
