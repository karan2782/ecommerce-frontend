import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI, cartAPI } from '../services/api';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getProductById(id);
      setProduct(response.data.product);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to add items to cart');
        navigate('/login');
        return;
      }

      if (quantity > product.stock) {
        setError('Insufficient stock');
        return;
      }

      await cartAPI.addToCart({ productId: id, quantity });
      alert('Product added to cart!');
      navigate('/cart');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding to cart');
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!product) {
    return <div className="error-message">Product not found</div>;
  }

  return (
    <div className="product-detail">
      <div>
        <img src={product.image} alt={product.name} className="product-image-large" />
      </div>

      <div className="product-details-content">
        <h1>{product.name}</h1>
        
        <div className="price">${product.price.toFixed(2)}</div>
        
        <div className="stock">
          Stock Available: <strong>{product.stock}</strong>
        </div>

        <div className="description">
          {product.description}
        </div>

        <div className="description">
          <strong>Category:</strong> {product.category}
        </div>

        {product.numReviews > 0 && (
          <div className="description">
            <strong>Rating:</strong> {product.rating} / 5 ({product.numReviews} reviews)
          </div>
        )}

        <div className="quantity-selector">
          <label>Quantity:</label>
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <input 
            type="number" 
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            max={product.stock}
          />
          <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
        </div>

        {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}

        <button
          onClick={handleAddToCart}
          className="btn"
          disabled={product.stock === 0}
          style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}
        >
          {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
