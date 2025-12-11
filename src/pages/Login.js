import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';

import { TokenManager, BASE_URL } from '../api/baseurls';

import bottomImage from '../images/button-cion.png'; 
import topLogo from '../images/logo.png'; 

// Back Icon SVG
const BackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20" fill="#494949">
    <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>
  </svg>
);

// Announcement Icon SVG
const AnnouncementIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="18" height="18" fill="#585858">
    <path d="M525.2 82.9C536.7 88 544 99.4 544 112L544 528C544 540.6 536.7 552 525.2 557.1C513.7 562.2 500.4 560.3 490.9 552L444.3 511.3C400.7 473.2 345.6 451 287.9 448.3L287.9 544C287.9 561.7 273.6 576 255.9 576L223.9 576C206.2 576 191.9 561.7 191.9 544L191.9 448C121.3 448 64 390.7 64 320C64 249.3 121.3 192 192 192L276.5 192C338.3 191.8 397.9 169.3 444.4 128.7L491 88C500.4 79.7 513.9 77.8 525.3 82.9zM288 384L288 384.2C358.3 386.9 425.8 412.7 480 457.6L480 182.3C425.8 227.2 358.3 253 288 255.7L288 384z"/>
  </svg>
);

const EducatorLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); 

  
  const handleBack = () => {
    navigate('/'); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Errors ko clear karna
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (errors.general) {
        setErrors(prev => ({
            ...prev,
            general: ''
        }));
    }
  };
  
  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Login API call ko handle karne ke liye
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; 

    setLoading(true);
    setErrors({}); 

    try {
      const response = await fetch(`${BASE_URL}/accounts/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login
        TokenManager.setToken(data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        navigate('/dashboard'); 
      } else {
        // Error handling
        const errorMessage = data.detail || (data.non_field_errors && data.non_field_errors[0]) || 'Login failed. Please check your credentials.';
        setErrors({ general: errorMessage });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Network error. Please check your connection or the server status.' });
    } finally {
      setLoading(false);
    }
  };

  // Check if button should be active
  const isFormValidForSubmission = formData.email.trim() && formData.password.trim();


  return (
    <div className="login-container">
      {/* Background Illustration/Icons */}
      <img src={bottomImage} alt="Decorative Icons" className="background-illustration" />

      
      <div className="login-card-wrapper">
        <div className="login-card">

          {/* Logo Section */}
          <div className="logo-section">
            <img src={topLogo} alt="Bluebook Logo" className="bluebook-logo" />
          </div>

        
          <button className="back-link" onClick={handleBack}>
            <BackIcon />
            <span className="back-text">Back</span>
          </button>

          {/* Header */}
          <h2 className="card-title">Sign In with an Educator Account</h2>

          {/* Alert Message with Icon */}
          <div className="alert-message-bluebook">
            <AnnouncementIcon />
            <span className="alert-text">
              You may need to <span style={{color: '#324dc7', fontWeight: '500'}}>update your College Board account</span>.
            </span>
          </div>
          
          {/* General API Error Message */}
          {errors.general && (
            <div className="api-error-message">
              ⚠️ {errors.general}
            </div>
          )}

          {/* Login Form */}
          <form className="login-form" onSubmit={handleLogin}>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="" 
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            {/* Password Field */}
            <div className="form-group password-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  id="password" 
                  name="password" 
                  placeholder="" 
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                />
             
                <span 
                  className="password-toggle-icon"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                        d={showPassword 
                            ? "M12 7c2.76 0 5 2.24 5 5 0 .55-.45 1-1 1s-1-.45-1-1c0-1.65-1.35-3-3-3s-3 1.35-3 3c0 .55-.45 1-1 1s-1-.45-1-1c0-2.76 2.24-5 5-5zm0-4.5c-5 0-9.27 3.11-11 7.5 1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3z" 
                            : "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3z" 
                        } 
                        fill="#999"
                    />
                  </svg>
                </span>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
              <a href="/forgot-password" className="forgot-password-link">Forgot password?</a>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`submit-button ${isFormValidForSubmission && !loading ? 'active-button' : ''}`}
              disabled={loading || !isFormValidForSubmission}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </button>

            {/* Need Help Link */}
            <a href="/help-signing-in" className="help-link">
              Need help signing in?
            </a>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EducatorLogin;