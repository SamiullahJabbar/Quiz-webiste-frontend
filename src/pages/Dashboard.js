import React, { useState, useEffect, useRef } from 'react';
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
  // State for user data
  const [user, setUser] = useState({ first_name: 'Khan', last_name: 'Jabbar' }); 
  // State for fetching the new test summary data
  const [testSummaries, setTestSummaries] = useState([]); 
  const [loading, setLoading] = useState(true);
  // Renamed activeTab to testSummaryTab for clarity
  const [testSummaryTab, setTestSummaryTab] = useState('Active'); 
  const [practiceTab, setPracticeTab] = useState('Active'); 
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
    fetchTestSummaries(); // Fetch the new test summary data
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

  // --- NEW/UPDATED: Function to fetch Test Summaries ---
  const fetchTestSummaries = async () => {
    try {
      const token = TokenManager.getToken();
      if (!token) {
        TokenManager.removeToken && TokenManager.removeToken(); 
        navigate('/login');
        return;
      }

      // API Endpoint updated to test-summary/
      const response = await fetch(`${BASE_URL}/test-summary/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const testsData = await response.json();
        setTestSummaries(testsData); // Set the new state
        // Since test-summary/ only returns generic tests, we will show them all under "Active" (or "Available")
      } else if (response.status === 401) {
        TokenManager.removeToken && TokenManager.removeToken(); 
        navigate('/login');
      } else {
        setError('Failed to fetch test summaries.');
      }
    } catch (error) {
      console.error('Error fetching test summaries:', error);
      setError('Network error. Please try again.');
    } finally {
      setTimeout(() => setLoading(false), 500); 
    }
  };

  const handleStartTest = (testId) => {
    // Redirects to TestCodeVerification page, passing testId for the next step.
    // Assuming you will use the ID to fetch test details in the next component.
    navigate('/TestCodeVerification', { state: { testId: testId } });
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
  
  // NOTE: date functions (formatDate, isTestActive/Upcoming/Past) are no longer needed
  // as the new API does not provide time/date fields. They are removed for cleanliness.
  
  // Since test-summary/ API does not provide status, we simply filter based on the tab chosen.
  const getFilteredTestSummaries = () => {
    // In a real scenario, you'd likely have a separate endpoint for Past tests/results.
    // For now, we will show all fetched summaries under the 'Active' tab
    if (testSummaryTab === 'Active') {
        return testSummaries;
    } 
    // If 'Past' is selected but we only fetched summaries, show nothing for 'Past'
    return []; 
  };

  const filteredTestSummaries = getFilteredTestSummaries();

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
            
            {/* 1. Practice Tiles (Static) */}
            <div className="practice-tiles">
              {StaticTestTiles.map((tile) => (
                <div key={tile.name} className="tile-card">
                  <div className="tile-icon">{tile.icon}</div>
                  <h3 className="tile-name">{tile.name}</h3>
                  <p className="tile-description">{tile.description}</p>
                </div>
              ))}
            </div>

            {/* 2. Your Tests (Integrated with new test-summary API) */}
            <div className="your-tests-section">
              <div className="section-header-row">
                <h3>Your Available Tests</h3>
                <div className="tab-buttons">
                  <button 
                    className={`tab-btn ${testSummaryTab === 'Active' ? 'active' : ''}`}
                    onClick={() => setTestSummaryTab('Active')}
                  >
                    Available
                  </button>
                  <button 
                    className={`tab-btn ${testSummaryTab === 'Past' ? 'active' : ''}`}
                    onClick={() => setTestSummaryTab('Past')}
                  >
                    Past Results
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

                {/* Display Available Tests */}
                {testSummaryTab === 'Active' && (
                  filteredTestSummaries.length === 0 ? (
                    <div className="no-upcoming-tests-card">
                      <h4>No Tests Available Right Now</h4>
                      <p>Available tests will appear here. Please check back later.</p>
                    </div>
                  ) : (
                    <div className="active-tests-list">
                      {filteredTestSummaries.map((test) => (
                        <div key={test.id} className="test-card">
                          <div className="test-card-header">
                            <h4 className="test-title">{test.name}</h4>
                          </div>
                          
                          {/* Display total_duration and total_questions */}
                          <div className="test-details">
                            <div className="test-info-item">
                              <span className="info-label">Duration:</span>
                              <span className="info-value">{test.total_duration} mins</span>
                            </div>
                            <div className="test-info-item">
                              <span className="info-label">Questions:</span>
                              <span className="info-value">{test.total_questions}</span>
                            </div>
                          </div>

                          <div className="test-actions">
                            <button 
                              className='start-test-btn active' // Always show as active to start
                              onClick={() => handleStartTest(test.id)} // Pass test ID to next screen
                            >
                              Start Test
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}

                {/* Display Past Results (Since no API data for this, show empty) */}
                {testSummaryTab === 'Past' && (
                    <div className="empty-state">
                      <p>No past test results available yet. Past results will show here.</p>
                    </div>
                )}
              </div>
            </div>
            
            {/* 3. Practice and Prepare (Remains static) */}
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
            
            {/* 4. Explore BigFuture (Static) */}
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