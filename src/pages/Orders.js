import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getUserOrders();
      setOrders(response.data.orders);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="orders-container">
        <div className="cart-empty">
          <h2>No orders yet</h2>
          <p>You haven't placed any orders yet.</p>
          <Link to="/" className="btn">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>My Orders</h1>

      {error && <div className="error-message">{error}</div>}

      <div>
        {orders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div>
                <div className="order-id">Order ID: {order._id}</div>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`order-status ${order.orderStatus.toLowerCase()}`}>
                  {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                </span>
              </div>
            </div>

            <div className="order-items">
              <h3>Items:</h3>
              {order.items.map(item => (
                <div key={item.product._id} className="order-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong>{item.product.name}</strong>
                      <p style={{ color: '#666', fontSize: '0.9rem' }}>
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p>${item.price.toFixed(2)}</p>
                      <p style={{ fontWeight: 'bold' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Shipping Address:</span>
                <span>
                  {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Payment Status:</span>
                <span>
                  <span className={`order-status ${order.paymentStatus.toLowerCase()}`} style={{ marginLeft: '0.5rem' }}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </span>
              </div>
              <div className="order-total">
                Total: ${order.totalPrice.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link to="/" className="btn" style={{ marginTop: '2rem' }}>Continue Shopping</Link>
    </div>
  );
}

export default Orders;
