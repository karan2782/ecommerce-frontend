import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartAPI } from '../services/api';

function Cart({ setCartCount }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data.cart);
      setCartCount(response.data.cart.items.length);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching cart');
    } finally {
      setLoading(false);
    }
  }, [setCartCount]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleRemoveItem = async (productId) => {
    try {
      await cartAPI.removeFromCart({ productId });
      fetchCart();
      alert('Item removed from cart');
    } catch (err) {
      setError(err.response?.data?.message || 'Error removing item');
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    try {
      await cartAPI.updateQuantity({ productId, quantity });
      fetchCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating quantity');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await cartAPI.clearCart();
        fetchCart();
        alert('Cart cleared');
      } catch (err) {
        setError(err.response?.data?.message || 'Error clearing cart');
      }
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-container">
        <div className="cart-empty">
          <h2>Your cart is empty</h2>
          <Link to="/" className="btn">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      
      {error && <div className="error-message">{error}</div>}

      <div className="cart-items">
        {cart.items.map(item => (
          <div key={item.product._id} className="cart-item">
            <img src={item.product.image} alt={item.product.name} className="cart-item-image" />
            
            <div className="cart-item-info">
              <h3>{item.product.name}</h3>
              <p>${item.product.price.toFixed(2)}</p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <input
                type="number"
                min="1"
                max={item.product.stock}
                value={item.quantity}
                onChange={(e) => handleUpdateQuantity(item.product._id, parseInt(e.target.value))}
                style={{ width: '60px', textAlign: 'center' }}
              />
            </div>

            <div style={{ textAlign: 'right' }}>
              <strong>${(item.product.price * item.quantity).toFixed(2)}</strong>
            </div>

            <button
              onClick={() => handleRemoveItem(item.product._id)}
              style={{ padding: '0.5rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${cart.totalPrice.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>${cart.totalPrice.toFixed(2)}</span>
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
          <Link to="/" className="btn btn-secondary" style={{ flex: 1, textAlign: 'center' }}>
            Continue Shopping
          </Link>
          <button onClick={handleClearCart} className="btn btn-secondary">
            Clear Cart
          </button>
        </div>

        {cart.items.length > 0 && (
          <button
            onClick={() => navigate('/checkout')}
            className="btn"
            style={{ width: '100%', marginTop: '1rem', fontSize: '1.1rem', padding: '0.75rem' }}
          >
            Proceed to Checkout
          </button>
        )}
      </div>
    </div>
  );
}

export default Cart;
