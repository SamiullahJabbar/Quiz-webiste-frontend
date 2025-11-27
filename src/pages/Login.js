import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../css/login.css'; // Assuming the CSS file is present in '../css/login.css'

// --- CORRECT IMPORT STATEMENT ---
// This assumes you have 'baseurls.js' in '../api/' folder, as you specified.
import { TokenManager, BASE_URL } from '../api/baseurls';
// --- END CORRECT IMPORT STATEMENT ---


const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: Password
  const [formData, setFormData] = useState({
    // Initial email state, will be updated by the user in Step 1.
    email: '', 
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  // State for password visibility toggle
  const [showPassword, setShowPassword] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateEmail = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    
    // If email is valid, update formData with the trimmed email before proceeding
    if (Object.keys(newErrors).length === 0) {
        setFormData(prev => ({
            ...prev,
            email: formData.email.trim()
        }));
    }
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (validateEmail()) {
      setStep(2);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) return;

    setLoading(true);
    setErrors({});

    try {
      // API Call uses the imported BASE_URL
      const response = await fetch(`${BASE_URL}/accounts/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Use the imported TokenManager
        TokenManager.setToken(data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        navigate('/dashboard'); 
      } else {
        if (data.detail) {
          setErrors({ general: data.detail });
        } else if (data.non_field_errors) {
          setErrors({ general: data.non_field_errors[0] });
        } else {
          setErrors({ general: 'Login failed. Please check your credentials.' });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Network error. Please check your connection.' });
      // Remove or uncomment the navigate line once the API is working
      // navigate('/dashboard'); 
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep(1);
    setErrors({});
    // Clear password and general errors when going back
    setFormData(prev => ({
        ...prev,
        password: ''
    }));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          {/* Logo: Blue circle with Acorn icon */}
          <div className="logo">
            <div className="logo-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                  <path d="M12 3L1 9l11 6 9-4.91V17h2V9zM12 15.99L3.5 10.99 12 5.99l8.5 5.01-8.5 5zm0-2.43V8.57L8 10.99l4 2.57zm0 0.86l4-2.57-4-2.57z"/>
                </svg>
            </div>
          </div>
          
          {step === 1 ? (
            <>
              <h2>Sign In</h2>
            </>
          ) : (
            <>
              <h2>Verify with your password</h2>
              {/* User Email displayed in Step 2 */}
              <p className="user-email">
                <span className="email-icon">👤</span>
                {formData.email}
              </p>
            </>
          )}
        </div>

        {errors.general && (
          <div className="error-message general-error">
            <span className="error-icon">⚠️</span>
            {errors.general}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email} 
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                autoFocus
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            <button type="submit" className="login-btn">
              Next
            </button>

            {/* Step 1 Help Links */}
            <div className="help-links">
              <Link to="/unlock-account" className="help-link-item">Unlock account?</Link>
              <Link to="/student-help" className="help-link-item">Student Help</Link>
              <Link to="/professional-help" className="help-link-item">Professional Help</Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  autoFocus
                />
                <button 
                  type="button" 
                  className="toggle-password"
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <span className='eye-icon-span'>{showPassword ? '' : ''}</span>
                </button>
              </div>
              {errors.password && (
                <span className="error-text">{errors.password}</span>
              )}
            </div>

            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </button>

            {/* Step 2 Links */}
            <div className="password-options">
              <Link to="/forgot-password" className="link-only forgot-password">
                Forgot password?
              </Link>
              
              <Link to="/alternative-verify" className="link-only alternative-verify">
                Verify with something else
              </Link>

              <button 
                type="button" 
                className="link-only back-button"
                onClick={handleBackToEmail}
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* Register Link */}
        <div className="register-link">
          <Link to="/" className="register-link-text">Don't have an account? Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;