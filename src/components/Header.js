import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header({ user, onLogout, cartCount }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header>
      <nav className="nav-container">
        <Link to="/" className="logo">
          🛍️ E-Shop
        </Link>
        
        <ul>
          <li><Link to="/">Home</Link></li>
          {user ? (
            <>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/orders">Orders</Link></li>
              <li>
                <Link to="/cart" className="cart-icon">
                  🛒
                  {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </Link>
              </li>
              <li><button onClick={handleLogout} className="btn btn-secondary" style={{padding: '0.5rem 1rem'}}>Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li>
                <Link to="/cart" className="cart-icon">
                  🛒
                  {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
