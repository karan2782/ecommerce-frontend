import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

import './App.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function App() {
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <Elements stripe={stripePromise}>
        <Header user={user} onLogout={handleLogout} cartCount={cartCount} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home setCartCount={setCartCount} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route
              path="/cart"
              element={<PrivateRoute user={user}><Cart setCartCount={setCartCount} /></PrivateRoute>}
            />
            <Route
              path="/checkout"
              element={<PrivateRoute user={user}><Checkout /></PrivateRoute>}
            />
            <Route
              path="/orders"
              element={<PrivateRoute user={user}><Orders /></PrivateRoute>}
            />
            <Route
              path="/profile"
              element={<PrivateRoute user={user}><Profile setUser={setUser} /></PrivateRoute>}
            />
          </Routes>
        </main>
        <Footer />
      </Elements>
    </Router>
  );
}

export default App;
