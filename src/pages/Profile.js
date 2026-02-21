import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function Profile({ setUser }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getProfile();
      setProfile({
        name: response.data.user.name,
        email: response.data.user.email,
        phone: response.data.user.phone || '',
        address: response.data.user.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      const response = await authAPI.updateProfile({
        name: profile.name,
        phone: profile.phone,
        address: profile.address
      });
      setSuccess('Profile updated successfully');
      setUser(response.data.user);
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    }
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="form-container" style={{ maxWidth: '600px' }}>
      <h1>My Profile</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleInputChange}
            disabled={!editing}
          />
        </div>

        <div className="form-group">
          <label>Email (Cannot be changed)</label>
          <input
            type="email"
            value={profile.email}
            disabled
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleInputChange}
            disabled={!editing}
          />
        </div>

        <h3>Address</h3>

        <div className="form-group">
          <label>Street Address</label>
          <input
            type="text"
            name="street"
            value={profile.address.street}
            onChange={handleAddressChange}
            disabled={!editing}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={profile.address.city}
              onChange={handleAddressChange}
              disabled={!editing}
            />
          </div>
          <div className="form-group">
            <label>State</label>
            <input
              type="text"
              name="state"
              value={profile.address.state}
              onChange={handleAddressChange}
              disabled={!editing}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Zip Code</label>
            <input
              type="text"
              name="zipCode"
              value={profile.address.zipCode}
              onChange={handleAddressChange}
              disabled={!editing}
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              name="country"
              value={profile.address.country}
              onChange={handleAddressChange}
              disabled={!editing}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          {!editing ? (
            <button
              type="button"
              className="btn"
              onClick={() => setEditing(true)}
              style={{ flex: 1 }}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button type="submit" className="btn" style={{ flex: 1 }}>
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditing(false);
                  fetchProfile();
                }}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default Profile;
