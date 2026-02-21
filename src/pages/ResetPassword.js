import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    // You could add a token validation check here if needed
    // For now, we'll assume the token is valid until we try to reset
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setMessage('');

      const response = await authAPI.resetPassword(token, { password });
      
      setMessage(response.data.message);
      setTokenValid(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password');
      setTokenValid(false);
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid && error) {
    return (
      <div className="auth-form">
        <h1>Invalid Reset Link</h1>
        <div className="error-message">
          {error}
        </div>
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p>
            Need a new reset link?{' '}
            <button 
              onClick={() => navigate('/forgot-password')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#007bff', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Request Again
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-form">
      <h1>Reset Password</h1>
      <p>Enter your new password below.</p>
      
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      
      {!message && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter new password"
              minLength="6"
            />
          </div>
          
          <div className="form-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
              minLength="6"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn" 
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
      
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <p>
          Remember your password?{' '}
          <button 
            onClick={() => navigate('/login')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#007bff', 
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
