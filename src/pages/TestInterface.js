import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TokenManager, BASE_URL } from '../api/baseurls';
import '../css/TestInterface.css';
import DirectionsModal from '../component/DirectionsModal';

// --- SVG Icons (Keep all your existing icons) ---

// 1. NOTES ICON
const NotesIcon = () => (
    <svg className="tool-icon-note" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#615d5dff">
        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h440l200 200v440q0 33-23.5 56.5T760-120H200Zm0-80h560v-400H600v-160H200v560Zm80-80h400v-80H280v80Zm0-320h200v-80H280v80Zm0 160h400v-80H280v80Zm-80-320v160-160 560-560Z"/>
    </svg>
);

// 2. HIGHLIGHT ICON
const HighlightIcon = () => (
    <svg className="tool-icon-highlight" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="40px" fill="#555252ff">
        <path d="M80 0v-134h800V0H80Zm502-476L470.67-587.33 296-412.67l111 111.34L582-476Zm-63.67-158.67 111 111 177.34-177L695.33-812l-177 177.33Zm-70.66-23.66L653-453 460.67-260.33q-20.67 20.66-53.84 20.66-33.16 0-53.83-20.66l-7.33-7.34L308-231.33H138L260-353l-2.67-2.67q-22.66-22.66-22.66-56.16T257.33-468l190.34-190.33Zm0 0L650-860.67Q669.33-880 697.5-880t47.5 19.33l109.33 109q19.34 19.34 19 49.17-.33 29.83-19.66 49.17L653-453 447.67-658.33Z"/>
    </svg>
);

// 3. MARK ICON (Bookmark) - UPDATED WITH RED FILL WHEN ACTIVE
const MarkIcon = ({ isMarked }) => (
    <svg 
        className={`mark-icon-bookmark ${isMarked ? 'marked' : ''}`} 
        xmlns="http://www.w3.org/2000/svg" 
        height="40px" 
        viewBox="0 -960 960 960" 
        width="35px" 
        fill={isMarked ? "#e53935" : "#4e4c4cff"}
    >
        <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/>
    </svg>
);

// 4. BATTERY ICON - MODIFIED TO SHOW PERCENTAGE
const BatteryIcon = ({ percentage }) => {
    let fillColor = "#000000ff";
    if (percentage <= 48) fillColor = "#000000ff";
    else if (percentage <= 64) fillColor = "#000000ff";
    else if (percentage <= 80) fillColor = "#000000ff";
    
    return (
        <svg className="battery-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={fillColor}>
            <path d="M160-240q-50 0-85-35t-35-85v-240q0-50 35-85t85-35h540q50 0 85 35t35 85v240q0 50-35 85t-85 35H160Zm0-80h540q17 0 28.5-11.5T740-360v-240q0-17-11.5-28.5T700-640H160q-17 0-28.5 11.5T120-600v240q0 17 11.5 28.5T160-320Zm700-60v-200h20q17 0 28.5 11.5T920-540v120q0 17-11.5 28.5T880-380h-20Zm-700 20v-240h400v240H160Z"/>
        </svg>
    );
};

// 5. FULLSCREEN ICON
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

// ABC Icon Component
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

// ✅ NEW: Fixed sequence according to your requirement
const REQUIRED_SEQUENCE = [
    "rw1",      // Step 1: Reading and writing 1
    "rw2",      // Step 2: Reading and writing 2  
    "break",    // Step 3: Break
    "m1",       // Step 4: Math 1
    "m2"        // Step 5: Math 2
];

// ✅ Function to sort sections according to fixed sequence
function sortSectionsByFixedSequence(sections) {
    if (!sections || !Array.isArray(sections)) return [];
    
    // Create a map for quick lookup
    const sectionsByType = {};
    
    // Group sections by their type
    sections.forEach(section => {
        if (section && section.type) {
            sectionsByType[section.type] = section;
        }
    });
    
    // Create new array in fixed sequence order
    const sortedSections = [];
    
    REQUIRED_SEQUENCE.forEach(type => {
        if (sectionsByType[type]) {
            sortedSections.push(sectionsByType[type]);
        }
    });
    
    return sortedSections;
}

