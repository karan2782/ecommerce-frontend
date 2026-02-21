import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, cartAPI } from '../services/api';

function Home({ setCartCount }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchProducts();
    updateCartCount();
  }, [searchTerm, category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (category) params.category = category;
      
      const response = await productAPI.getAllProducts(params);
      setProducts(response.data.products);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const updateCartCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await cartAPI.getCart();
        setCartCount(response.data.cart.items.length);
      }
    } catch (err) {
      // Cart API call may fail if user not logged in
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to add items to cart');
        return;
      }

      await cartAPI.addToCart({ productId, quantity: 1 });
      updateCartCount();
      alert('Product added to cart!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding to cart');
    }
  };

  return (
    <div>
      <h1>Welcome to E-Shop</h1>
      
      {error && <div className="error-message">{error}</div>}

      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #ddd' }}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
          <option value="Home">Home</option>
        </select>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : products.length > 0 ? (
        <div className="products-grid">
          {products.map(product => (
            <div key={product._id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <div className="product-info">
                <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
                  <h3 className="product-name">{product.name}</h3>
                </Link>
                <p className="product-price">${product.price.toFixed(2)}</p>
                <p className="product-stock">Stock: {product.stock}</p>
                <div className="product-actions">
                  <Link to={`/product/${product._id}`} className="btn" style={{ flex: 1, textAlign: 'center' }}>
                    View Details
                  </Link>
                  <button 
                    onClick={() => handleAddToCart(product._id)}
                    className="btn"
                    style={{ flex: 1 }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: '#666' }}>No products found</p>
      )}
    </div>
  );
}

export default Home;
