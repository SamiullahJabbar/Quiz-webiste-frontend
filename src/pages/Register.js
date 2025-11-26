import React, { useState } from 'react';
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

  const validateForm = () => {
    const newErrors = {};

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
      // Basic age check (simplified for code example)
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
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Auto login after successful registration
        const loginResponse = await fetch(`${BASE_URL}/accounts/login/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok && loginData.token) {
          TokenManager.setToken(loginData.token);
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      } else {
        if (data.email) {
          setErrors({ email: data.email[0] });
        } else if (data.non_field_errors) {
          setErrors({ general: data.non_field_errors[0] });
        } else {
          setErrors({ general: 'Registration failed. Please try again.' });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Network error. Please check your connection.' });
    } finally {
      setLoading(false);
    }
  };

  return (
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
          {/* Section 1: Personal & Email - Combined to reduce vertical space */}
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
            
            {/* Email is kept full width for prominence */}
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

          {/* Section 2: Education Details - Compacted */}
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

          {/* Section 3: Security - Compacted */}
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
  );
};

export default Register;