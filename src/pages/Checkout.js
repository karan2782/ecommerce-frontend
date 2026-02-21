import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI, orderAPI } from '../services/api';

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartAPI.getCart();
      setCart(response.data.cart);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching cart');
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');

      // Validate address
      if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.zipCode) {
        setError('Please fill all address fields');
        setLoading(false);
        return;
      }

      // Create COD order
      await orderAPI.createOrder({ 
        shippingAddress, 
        paymentMethod: 'cod' 
      });
      
      alert('Order placed successfully! You will pay cash on delivery.');
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart) {
    return <div className="spinner"></div>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="checkout-form">
        <p>Your cart is empty. Please add items before proceeding to checkout.</p>
      </div>
    );
  }

  return (
    <div className="checkout-form">
      <h1>Checkout</h1>

      {error && <div className="error-message">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          <h2>Shipping Address</h2>
          <form onSubmit={handlePlaceOrder}>
            <div className="form-group">
              <label>Street Address</label>
              <input
                type="text"
                name="street"
                value={shippingAddress.street}
                onChange={handleAddressChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleAddressChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={shippingAddress.zipCode}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input
                  type="text"
                  name="country"
                  value={shippingAddress.country}
                  onChange={handleAddressChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Payment Method</label>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '1rem', 
                backgroundColor: '#f0f8ff', 
                borderRadius: '4px',
                border: '2px solid #007bff'
              }}>
                <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>💵</span>
                <div>
                  <strong>Cash on Delivery (COD)</strong>
                  <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.25rem' }}>
                    Pay cash when your order arrives. No additional fees.
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn" 
              style={{ width: '100%' }} 
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Place Order (COD)'}
            </button>
          </form>
        </div>

        <div>
          <h2>Order Summary</h2>
          <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '4px' }}>
            {cart.items.map(item => (
              <div key={item.product._id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
                <p><strong>{item.product.name}</strong></p>
                <p>Qty: {item.quantity} x ${item.product.price.toFixed(2)}</p>
                <p>${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}

            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #ddd' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Subtotal:</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: '#ff6b6b' }}>
                <span>Total:</span>
                <span>${cart.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
