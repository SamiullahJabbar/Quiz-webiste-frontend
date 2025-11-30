import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TokenManager, BASE_URL } from '../api/baseurls';
import '../css/register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    date_of_birth: '',
    education: '',
    password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // New state for OTP verification
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']); 
  const [otpError, setOtpError] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  
  // STATE for showing success message inside the modal
  const [successMessage, setSuccessMessage] = useState(''); 

  const otpInputRefs = useRef([]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name] || errors.general) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
        general: errors.general && name === 'email' ? errors.general : ''
      }));
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value) || value.length > 1) return;

    setOtp(prevOtp => {
        const newOtp = [...prevOtp];
        newOtp[index] = value;

        if (value !== '' && index < newOtp.length - 1) {
            setTimeout(() => {
                if (otpInputRefs.current[index + 1]) {
                    otpInputRefs.current[index + 1].focus();
                }
            }, 0);
        }

        return newOtp;
    });
    
    if (otpError) {
      setOtpError('');
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        setOtp(prevOtp => {
            const newOtp = [...prevOtp];
            newOtp[index - 1] = '';
            return newOtp;
        });

        setTimeout(() => {
            if (otpInputRefs.current[index - 1]) {
                otpInputRefs.current[index - 1].focus();
            }
        }, 0);
      } else if (otp[index] !== '') {
        setOtp(prevOtp => {
            const newOtp = [...prevOtp];
            newOtp[index] = '';
            return newOtp;
        });
        e.preventDefault(); 
      }
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    // ... (Validation logic remains the same) ...
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
    } else {
      const dob = new Date(formData.date_of_birth);
      const today = new Date();
      const ageDiff = today.getTime() - dob.getTime();
      const ageDate = new Date(ageDiff); 
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      
      if (age < 5) {
        newErrors.date_of_birth = 'You must be at least 5 years old';
      } else if (age > 100) {
        newErrors.date_of_birth = 'Please enter a valid date of birth';
      }
    }

    if (!formData.education) {
      newErrors.education = 'Please select your education level';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password';
    } else if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${BASE_URL}/accounts/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          date_of_birth: formData.date_of_birth,
          education: formData.education,
          password: formData.password,
          confirm_password: formData.confirm_password, 
        })
      });

      const data = await response.json();

      if (response.ok) {
        setRegisteredEmail(formData.email);
        setShowOtpModal(true);
        setOtp(['', '', '', '', '', '']); 
      } else {
        const newErrors = {};
        // ... (Error parsing logic remains the same) ...
        if (data.detail) {
            newErrors.general = data.detail;
        } else if (typeof data === 'object') {
            let foundSpecificError = false;
            
            for (const key in data) {
                if (Array.isArray(data[key]) && data[key].length > 0) {
                    if (key === 'non_field_errors') {
                        newErrors.general = data[key][0];
                        foundSpecificError = true;
                    } else {
                        newErrors[key] = data[key][0];
                        foundSpecificError = true;
                    }
                }
            }

            if (!foundSpecificError) {
                newErrors.general = 'Registration failed due to an unknown error. Please try again.';
            }
        } else {
            newErrors.general = 'Registration failed. Please check your details and try again.';
        }
        
        setErrors(newErrors);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Network error. Please check your connection.' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleOtpVerification = async (e) => {
    e.preventDefault();
    
    const fullOtp = otp.join('');

    if (fullOtp.length !== 6 || isNaN(Number(fullOtp))) {
      setOtpError('Please enter the complete 6-digit OTP.');
      return;
    }

    setLoading(true);
    setOtpError('');

    try {
      const response = await fetch(`${BASE_URL}/accounts/verify-otp/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: registeredEmail, 
          otp: fullOtp 
        }) 
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message inside the modal and auto-redirect
        setSuccessMessage(data.message || "OTP verified successfully!");
        setLoading(false); // Stop loading immediately after success

        // Start 4-second countdown for redirect
        setTimeout(() => {
          setShowOtpModal(false);
          navigate('/login');
        }, 4000); 

      } else {
        // Handle OTP verification error
        if (data.message) {
          setOtpError(data.message);
        } else {
          setOtpError('OTP verification failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setOtpError('Network error during OTP verification. Please check your connection.');
    } finally {
        if (!successMessage) { // Only set loading false if we aren't about to redirect
            setLoading(false);
        }
    }
  };

  // OTP Modal Component
  const OtpModal = () => {
      useEffect(() => {
          // Focus the first input on modal open
          if (showOtpModal && otpInputRefs.current[0] && !successMessage) {
              requestAnimationFrame(() => {
                otpInputRefs.current[0].focus();
              });
          }
      }, [showOtpModal, successMessage]);


      return (
        <div className="otp-modal-overlay">
          <div className="otp-modal">
            
            {/* NEW: Conditional Rendering for Success State */}
            {successMessage ? (
              <>
                <div className="otp-modal-header single-message-header">
                  {/* Show close button */}
                  <span className="close-btn" onClick={() => {
                      setShowOtpModal(false);
                      navigate('/login'); // Redirect if user manually closes
                  }}>×</span>
                </div>
                
                <div className="otp-modal-body single-message-body">
                    <div className="otp-success-box">
                      <span className="success-icon"></span>
                      <p>{successMessage}</p>
                    </div>
                </div>
                
                {/* Empty footer */}
                <div className="otp-modal-footer"></div>
              </>
            ) : (
                /* Normal OTP Verification UI */
                <>
                <div className="otp-modal-header">
                  <h3>Verify Your Email Address</h3>
                  <span className="close-btn" onClick={() => setShowOtpModal(false)}>×</span>
                </div>
                
                <div className="otp-modal-body">
                    <p className="otp-instruction">
                        Please enter the 6-digit code sent to: 
                        <strong> {registeredEmail}</strong>.
                    </p>
                    
                    <form onSubmit={handleOtpVerification}>
                        <div className="otp-input-container">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => otpInputRefs.current[index] = el}
                                type="text"
                                inputMode="numeric"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleOtpChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className={`otp-input-box ${otpError ? 'error' : ''}`}
                            />
                        ))}
                        </div>

                        {otpError && (
                        <span className="error-text otp-error-text">{otpError}</span>
                        )}

                        <button 
                        type="submit" 
                        className="otp-verify-btn"
                        disabled={loading || otp.join('').length !== 6} 
                        >
                        {loading ? (
                            <>
                            <span className="loading-spinner"></span>
                            Verifying...
                            </>
                        ) : (
                            'Verify Account'
                        )}
                        </button>
                    </form>
                </div>
                
                <div className="otp-modal-footer">
                    <p>
                        Didn't receive the code? 
                        <button type="button" className="resend-btn" disabled={loading}>
                            Resend OTP
                        </button>
                    </p>
                </div>
                </>
            )}
          </div>
        </div>
      );
  };

  return (
    <>
      {/* 1. Main Registration Form */}
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <div className="logo">
              <div className="logo-icon">📚</div>
              <h1>EduTest</h1>
            </div>
            <h2>Create Your Account</h2>
            <p>Join thousands of students preparing for exams</p>
          </div>

          {errors.general && (
            <div className="error-message general-error">
              <span className="error-icon">⚠️</span>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            {/* Section 1: Personal & Email */}
            <div className="form-section">
              <h3 className="section-title">Personal Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">First Name</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={errors.first_name ? 'error' : ''}
                    placeholder="Enter your first name"
                  />
                  {errors.first_name && (
                    <span className="error-text">{errors.first_name}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="last_name">Last Name</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={errors.last_name ? 'error' : ''}
                    placeholder="Enter your last name"
                  />
                  {errors.last_name && (
                    <span className="error-text">{errors.last_name}</span>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <span className="error-text">{errors.email}</span>
                )}
              </div>
            </div>

            {/* Section 2: Education Details */}
            <div className="form-section">
              <h3 className="section-title">Academic Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date_of_birth">Date of Birth</label>
                  <input
                    type="date"
                    id="date_of_birth"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className={errors.date_of_birth ? 'error' : ''}
                  />
                  {errors.date_of_birth && (
                    <span className="error-text">{errors.date_of_birth}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="education">Education Level</label>
                  <select
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className={errors.education ? 'error' : ''}
                  >
                    <option value="">Select your level</option>
                    <option value="school">School Student</option>
                    <option value="college">College Student</option>
                    <option value="university">University Student</option>
                  </select>
                  {errors.education && (
                    <span className="error-text">{errors.education}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Security */}
            <div className="form-section">
              <h3 className="section-title">Security</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                    placeholder="Create a strong password"
                  />
                  {errors.password && (
                    <span className="error-text">{errors.password}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="confirm_password">Confirm Password</label>
                  <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className={errors.confirm_password ? 'error' : ''}
                    placeholder="Re-enter your password"
                  />
                  {errors.confirm_password && (
                    <span className="error-text">{errors.confirm_password}</span>
                  )}
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="register-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="login-link">
            <p>
              Already have an account? <Link to="/login" className="login-link-text">Sign in here</Link>
            </p>
          </div>

          <div className="privacy-notice">
            <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
      
      {/* 2. OTP Modal (Conditional Rendering) */}
      {showOtpModal && <OtpModal />}
    </>
  );
};

export default Register;