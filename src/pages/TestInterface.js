import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenManager, BASE_URL } from '../api/baseurls';
import '../css/TestInterface.css';

// --- SVG Icons Defined Here ---

// 1. NOTES ICON (unchanged)
const NotesIcon = () => (
    <svg className="tool-icon-note" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h440l200 200v440q0 33-23.5 56.5T760-120H200Zm0-80h560v-400H600v-160H200v560Zm80-80h400v-80H280v80Zm0-320h200v-80H280v80Zm0 160h400v-80H280v80Zm-80-320v160-160 560-560Z"/>
    </svg>
);

// 2. HIGHLIGHT ICON (unchanged)
const HighlightIcon = () => (
    <svg className="tool-icon-highlight" xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="24px">
        <path d="m272-104-38-38-42 42q-19 19-46.5 19.5T100-100q-19-19-19-46t19-46l42-42-38-40 554-554q12-12 29-12t29 12l112 112q12 12 12 29t-12 29L272-104Zm172-396L216-274l58 58 226-228-56-56Z"/>
    </svg>
);

// 3. MARK ICON (Bookmark) (unchanged)
const MarkIcon = () => (
    <svg className="mark-icon-bookmark" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
        <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/>
    </svg>
);

// 4. MONITOR ICON (NEW SVG ADDED)
const MonitorIcon = () => (
    <svg 
        className="resize-handle-icon monitor-icon-style" 
        xmlns="http://www.w3.org/2000/svg" 
        enableBackground="new 0 0 24 24" 
        height="24px" 
        viewBox="0 0 24 24" 
        width="24px" 
        fill="#000000"
    >
        <g>
            <rect fill="none" height="24" width="24" y="0"/>
        </g>
        <g>
            <g>
                <rect height="1.5" width="1.5" x="12.5" y="11.25"/>
                <rect height="1.5" width="1.5" x="15" y="11.25"/>
                <rect height="1.5" width="1.5" x="10" y="11.25"/>
                <rect height="1.5" width="1.5" x="7.5" y="11.25"/>
                <path d="M21,5H3C1.9,5,1,5.9,1,7v10c0,1.1,0.9,2,2,2h18c1.1,0,2-0.9,2-2V7C23,5.9,22.1,5,21,5z M4,17H3V7h1V17z M18,17H6V7h12V17z M21,17h-1V7h1V17z"/>
            </g>
        </g>
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

  const currentQuestion = questions[currentQuestionIndex];

  // --- Utility Functions (unchanged) ---

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
          <span className="section-info-top">Section 1, Module 2: Reading and Writing</span>
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
                    <span class="tool-text-top">More:</span>
                </div>
            </div>
        </div>
      </div>

      {/* Top Color Lines (UNCHANGED DIVS - CSS will make them small) */}
      <div className="color-lines">
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
            <div className="color-line" style={{ backgroundColor: '#7c7c66'}}></div>
            <div className="color-line" style={{ backgroundColor: '#a5a5a5'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f093fb'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f5576c'}}></div>
            <div className="color-line" style={{ backgroundColor: '#2b3a55'}}></div>
            <div className="color-line" style={{ backgroundColor: '#4f5538'}}></div>
            <div className="color-line" style={{ backgroundColor: '#1a375a'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f093fb'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f093fb'}}></div>
            <div className="color-line" style={{ backgroundColor: '#0c3302'}}></div>
            <div className="color-line" style={{ backgroundColor: '#4f5538'}}></div>
            <div className="color-line" style={{ backgroundColor: '#220105'}}></div>
            <div className="color-line" style={{ backgroundColor: '#764ba2'}}></div>
            <div className="color-line" style={{ backgroundColor: '#1a375a'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f5576c'}}></div>
            <div className="color-line" style={{ backgroundColor: '#61394d'}}></div>
            <div className="color-line" style={{ backgroundColor: '#3d4d44'}}></div>
            <div className="color-line" style={{ backgroundColor: '#220105'}}></div>
            <div className="color-line" style={{ backgroundColor: '#7c7c66'}}></div>
            <div className="color-line" style={{ backgroundColor: '#a5a5a5'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f093fb'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f5576c'}}></div>
            <div className="color-line" style={{ backgroundColor: '#2b3a55'}}></div>
            <div className="color-line" style={{ backgroundColor: '#4f5538'}}></div>
            <div className="color-line" style={{ backgroundColor: '#1a375a'}}></div>
            <div className="color-line" style={{ backgroundColor: '#764ba2'}}></div>
            <div className="color-line" style={{ backgroundColor: '#1f2e4d'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f093fb'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f093fb'}}></div>
            <div className="color-line" style={{ backgroundColor: '#0c3302'}}></div>
            <div className="color-line" style={{ backgroundColor: '#4f5538'}}></div>
            <div className="color-line" style={{ backgroundColor: '#220105'}}></div>
            <div className="color-line" style={{ backgroundColor: '#764ba2'}}></div>
            <div className="color-line" style={{ backgroundColor: '#1a375a'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f5576c'}}></div>
            <div className="color-line" style={{ backgroundColor: '#61394d'}}></div>
            <div className="color-line" style={{ backgroundColor: '#3d4d44'}}></div>
            <div className="color-line" style={{ backgroundColor: '#220105'}}></div>
            <div className="color-line" style={{ backgroundColor: '#764ba2'}}></div>
            <div className="color-line" style={{ backgroundColor: '#1f2e4d'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f093fb'}}></div>
            <div className="color-line" style={{ backgroundColor: '#7c7c66'}}></div>
      </div>

      {/* Main Content Area (Split 50/50: Question Text | Options) */}
      <div className="test-main-content">
        
        {/* LEFT SIDE: Question Text / Passage Area */}
        <div className="question-text-area"> 
            <p className="passage-text">
               {currentQuestion?.text || 'Loading question/passage text from backend...'}
            </p>
            
            {/* NEW: MONITOR ICON CONTAINER */}
            <div className="resize-handle-container">
                <MonitorIcon /> 
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
              
              {/* ABC Icon Container */}
              <div className="abc-icon-container">
                  <span className="abc-icon-text">abc</span>
                  <div className="abc-icon-line"></div> 
              </div>
          </div>
          
          {/* Divider Line with Color Bars (UNCHANGED DIVS - CSS will make them small) */}
          <div className="question-divider-color-line">
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
            <div className="color-line" style={{ backgroundColor: '#7c7c66'}}></div>
            <div className="color-line" style={{ backgroundColor: '#a5a5a5'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f093fb'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f5576c'}}></div>
            <div className="color-line" style={{ backgroundColor: '#2b3a55'}}></div>
            <div className="color-line" style={{ backgroundColor: '#4f5538'}}></div>
            <div className="color-line" style={{ backgroundColor: '#1a375a'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f093fb'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f093fb'}}></div>
            <div className="color-line" style={{ backgroundColor: '#0c3302'}}></div>
            <div className="color-line" style={{ backgroundColor: '#4f5538'}}></div>
            <div className="color-line" style={{ backgroundColor: '#7c7c66'}}></div>
          </div>
          
          <div className="question-content-image-style">
              <p className="question-stem">Which choice completes the text so that it conforms to the conventions of Standard English?</p>
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fixed Navigation Bar DIVIDER LINE (NEW ADDITION) (UNCHANGED DIVS) */}
      <div className="bottom-nav-divider-color-line">
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
            <div className="color-line" style={{ backgroundColor: '#f093fb'}}></div>
            <div className="color-line" style={{ backgroundColor: '#0c3302'}}></div>
            <div className="color-line" style={{ backgroundColor: '#4f5538'}}></div>
            <div className="color-line" style={{ backgroundColor: '#220105'}}></div>
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
            <div className="color-line" style={{ backgroundColor: '#7c7c66'}}></div>
            <div className="color-line" style={{ backgroundColor: '#a5a5a5'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f093fb'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f5576c'}}></div>
            <div className="color-line" style={{ backgroundColor: '#2b3a55'}}></div>
            <div className="color-line" style={{ backgroundColor: '#4f5538'}}></div>
            <div className="color-line" style={{ backgroundColor: '#1a375a'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f093fb'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f093fb'}}></div>
            <div className="color-line" style={{ backgroundColor: '#0c3302'}}></div>
            <div className="color-line" style={{ backgroundColor: '#4f5538'}}></div>
            <div className="color-line" style={{ backgroundColor: '#220105'}}></div>
            <div className="color-line" style={{ backgroundColor: '#764ba2'}}></div>
            <div className="color-line" style={{ backgroundColor: '#1a375a'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f5576c'}}></div>
            <div className="color-line" style={{ backgroundColor: '#61394d'}}></div>
            <div className="color-line" style={{ backgroundColor: '#3d4d44'}}></div>
            <div className="color-line" style={{ backgroundColor: '#220105'}}></div>
            <div className="color-line" style={{ backgroundColor: '#7c7c66'}}></div>
            <div className="color-line" style={{ backgroundColor: '#a5a5a5'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f093fb'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f5576c'}}></div>
            <div className="color-line" style={{ backgroundColor: '#2b3a55'}}></div>
            <div className="color-line" style={{ backgroundColor: '#4f5538'}}></div>
            <div className="color-line" style={{ backgroundColor: '#1a375a'}}></div>
            <div className="color-line" style={{ backgroundColor: '#764ba2'}}></div>
            <div className="color-line" style={{ backgroundColor: '#1f2e4d'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f093fb'}}></div>
            <div className="color-line" style={{ backgroundColor: '#764ba2'}}></div>
            <div className="color-line" style={{ backgroundColor: '#1a375a'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f5576c'}}></div>
            <div className="color-line" style={{ backgroundColor: '#61394d'}}></div>
            <div className="color-line" style={{ backgroundColor: '#3d4d44'}}></div>
            <div className="color-line" style={{ backgroundColor: '#220105'}}></div>
            <div className="color-line" style={{ backgroundColor: '#764ba2'}}></div>
            <div className="color-line" style={{ backgroundColor: '#1f2e4d'}}></div>
            <div className="color-line" style={{ backgroundColor: '#f093fb'}}></div>
            <div className="color-line" style={{ backgroundColor: '#7c7c66'}}></div>
      </div>

      {/* Bottom Fixed Navigation Bar (UNCHANGED) */}
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
          <button 
            className="nav-btn-bottom back-btn"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Back
          </button>
          <button 
            className="nav-btn-bottom next-btn"
            onClick={handleNextQuestion} // Logic updated inside handleNextQuestion
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestInterface;