import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TokenManager, BASE_URL } from '../api/baseurls';
import '../css/dashboard.css';

// --- Static Data for Bluebook-style Tiles ---
const StaticTestTiles = [
    { name: 'Test Preview', description: 'Quick look at the test format and tools.', icon: '⏱️' },
    { name: 'Full-Length Practice', description: 'Simulate a real test environment.', icon: '📄' },
];

const BigFutureCard = {
    title: 'Plan for Life After High School',
    description: "Whether you're interested in a four-year university, community college, or career training, BigFuture has what you need to start planning your future, your way.",
};
// --- End Static Data ---

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ first_name: 'Khan', last_name: 'Jabbar' }); 
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Active'); 
  const [practiceTab, setPracticeTab] = useState('Active'); 
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
    fetchTests(); 
  }, []);

  const fetchUserData = () => {
    try {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchTests = async () => {
    try {
      const token = TokenManager.getToken();
      if (!token) {
        TokenManager.removeToken && TokenManager.removeToken(); 
        navigate('/login');
        return;
      }

      const response = await fetch(`${BASE_URL}/tests/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const testsData = await response.json();
        setTests(testsData);
      } else if (response.status === 401) {
        TokenManager.removeToken && TokenManager.removeToken(); 
        navigate('/login');
      } else {
        setError('Failed to fetch tests');
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
      setError('Network error. Please try again.');
    } finally {
      setTimeout(() => setLoading(false), 500); 
    }
  };

  const handleStartTest = (testCode) => {
    // Redirects to TestCodeVerification page
    navigate('/TestCodeVerification', { state: { preFilledCode: testCode } });
  };

  const handleLogout = () => {
    TokenManager.removeToken && TokenManager.removeToken();
    localStorage.removeItem('user_data');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || 'U';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });
  };

  const isTestActive = (test) => {
    const now = new Date();
    const startTime = new Date(test.start_time);
    const endTime = new Date(test.end_time);
    return now >= startTime && now <= endTime;
  };

  const isTestUpcoming = (test) => {
    const now = new Date();
    const startTime = new Date(test.start_time);
    return now < startTime;
  };

  const isTestPast = (test) => {
    const now = new Date();
    const endTime = new Date(test.end_time);
    return now > endTime;
  };

  // Filter tests based on active tab
  const getFilteredTests = () => {
    if (activeTab === 'Active') {
      // Active tab shows tests that are currently running OR upcoming (non-past)
      return tests.filter(test => !isTestPast(test));
    } else {
      // Past tab shows tests that have ended
      return tests.filter(test => isTestPast(test));
    }
  };

  const filteredTests = getFilteredTests();

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner-large"></div>
      </div>
    );
  }

  const welcomeName = user?.first_name || 'User';

  return (
    <div className="dashboard-container">
      {/* --- Header (Bluebook Style) --- */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand">
            <span className="bluebook-logo">
              <span className="logo-star"></span> Master Quiz
            </span>
          </div>
          
          <div className="user-section">
            <span className="user-name-header">{`${user.first_name || ''} ${user.last_name || ''}`}</span>
            <div className="user-avatar-header">
              {getUserInitials()}
            </div>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="dashboard-main">
        <div className="dashboard-content">

          {/* Welcome Section */}
          <div className="welcome-section">
            <h2>Welcome, {welcomeName}. Good luck on test day!</h2>
          </div>

          {/* Test Sections */}
          <div className="tests-and-practice-wrapper">
            
            {/* 1. Practice Tiles */}
            <div className="practice-tiles">
              {StaticTestTiles.map((tile) => (
                <div key={tile.name} className="tile-card">
                  <div className="tile-icon">{tile.icon}</div>
                  <h3 className="tile-name">{tile.name}</h3>
                  <p className="tile-description">{tile.description}</p>
                </div>
              ))}
            </div>

            {/* 2. Your Tests (Active / Past) */}
            <div className="your-tests-section">
              <div className="section-header-row">
                <h3>Your Tests</h3>
                <div className="tab-buttons">
                  <button 
                    className={`tab-btn ${activeTab === 'Active' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Active')}
                  >
                    Active
                  </button>
                  <button 
                    className={`tab-btn ${activeTab === 'Past' ? 'active' : ''}`}
                    onClick={() => setActiveTab('Past')}
                  >
                    Past
                  </button>
                </div>
              </div>

              <div className="test-list-content">
                {error && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                  </div>
                )}

                {/* Display Active/Upcoming Tests */}
                {activeTab === 'Active' && (
                  filteredTests.length === 0 ? (
                    <div className="no-upcoming-tests-card">
                      <h4>You Have No Upcoming Tests</h4>
                      <p>Tests appear here a few weeks before test day. If you got a paper ticket from your school, **sign out and sign in with it**.</p>
                    </div>
                  ) : (
                    <div className="active-tests-list">
                      {filteredTests.map((test) => {
                        const active = isTestActive(test);
                        const upcoming = isTestUpcoming(test);
                        
                        return (
                          <div key={test.id} className="test-card">
                            <div className="test-card-header">
                              <h4 className="test-title">{test.name}</h4>
                              {/* Test code removed */}
                            </div>
                            
                            <div className="test-details">
                              <div className="test-info-item">
                                <span className="info-label">Duration:</span>
                                <span className="info-value">{test.duration_minutes} mins</span>
                              </div>
                              <div className="test-info-item">
                                <span className="info-label">Questions:</span>
                                <span className="info-value">{test.questions?.length || 0}</span>
                              </div>
                              <div className="test-info-item">
                                <span className="info-label">Starts:</span>
                                <span className="info-value">{formatDate(test.start_time)}</span>
                              </div>
                              <div className="test-info-item">
                                <span className="info-label">Ends:</span>
                                <span className="info-value">{formatDate(test.end_time)}</span>
                              </div>
                            </div>

                            <div className="test-actions">
                              <button 
                                className={`start-test-btn ${active ? 'active' : 'upcoming'}`}
                                onClick={() => handleStartTest(test.code)}
                                disabled={!active} 
                              >
                                {active ? 'Start Test' : 'Starts Soon'}
                              </button>
                            </div>

                            {!active && upcoming && (
                              <div className="test-status">
                                <span className="status-upcoming">Available at {formatDate(test.start_time)}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )
                )}

                {/* Display Past Tests (Updated button) */}
                {activeTab === 'Past' && (
                  filteredTests.length === 0 ? (
                    <div className="empty-state">
                      <p>No past tests available.</p>
                    </div>
                  ) : (
                    <div className="past-tests-list">
                      {filteredTests.map((test) => (
                        <div key={test.id} className="test-card past">
                          <div className="test-card-header">
                            <h4 className="test-title">{test.name}</h4>
                          </div>
                          
                          <div className="test-details">
                            <div className="test-info-item">
                              <span className="info-label">Duration:</span>
                              <span className="info-value">{test.duration_minutes} mins</span>
                            </div>
                            <div className="test-info-item">
                              <span className="info-label">Questions:</span>
                              <span className="info-value">{test.questions?.length || 0}</span>
                            </div>
                            <div className="test-info-item">
                              <span className="info-label">Completed:</span>
                              <span className="info-value">{formatDate(test.end_time)}</span>
                            </div>
                          </div>

                          <div className="test-actions">
                            {/* Changed View Results to Start Test, maintaining its style for past state */}
                            <button 
                                className="view-results-btn" // Reusing the style for past tests
                                onClick={() => handleStartTest(test.code)}
                            >
                              Start Test
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
            
            {/* 3. Practice and Prepare */}
            <div className="practice-and-prepare-section">
                <div className="section-header-row">
                    <h3>Practice and Prepare</h3>
                    <div className="tab-buttons">
                        <button 
                            className={`tab-btn ${practiceTab === 'Active' ? 'active' : ''}`}
                            onClick={() => setPracticeTab('Active')}
                        >
                            Active
                        </button>
                        <button 
                            className={`tab-btn ${practiceTab === 'Past' ? 'active' : ''}`}
                            onClick={() => setPracticeTab('Past')}
                        >
                            Past
                        </button>
                    </div>
                    <Link to="/learn-practice" className="context-link">Learn more about practice</Link>
                </div>
                
                <div className="practice-content-area">
                  {practiceTab === 'Active' ? (
                    <div className="practice-active-content">
                      <p>Practice tests and materials will appear here when available.</p>
                      <div className="practice-options">
                        <button className="practice-option-btn">
                          Take Practice Test
                        </button>
                        <button className="practice-option-btn">
                          Review Study Materials
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <p>No past practice sessions available.</p>
                    </div>
                  )}
                </div>
            </div>
            
            {/* 4. Explore BigFuture */}
            <div className="explore-bigfuture-section">
                <h2>Explore BigFuture</h2>
                <div className="bigfuture-card">
                    <div className="bigfuture-image-container">
                        <div className="image-placeholder">
                          🎓
                        </div>
                    </div>
                    <div className="bigfuture-details">
                        <h3>{BigFutureCard.title}</h3>
                        <p>{BigFutureCard.description}</p>
                        <button className="go-to-btn">Go to BigFuture</button>
                    </div>
                </div>
            </div>

          </div>

        </div>
      </main>
      
      {/* Logout button */}
      <div className="bottom-logout-area">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

    </div>
  );
};

export default Dashboard;