// ✅ Function to sort summary according to fixed sequence
function sortSummaryByFixedSequence(summary) {
    if (!summary || !Array.isArray(summary)) return [];
    
    // Create a map for quick lookup
    const summaryByType = {};
    
    // Group summary items by their type
    summary.forEach(item => {
        if (item && item.type) {
            summaryByType[item.type] = item;
        }
    });
    
    // Create new array in fixed sequence order
    const sortedSummary = [];
    
    REQUIRED_SEQUENCE.forEach(type => {
        if (summaryByType[type]) {
            sortedSummary.push(summaryByType[type]);
        }
    });
    
    return sortedSummary;
}

// ✅ Component to render question text
const QuestionTextRenderer = ({ content }) => {
  if (!content) return null;
  const hasMathContent = /[\\\(\)\$\^_\{\}]|frac|sqrt|sum|int|alpha|beta|gamma|pi|theta/.test(content);
  
  if (content.includes('<') && content.includes('>')) {
    return (
      <div 
        className="question-html-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  
  if (hasMathContent) {
    return (
      <div className="question-math-content">
        {content}
      </div>
    );
  }
  
  return <div className="question-text-content">{content}</div>;
};

// ✅ Component to render option text
const OptionTextRenderer = ({ content }) => {
  if (!content) return null;
  const hasMathContent = /[\\\(\)\$\^_\{\}]|frac|sqrt|sum|int|alpha|beta|gamma|pi|theta/.test(content);
  
  if (hasMathContent) {
    return (
      <span className="option-math-content">
        {content}
      </span>
    );
  }
  
  return <span className="option-text-content">{content}</span>;
};

const TestInterface = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✅ STATE FOR DIRECTIONS MODAL
  const [isDirectionsOpen, setIsDirectionsOpen] = useState(true); 
  
  // ✅ STATE FOR NAVIGATOR MODAL
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);
  
  const [currentSection, setCurrentSection] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [markedQuestions, setMarkedQuestions] = useState(new Set([3, 11, 20]));
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [abcIconClicked, setAbcIconClicked] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [showSubmitPopup, setShowSubmitPopup] = useState(false);
  
  // ✅ STATE: For open-ended question answer
  const [openEndedAnswer, setOpenEndedAnswer] = useState('');

  // ✅ STATE: To track current section index
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  // ✅ Get test data with proper structure from StartCodeScreen
  const { testData, initialSectionIndex = 0, fromBreak = false } = location.state || {};
  
  // ✅ Extract and sort the actual test data from the response structure
  const actualTestData = testData?.test || testData;
  let actualSections = actualTestData?.sections || [];
  let actualSummary = testData?.summary || [];
  
  // ✅ SORT SECTIONS AND SUMMARY BY FIXED SEQUENCE
  if (actualSections.length > 0) {
    actualSections = sortSectionsByFixedSequence(actualSections);
  }
  
  if (actualSummary.length > 0) {
    actualSummary = sortSummaryByFixedSequence(actualSummary);
  }

  // ✅ STATE: For battery percentage based on module
  const [batteryPercentage, setBatteryPercentage] = useState(90);

  // --- Utility Functions ---

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
    return 'khan Jabbar';
  };

  // ✅ UPDATED: Get current section info with new format
const getCurrentSectionInfo = () => {
  if (!currentSection || !actualSections.length) return 'Loading...';
  
  const nonBreakSections = actualSections.filter(section => section.type !== 'break');
  const sectionIndex = nonBreakSections.findIndex(section => section.id === currentSection.id);
  
  const moduleNumber = getCurrentModuleNumber();
  const sectionNumber = Math.floor(sectionIndex / 2) + 1;
  
  return `Section ${sectionNumber}, Module ${moduleNumber}: ${currentSection.title || ''}`;
};

  // ✅ UPDATED: Function to get current module number
// ✅ UPDATED: Get current module number (section position ke hisaab se)
const getCurrentModuleNumber = () => {
  if (!currentSection || !actualSections.length) return 1;
  
  // Non-break sections mein current section ka index nikalo
  const nonBreakSections = actualSections.filter(section => section.type !== 'break');
  const sectionIndex = nonBreakSections.findIndex(section => section.id === currentSection.id);
  

  return (sectionIndex % 2 === 0) ? 1 : 2;
};

  // ✅ UPDATED: Function to update battery percentage based on module (excluding break)
  const updateBatteryPercentage = (sectionType) => {
    // Battery percentage based on section type, not module number
    switch(sectionType) {
      case 'rw1':
        setBatteryPercentage(90);
        break;
      case 'rw2':
        setBatteryPercentage(80);
        break;
      case 'm1':
        setBatteryPercentage(64);
        break;
      case 'm2':
        setBatteryPercentage(48);
        break;
      default:
        // For break section, keep previous percentage
        break;
    }
  };

  // ✅ Function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    
    if (imagePath.startsWith('/media/')) {
      return `${BASE_URL.replace('/api', '')}${imagePath}`;
    }
    
    const mediaPath = imagePath
      .replace('/questions/', '/media/questions/')
      .replace('/options/', '/media/options/');
      
    return `${BASE_URL.replace('/api', '')}${mediaPath}`;
  };

  // ✅ HANDLER: Toggle mark for current question
  const handleMarkQuestion = () => {
    const currentQuestionNumber = currentQuestionIndex + 1;
    setMarkedQuestions(prev => {
      const newMarked = new Set(prev);
      if (newMarked.has(currentQuestionNumber)) {
        newMarked.delete(currentQuestionNumber);
      } else {
        newMarked.add(currentQuestionNumber);
      }
      return newMarked;
    });
  };

  // --- Handlers & Effects ---
  
  // ✅ HANDLER FOR DIRECTIONS MODAL
  const toggleDirectionsPopup = () => {
      setIsDirectionsOpen(prev => !prev);
  };
  
  // ✅ HANDLER FOR NAVIGATOR MODAL
  const toggleNavigatorPopup = () => {
      setIsNavigatorOpen(prev => !prev);
  };
  
  // ✅ HANDLER: To switch question from the navigator
  const handleQuestionSelect = (questionNumber) => {
    setCurrentQuestionIndex(questionNumber - 1);
    setIsNavigatorOpen(false);
  };

  // ✅ UPDATED useEffect: Initialize section with break handling
  useEffect(() => {
    if (actualSections.length > 0) {
      // Agar break se aa rahe hain, toh next section load karo
      if (fromBreak) {
        // Break ke baad wala section find karo
        const breakIndex = actualSections.findIndex(section => section.type === 'break');
        if (breakIndex !== -1 && breakIndex + 1 < actualSections.length) {
          loadSectionDirectly(breakIndex + 1);
        } else {
          loadSectionDirectly(currentSectionIndex || initialSectionIndex);
        }
      } else {
        loadSectionDirectly(initialSectionIndex);
      }
    } else {
      setError('No test data available. Please try again.');
      setLoading(false);
    }
  }, [actualTestData, initialSectionIndex, fromBreak]);
  
  // ✅ UPDATED useEffect: Update battery percentage when section changes
  useEffect(() => {
    if (currentSection && currentSection.type) {
      // Only update battery for non-break sections
      if (currentSection.type !== 'break') {
        updateBatteryPercentage(currentSection.type);
      }
    }
  }, [currentSection]);
  
  // ✅ useEffect: To load/reset selected option/open-ended answer when question changes
  useEffect(() => {
    if (currentQuestion) {
      const savedAnswer = userAnswers[currentQuestion.id];
      if (currentQuestion.is_open_ended) {
        setOpenEndedAnswer(savedAnswer || '');
        setSelectedOption('');
      } else {
        setSelectedOption(savedAnswer || '');
        setOpenEndedAnswer('');
      }
    }
  }, [currentQuestionIndex, questions, userAnswers]);

  useEffect(() => {
    if (currentSection && currentSection.duration_minutes) {
      setTimeLeft(currentSection.duration_minutes * 60);
    }
  }, [currentSection]);

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // ✅ NEW: Direct section loading function (break skip logic included)
  const loadSectionDirectly = async (sectionIndex) => {
    try {
      setLoading(true);
      setError('');
      
      // ✅ Check if we're out of bounds
      if (!actualSections || sectionIndex >= actualSections.length) {
        await finalSubmitTest();
        navigate('/examcompletion"');
        return;
      }

      const section = actualSections[sectionIndex];
      
      // ✅ Agar section break hai aur hum already break dekh chuke hain, skip karo
      if (section.type === 'break') {
        // Next section load karo
        loadSectionDirectly(sectionIndex + 1);
        return;
      }

      setCurrentSection(section);
      setCurrentSectionIndex(sectionIndex);
      
      if (section.questions && section.questions.length > 0) {
        setQuestions(section.questions);
        setCurrentQuestionIndex(0);
      } else {
        setError('No questions found for this section');
      }
      
    } catch (error) {
      console.error('Error loading section:', error);
      setError('Failed to load section');
    } finally {
      setLoading(false);
    }
  };

const handleTimeUp = async () => {
  if (Object.keys(userAnswers).length > 0) {
    await submitSectionAnswers();
  }
  
  if (!currentSection || !actualSections.length) return;
  
  const currentSectionType = currentSection.type;
  const currentSequencePosition = REQUIRED_SEQUENCE.indexOf(currentSectionType);
  
  // ✅ Navigate based on sequence position
  if (currentSequencePosition === 0) {
    // rw1 -> module over
    navigate('/module-over', {
      state: {
        nextSectionIndex: currentSectionIndex + 1,
        sections: actualSections,
        testData: actualTestData
      }
    });
  } 
  else if (currentSequencePosition === 1) {
    // rw2 -> break screen
    navigate('/break', {
      state: {
        nextSectionIndex: currentSectionIndex + 1,
        sections: actualSections,
        testData: actualTestData,
        breakDuration: 1
      }
    });
  }
  else if (currentSequencePosition === 3) {
    // m1 -> module over
    navigate('/module-over', {
      state: {
        nextSectionIndex: currentSectionIndex + 1,
        sections: actualSections,
        testData: actualTestData
      }
    });
  }
  else if (currentSequencePosition === 4) {
    // ✅ CHANGED: m2 -> module over (pehle), phir finish test
    navigate('/module-over', {
      state: {
        nextSectionIndex: currentSectionIndex + 1,
        sections: actualSections,
        testData: actualTestData,
        isFinalModule: true  // ✅ NEW: Flag for final module
      }
    });
  }
};

  const submitSectionAnswers = async () => {
    try {
      const token = TokenManager.getToken();
      if (!token || !actualTestData) return;

      const response = await fetch(`${BASE_URL}/tests/${actualTestData.id}/submit-section/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          section_id: currentSection.id,
          answers: userAnswers
        })
      });

      if (response.ok) {
        console.log('Section answers saved successfully');
      } else {
        console.error('Failed to save section answers');
      }
    } catch (error) {
      console.error('Error submitting section answers:', error);
    }
  };

  const finalSubmitTest = async () => {
    try {
      const token = TokenManager.getToken();
      if (!token || !actualTestData) return;

      const response = await fetch(`${BASE_URL}/tests/${actualTestData.id}/final-submit/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      if (response.ok) {
        console.log('Test submitted successfully');
      } else {
        console.error('Failed to submit test');
      }
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  const handleAbcIconClick = () => {
    setAbcIconClicked(!abcIconClicked);
  };

  const handleOptionSelect = (option) => {
    if (currentQuestion?.is_open_ended) return;
    
    setSelectedOption(option);
    
    if (currentQuestion) {
      const updatedAnswers = {
        ...userAnswers,
        [currentQuestion.id]: option
      };
      setUserAnswers(updatedAnswers);
    }
  };
  
  // ✅ HANDLER: For open-ended input
  const handleOpenEndedChange = (event) => {
    const answer = event.target.value;
    setOpenEndedAnswer(answer);
    
    if (currentQuestion) {
      const updatedAnswers = {
        ...userAnswers,
        [currentQuestion.id]: answer
      };
      setUserAnswers(updatedAnswers);
    }
  };

  // ✅ MODIFIED: Next question handler with sequence check
  const handleNextQuestion = () => {
    if (currentQuestion?.is_open_ended) {
        if (currentQuestion) {
            const updatedAnswers = {
              ...userAnswers,
              [currentQuestion.id]: openEndedAnswer
            };
            setUserAnswers(updatedAnswers);
        }
    }
    
    if (currentQuestionIndex === questions.length - 1) {
      if (timeLeft > 0) {
        setShowSubmitPopup(true);
      }
    } else if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion?.is_open_ended) {
        if (currentQuestion) {
            const updatedAnswers = {
              ...userAnswers,
              [currentQuestion.id]: openEndedAnswer
            };
            setUserAnswers(updatedAnswers);
        }
    }
    
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // ✅ UPDATED: Finish section handler - Module 2 (rw2) ke baad break screen
  const handleFinishSection = async () => {
  setShowSubmitPopup(false);
  
  if (Object.keys(userAnswers).length > 0) {
    await submitSectionAnswers();
  }
  
  if (!currentSection || !actualSections.length) return;
  
  const currentSectionType = currentSection.type;
  const currentSequencePosition = REQUIRED_SEQUENCE.indexOf(currentSectionType);
  
  // ✅ Navigate based on sequence position
  if (currentSequencePosition === 0) {
    // rw1 -> module over
    navigate('/module-over', {
      state: {
        nextSectionIndex: currentSectionIndex + 1,
        sections: actualSections,
        testData: actualTestData
      }
    });
  } 
  else if (currentSequencePosition === 1) {
    // rw2 -> break screen
    navigate('/break', {
      state: {
        nextSectionIndex: currentSectionIndex + 1,
        sections: actualSections,
        testData: actualTestData,
        breakDuration: 1
      }
    });
  }
  else if (currentSequencePosition === 3) {
    // m1 -> module over
    navigate('/module-over', {
      state: {
        nextSectionIndex: currentSectionIndex + 1,
        sections: actualSections,
        testData: actualTestData
      }
    });
  }
  else if (currentSequencePosition === 4) {
    // ✅ CHANGED: m2 -> module over (pehle), phir finish test
    navigate('/module-over', {
      state: {
        nextSectionIndex: currentSectionIndex + 1,
        sections: actualSections,
        testData: actualTestData,
        isFinalModule: true  // ✅ NEW: Flag for final module
      }
    });
  }
};

  if (loading) {
    return (
      <div className="test-interface-container">
        <div className="loading-spinner-large"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="test-interface-container">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="test-interface-container">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          No questions available for this section
        </div>
      </div>
    );
  }

  return (
    <div className="test-interface-container">
      {/* Top Header Section */}
      <div className="test-header">
        
        {/* LEFT SIDE: Section Info & Directions Dropdown */}
        <div className="header-left-image-style">
          <span className="section-info-top"><strong>{getCurrentSectionInfo()}</strong></span>
          <div 
            className="directions-dropdown-style"
            onClick={toggleDirectionsPopup}
          >
            <span className="directions-text-top">Directions</span>
            <span className="directions-icon-top">⌄</span>
          </div>
        </div>
        
        {/* CENTER: Timer & Hide Button */}
        <div className="header-center-image-style">
            <span className="timer">{formatTime(timeLeft)}</span>
            <button className="hide-time-btn"><strong>Hide</strong></button>
        </div>

        {/* RIGHT SIDE: Tools/Icons */}
        <div className="header-right-image-style">
            <div className="tool-options-horizontal">
              <div className="tool-set-highlights">
                <div className="tool-icon-row"> 
                    <HighlightIcon />
                    <NotesIcon />
                </div>
                <span className="tool-text-top">Highlights & Notes</span>
              </div>
               
              <div 
                className="tool-set-more-option"
                onClick={toggleNavigatorPopup}
              >
                <span className="tool-more-icon-top">⋮</span>
                <span className="tool-text-top">More</span>
              </div>
              
              <div className="battery-container">
                <div className="battery-icon-wrapper">
                  <BatteryIcon percentage={batteryPercentage} />
                  <span className="battery-percentage-overlay">{batteryPercentage}%</span>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* Color Line Divider */}
      <div className=".question-divider-line-colour " style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
         <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#d1d40bff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#d1d40bff', height: '4px', width: '30px' }}></div>
         <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
         <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#d1d40bff', height: '4px', width: '30px' }}></div>
         <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#d1d40bff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
         <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
         <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#d1d40bff', height: '4px', width: '30px' }}></div>
         <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#d1d40bff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#d1d40bff', height: '4px', width: '30px' }}></div>
         <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        
      </div>
      
      {/* ✅ RENDER THE DIRECTIONS MODAL */}
      <DirectionsModal 
        isOpen={isDirectionsOpen} 
        onClose={toggleDirectionsPopup} 
      />
      
      {/* Main Content Area */}
      <div className="test-main-content">
        
        {/* LEFT SIDE: Question Text / Passage Area */}
        <div className="question-text-area"> 
            {currentQuestion?.question_text && (
              <div className="passage-text">
                <QuestionTextRenderer content={currentQuestion.question_text} />
              </div>
            )}
            
            {currentQuestion?.question_image && (
              <div className="question-image-container">
                <img 
                  src={getImageUrl(currentQuestion.question_image)} 
                  alt="Question" 
                  className="question-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <div className="fullscreen-handle-container">
                <FullscreenIcon /> 
            </div>
        </div>

        {/* RIGHT SIDE: Options Only Area */}
        <div className="options-only-area">
          <div className="options-container"></div>
        
          
     
          <div className="question-header-image-style">
              <div className="question-number-box-center">
               {currentQuestionIndex + 1}
              </div>
              
              <div 
                className="mark-icon-container"
                onClick={handleMarkQuestion}
                style={{ cursor: 'pointer' }}
              >
                <MarkIcon isMarked={markedQuestions.has(currentQuestionIndex + 1)} />
              </div>
              <span className="mark-for-review-text">Mark for Review</span>
              
              <div 
                  className={`abc-icon-container ${abcIconClicked ? 'clicked' : ''}`}
                  onClick={handleAbcIconClick}
              >
                  <AbcIcon />
              </div>
          </div>
          
          {/* Color Line Divider */}
          <div className="question-divider-color-line" style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
             <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#d1d40bff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#d1d40bff', height: '4px', width: '30px' }}></div>
         <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
     
       
          </div>
          
          {/* <div className="question-content-image-style"> */}
          <div className="question-header-image-styles">
              <p className="question-text">
                {currentQuestion?.is_open_ended ? "Type your answer below:" : "Which choice completes the text with the most logical and precise word or phrase?"}
              </p>
          </div>

          
          {/* ✅ CONDITIONAL RENDERING FOR OPEN-ENDED / MCQS */}
          {currentQuestion?.is_open_ended ? (
            /* --- Open Ended Input Area --- */
            <div className="open-ended-input-section">
                <div className="answer-input-container">
                    <textarea
                        className="open-ended-input-box"
                        value={openEndedAnswer}
                        onChange={handleOpenEndedChange}
                        rows={6} 
                    />
                </div>
                
                <div className="answer-preview-container">
                    <p><strong>Answer Preview:</strong></p>
                    <div className="answer-preview-box">
                        {openEndedAnswer || ''}
                    </div>
                </div>
            </div>
          ) : (
            /* --- Standard MCQs Section --- */
            <div className="options-section">
              <div className="options-list">
                {['A', 'B', 'C', 'D'].map((option) => {
                  const optionData = currentQuestion?.[`option_${option.toLowerCase()}`];
                  const hasOptionImage = optionData?.image;
                  const hasOptionText = optionData?.text;
                  
                  return (
                    <div 
                        key={option} 
                        className={`option-item-image-style ${selectedOption === option ? 'selected' : ''} ${hasOptionImage ? 'has-image' : ''}`}
                        onClick={() => handleOptionSelect(option)}
                    >
                      <label className="option-label-container">
                        <div className="option-circle-label">
                            <span className="option-label-text">{option}</span>
                        </div>
                        
                        <div className="option-content-wrapper">
                          {hasOptionText && (
                            <span className="option-text-image-style">
                              <OptionTextRenderer content={optionData.text} />
                            </span>
                          )}
                          
                          {hasOptionImage && (
                            <div className="option-image-container">
                              <img 
                                src={getImageUrl(optionData.image)} 
                                alt={`Option ${option}`}
                                className="option-image"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </div>
                        
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
                      
                      {abcIconClicked && (
                          <div className="option-right-box-style">
                              <div className="option-circle-with-line">
                                  <span className="option-right-label">{option}</span>
                              </div>
                          </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="test-bottom-navbar">
        <div className="color-line-container">
           <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#d1d40bff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#d1d40bff', height: '4px', width: '30px' }}></div>
         <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
         <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#d1d40bff', height: '4px', width: '30px' }}></div>
         <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#d1d40bff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
         <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
         <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#d1d40bff', height: '4px', width: '30px' }}></div>
         <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#d1d40bff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#d1d40bff', height: '4px', width: '30px' }}></div>
         <div className="color-line" style={{ backgroundColor: '#062a79ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#07ac38ff', height: '4px', width: '30px' }}></div>
        <div className="color-line" style={{ backgroundColor: '#b90707ff', height: '4px', width: '25px' }}></div>
        
        </div>
        
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