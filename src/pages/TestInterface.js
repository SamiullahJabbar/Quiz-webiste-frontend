import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenManager, BASE_URL } from '../api/baseurls';
import '../css/TestInterface.css';

// --- SVG Icons Defined Here ---

// 1. NOTES ICON (unchanged)
const NotesIcon = () => (
    <svg className="tool-icon-note" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#615d5dff">
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h440l200 200v440q0 33-23.5 56.5T760-120H200Zm0-80h560v-400H600v-160H200v560Zm80-80h400v-80H280v80Zm0-320h200v-80H280v80Zm0 160h400v-80H280v80Zm-80-320v160-160 560-560Z"/>
    </svg>
);

// 2. HIGHLIGHT ICON (unchanged)
const HighlightIcon = () => (
    <svg className="tool-icon-highlight" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="40px" fill="#555252ff">
        <path d="M80 0v-134h800V0H80Zm502-476L470.67-587.33 296-412.67l111 111.34L582-476Zm-63.67-158.67 111 111 177.34-177L695.33-812l-177 177.33Zm-70.66-23.66L653-453 460.67-260.33q-20.67 20.66-53.84 20.66-33.16 0-53.83-20.66l-7.33-7.34L308-231.33H138L260-353l-2.67-2.67q-22.66-22.66-22.66-56.16T257.33-468l190.34-190.33Zm0 0L650-860.67Q669.33-880 697.5-880t47.5 19.33l109.33 109q19.34 19.34 19 49.17-.33 29.83-19.66 49.17L653-453 447.67-658.33Z"/>
    </svg>

    
);

// 3. MARK ICON (Bookmark) (unchanged)
const MarkIcon = () => (
    <svg className="mark-icon-bookmark" xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="35px" fill="#4e4c4cff">
        <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/>
    </svg>
);

const BatteryIcon = () => (
    <svg className="battery-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#af960aff">
        <path d="M160-240q-50 0-85-35t-35-85v-240q0-50 35-85t85-35h540q50 0 85 35t35 85v240q0 50-35 85t-85 35H160Zm0-80h540q17 0 28.5-11.5T740-360v-240q0-17-11.5-28.5T700-640H160q-17 0-28.5 11.5T120-600v240q0 17 11.5 28.5T160-320Zm700-60v-200h20q17 0 28.5 11.5T920-540v120q0 17-11.5 28.5T880-380h-20Zm-700 20v-240h400v240H160Z"/>
    </svg>
);


// 4. NEW FULLSCREEN ICON (REPLACED MONITOR ICON)
const FullscreenIcon = () => (
    <svg 
        className="resize-handle-icon fullscreen-icon-style" 
        xmlns="http://www.w3.org/2000/svg" 
        height="24px" 
        viewBox="0 -960 960 960" 
        width="24px" 
        fill="#000000ff"
    >
        <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm640-560H160v480h640v-480Zm-640 0v480-480Zm200 360v-240L240-480l120 120Zm360-120L600-600v240l120-120Z"/>
    </svg>
);

// ABC Icon Component (NEW ADDED)
const AbcIcon = () => (
    <svg 
        className="abc-icon-svg" 
        xmlns="http://www.w3.org/2000/svg" 
        height="40px" 
        viewBox="0 -960 960 960" 
        width="40px" 
        fill="#ffffffff"  
    >
        <path d="M680-360q-17 0-28.5-11.5T640-400v-160q0-17 11.5-28.5T680-600h120q17 0 28.5 11.5T840-560v40h-60v-20h-80v120h80v-20h60v40q0 17-11.5 28.5T800-360H680Zm-300 0v-240h160q17 0 28.5 11.5T580-560v40q0 17-11.5 28.5T540-480q17 0 28.5 11.5T580-440v40q0 17-11.5 28.5T540-360H380Zm60-150h80v-30h-80v30Zm0 90h80v-30h-80v30Zm-320 60v-200q0-17 11.5-28.5T160-600h120q17 0 28.5 11.5T320-560v200h-60v-60h-80v60h-60Zm60-120h80v-60h-80v60Z"/>
    </svg>
);



const TestInterface = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [markedQuestions, setMarkedQuestions] = useState(new Set()); 
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes default
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [abcIconClicked, setAbcIconClicked] = useState(false); // <--- ABC State

  const currentQuestion = questions[currentQuestionIndex];

  // --- Utility Functions (unchanged) ---

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };


  const handleAbcIconClick = () => {
    setAbcIconClicked(!abcIconClicked);
};

  const getUserName = () => {
    try {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const user = JSON.parse(userData);
        return `${user.first_name} ${user.last_name}`;
      }
    } catch (error) {
      console.error('Error getting user data:', error);
    }
    return 'Aisha Syrym'; 
  };


  // --- Handlers & Effects (unchanged) ---

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchQuestions = async () => {
    try {
      const token = TokenManager.getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${BASE_URL}/questions/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const questionsData = await response.json();
        setQuestions(questionsData);
        
        if (questionsData.length === 0) {
          setError('No questions found');
        }
      } else {
        setError('Failed to fetch questions');
      }
    } catch (error) {
      console.error('Questions fetch error:', error);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUp = () => {
    // Timer complete hone par /break screen par redirect karein
    navigate('/break');
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    // Check agar yeh aakhri sawal hai
    if (currentQuestionIndex === questions.length - 1) {
      // Agar aakhri sawal hai, toh /break screen par redirect karein
      navigate('/break'); 
    } else if (currentQuestionIndex < questions.length - 1) {
      // Agar aakhri sawal nahi hai, toh agle sawal par jaayen
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption('');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption('');
    }
  };

  // handleSubmitTest function is no longer needed/removed

  if (loading) {
    return (
      <div className="test-interface-container">
        <div className="loading-spinner-large"></div>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="test-interface-container">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error || 'No questions available'}
        </div>
      </div>
    );
  }
  
  // --- Render Logic ---

  return (
    <div className="test-interface-container">
      {/* Top Header Section (Color: #e9ecf7) */}
      <div className="test-header">
        
        {/* LEFT SIDE: Section Info & Directions Dropdown */}
        <div className="header-left-image-style">
          <span className="section-info-top"><strong>Section 1, Module 2: Reading and Writing</strong></span>
          <div className="directions-dropdown-style">
            <span className="directions-text-top">Directions</span>
            <span className="directions-icon-top">⌄</span>
          </div>
        </div>
        
        {/* CENTER: Timer & Hide Button (Properly Centered) */}
        <div className="header-center-image-style">
            <span className="timer">{formatTime(timeLeft)}</span>
            <button className="hide-time-btn"><strong>Hide</strong></button>
        </div>

        {/* RIGHT SIDE: Tools/Icons (Horizontal Alignment) - UPDATED ICONS WITH SVG */}
        <div className="header-right-image-style">
            <div className="tool-options-horizontal">
              {/* <div className="tool-options-horizontal"> */}
        {/* Battery Icon and Percentage */}
      
                {/* Highlights & Notes Icons/Text */}
                {/* Highlights & Notes Icons/Text */}

                
<div className="tool-set-highlights">

  
    
    {/* یہ ڈیو icons کو ایک ہی قطار (row) میں رکھے گا */}
    <div className="tool-icon-row"> 
        <HighlightIcon />
        <NotesIcon />
    </div>

    {/* یہ ٹیکسٹ نیچے آئے گا */}
    <span className="tool-text-top">Highlights & Notes</span>
</div>
               
                <div class="tool-set-more-option">
                    <span className="tool-more-icon-top">⋮</span>
                    <span class="tool-text-top">More</span>
                </div>
                {/* Battery Icon with Percentage OVERLAY */}
        <div className="battery-container">
            <div className="battery-icon-wrapper">
                <BatteryIcon />
                <span className="battery-percentage-overlay">81%</span>
            </div>
        </div>
        
            </div>
        </div>
      </div>

      {/* Top Color Lines (UNCHANGED DIVS - CSS will make them small) */}
      {/* <div className="color-lines">
        <div className="color-line" style={{backgroundColor: '#667eea'}}></div>
            <div className="color-line" style={{ backgroundColor: '#1f2e4d' }}></div>
            <div className="color-line" style={{ backgroundColor: '#61394d' }}></div>
            <div className="color-line" style={{ backgroundColor: '#3d4d44' }}></div>
            <div className="color-line" style={{ backgroundColor: 'white', width: '20px' }}></div> 
            <div className="color-line" style={{ backgroundColor: '#1f2e4d' }}></div>
            <div className="color-line" style={{ backgroundColor: '#61394d' }}></div>
            <div className="color-line" style={{ backgroundColor: '#764ba2' }}></div>
            <div className="color-line" style={{ backgroundColor: '#f093fb' }}></div>
            <div className="color-line" style={{ backgroundColor: '#7c7c66' }}></div>
            <div className="color-line" style={{ backgroundColor: '#a5a5a5' }}></div>
            <div className="color-line" style={{ backgroundColor: '#f093fb' }}></div>
            <div className="color-line" style={{ backgroundColor: '#f5576c' }}></div>
            <div className="color-line" style={{ backgroundColor: '#2b3a55' }}></div>
            <div className="color-line" style={{ backgroundColor: '#4f5538' }}></div>
            <div className="color-line" style={{ backgroundColor: '#1a375a' }}></div>
            <div className="color-line" style={{ backgroundColor: 'white', width: '15px' }}></div>
            <div className="color-line" style={{ backgroundColor: '#667eea'}}></div>
            <div className="color-line" style={{ backgroundColor: '#a5a5a5'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f093fb'}}></div>
             <div className="color-line" style={{ backgroundColor: 'white', width: '20px' }}></div> 
            <div className="color-line" style={{ backgroundColor: '#1f2e4d' }}></div>
            <div className="color-line" style={{ backgroundColor: '#7c7c66'}}></div>
      </div> */}

      {/* Main Content Area (Split 50/50: Question Text | Options) */}
      <div className="test-main-content">
        
        {/* LEFT SIDE: Question Text / Passage Area */}
        <div className="question-text-area"> 
            <p className="passage-text">
               {currentQuestion?.text || 'Loading question/passage text from backend...'}
            </p>
            {/* UPDATED: FULLSCREEN ICON CONTAINER - TOP BORDER LINE PAR */}
    <div className="fullscreen-handle-container">
        <FullscreenIcon /> 
    </div>
            
        </div>

        {/* RIGHT SIDE: Options Only Area */}
        <div className="options-only-area">
          
          {/* Question Header Area (Right Side) - UPDATED MARK ICON WITH SVG */}
          <div className="question-header-image-style">
              {/* Question Number Box */}
              <div className="question-number-box-center">
               {currentQuestionIndex + 1}
              </div>
              
              {/* MARK ICON (Bookmark) (SVG) */}
              <MarkIcon /> 
              
              <span className="mark-for-review-text">Mark for Review</span>
              
              {/* ABC Icon Container - UPDATED WITH CLICK HANDLER */}
<div 
    className={`abc-icon-container ${abcIconClicked ? 'clicked' : ''}`}
    onClick={handleAbcIconClick}
>
    <AbcIcon />
</div>
          </div>
          
          {/* Divider Line with Color Bars (UNCHANGED DIVS - CSS will make them small) */}
          <div className="question-divider-color-line">
            {/* ... Color bars ... */}
          </div>
          
          <div className="question-content-image-style">
              <p className="question-stem">Which choice completes the text with the most logical and precise word or phrase?</p>
          </div>

          <div className="options-section">
            <div className="options-list">
              {['A', 'B', 'C', 'D'].map((option) => (
                <div 
                    key={option} 
                    className={`option-item-image-style ${selectedOption === option ? 'selected' : ''}`}
                    onClick={() => handleOptionSelect(option)}
                >
                  <label className="option-label-container">
                    <div className="option-circle-label">
                        <span className="option-label-text">{option}</span>
                    </div>
                    <span className="option-text-image-style">
                      {currentQuestion?.[`option_${option.toLowerCase()}`] || `Option ${option} text`}
                    </span>
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={selectedOption === option}
                      onChange={() => handleOptionSelect(option)}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <button className="option-add-btn"></button>
                  
                  {/* === NEW ADDITION: Right Circle Box (Conditional Rendering) === */}
                  {abcIconClicked && (
                      <div className="option-right-box-style">
                          <div className="option-circle-with-line">
                              <span className="option-right-label">{option}</span>
                          </div>
                      </div>
                  )}
                  {/* ========================================================= */}
                  
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fixed Navigation Bar DIVIDER LINE (NEW ADDITION) (UNCHANGED DIVS) */}
      {/* <div className="bottom-nav-divider-color-line">
            ... Color bars ...
      </div> */}

      {/* Bottom Fixed Navigation Bar (UPDATED) */}
      <div className="test-bottom-navbar">
        <div className="nav-left-image-style">
          <span className="user-name">{getUserName()}</span>
        </div>
        
        <div className="nav-center-image-style">
          <div className="question-counter-box-center">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
        
        <div className="nav-right-image-style">
          {currentQuestionIndex > 0 && (
            <button 
              className="nav-btn-bottom back-btn"
              onClick={handlePreviousQuestion}
            >
              Back
            </button>
          )}
          <button 
            className="nav-btn-bottom next-btn"
            onClick={handleNextQuestion}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestInterface;