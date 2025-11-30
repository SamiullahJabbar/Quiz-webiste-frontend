// FinishTestScreen.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/FinishTestScreen.css'; 
import laptopImage from '../images/finalscreen.png'; 
import FeedbackPopup from '../component/FeedbackPopup'; // Import the updated component

// --- SVG Icons (Unchanged) ---
const HouseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="35px" viewBox="0 0 24 24" width="30px" fill="currentColor">
        <g><rect fill="none" height="24" width="24"/></g>
        <g><g><path d="M19,9.3V4h-3v2.6L12,3L2,12h3v8h6v-6h2v6h6v-8h3L19,9.3z M17,18h-2v-6H9v6H7v-7.81l5-4.5l5,4.5V18z"/>
        <path d="M10,10h4c0-1.1-0.9-2-2-2S10,8.9,10,10z"/></g></g>
    </svg>
);

const HelpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="36px" viewBox="0 -960 960 960" width="30px" fill="#B7B7B7">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M482-244.67q17.67 0 29.83-12.16Q524-269 524-286.67q0-17.66-12.17-29.83-12.16-12.17-29.83-12.17-17.67 0-29.83 12.17Q440-304.33 440-286.67q0 17.67 12.17 29.84 12.16 12.16 29.83 12.16Zm-35.33-148.66h64q0-28.34 6.83-49 6.83-20.67 41.17-50.34 29.33-26 43-50.5 13.66-24.5 13.66-55.5 0-54-36.66-85.33-36.67-31.33-93.34-31.33-51.66 0-88.5 26.33Q360-662.67 344-620l57.33 22q9-24.67 29.5-42t52.5-17.33q33.34 0 52.67 18.16 19.33 18.17 19.33 44.5 0 21.34-12.66 40.17-12.67 18.83-35.34 37.83-34.66 30.34-47.66 54-13 23.67-13 69.34ZM480-80q-82.33 0-155.33-31.5-73-31.5-127.34-85.83Q143-251.67 111.5-324.67T80-480q0-83 31.5-156t85.83-127q54.34-54 127.34-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82.33-31.5 155.33-31.5 73-85.5 127.34Q709-143 636-111.5T480-80Zm0-66.67q139.33 0 236.33-97.33t97-236q0-139.33-97-236.33t-236.33-97q-138.67 0-236 97-97.33 97-97.33 236.33 0 138.67 97.33 236 97.33 97.33 236 97.33ZM480-480Z"/>
    </svg>
);


// 1. Main FinishTestScreen Component
const FinishTestScreen = () => {
    const navigate = useNavigate();
    // State to control the visibility of the popup
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

    // Use useEffect to open the popup 5 seconds after component mounts
    useEffect(() => {
        // 5000 milliseconds = 5 seconds
        const timer = setTimeout(() => {
            setIsFeedbackOpen(true); 
        }, 5000); 

        return () => clearTimeout(timer); // Cleanup the timer on component unmount
    }, []);

    const handleReturnToHomepage = () => {
        navigate('/dashboard'); 
    };
    
    // Function to handle the feedback submission 
    const handleFeedbackSubmit = (data) => {
        console.log("Feedback submitted to API:", data);
        // You would typically send the data to your server here
        setIsFeedbackOpen(false); // Close popup after successful submission
    };

    return (
        <div className="finish-screen-container">
            
            {/* FEEDBACK POPUP COMPONENT (Opens after 5 seconds) */}
            <FeedbackPopup 
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)} // Allows user to dismiss it
                onSubmit={handleFeedbackSubmit}
            />

            {/* --- Original Content Starts Here --- */}
            <div className="finish-screen-header">
                <div className="header-left">
                    <span className="header-link help-link">
                        <HelpIcon /> <strong>Help</strong>
                    </span>
                </div>
                <div className="header-right">
                    <span className="header-link return-home-link" onClick={handleReturnToHomepage}>
                       <strong>Return to Home</strong> <HouseIcon />
                    </span>
                </div>
            </div>

            {/* --- Updated Confetti Effect --- */}
            <div className="confetti-effect">
                {/* Yellow Lines */}
                <div className="confetti-line yellow delay-1" style={{left: '10%'}}></div>
                <div className="confetti-line yellow delay-2" style={{left: '20%'}}></div>
                <div className="confetti-line yellow delay-3" style={{left: '30%'}}></div>
                
                {/* Blue Lines */}
                <div className="confetti-line blue delay-1" style={{left: '40%'}}></div>
                <div className="confetti-line blue delay-2" style={{left: '50%'}}></div>
                <div className="confetti-line blue delay-3" style={{left: '60%'}}></div>
                
                {/* Red Lines */}
                <div className="confetti-line red delay-1" style={{left: '70%'}}></div>
                <div className="confetti-line red delay-2" style={{left: '80%'}}></div>
                <div className="confetti-line red delay-3" style={{left: '90%'}}></div>
                
                {/* Additional lines for more coverage */}
                <div className="confetti-line green delay-4" style={{left: '15%'}}></div>
                <div className="confetti-line purple delay-4" style={{left: '25%'}}></div>
                <div className="confetti-line yellow delay-5" style={{left: '35%'}}></div>
                <div className="confetti-line blue delay-5" style={{left: '45%'}}></div>
                <div className="confetti-line red delay-4" style={{left: '55%'}}></div>
                <div className="confetti-line green delay-5" style={{left: '65%'}}></div>
                <div className="confetti-line purple delay-4" style={{left: '75%'}}></div>
                <div className="confetti-line yellow delay-5" style={{left: '85%'}}></div>
                <div className="confetti-line blue delay-4" style={{left: '95%'}}></div>
            </div>

            <div className="main-page-content">
                <h2 className="congratulations-title">Congratulations!</h2>
                <p className="submission-text"><strong>Your test is complete, and your answers have been submitted.</strong></p>
                
                <div className="finish-content-box">
                    <div className="main-info-section">
                        
                        {/* Left: Laptop Image */}
                        <div className="info-icon-area">
                            <img src={laptopImage} alt="Laptop" className="laptop-image" />
                        </div>

                        {/* Right: Instructions */}
                        <div className="info-instructions">
                            <p className="instruction-item">
    <span className="blue-bold">Raise your hand,</span> and your<br />proctor will dismiss you.
</p>
                            <p className="instruction-item">
                                <span className="blue-bold">Please be quiet,</span> other<br /> students may still be testing.
                            </p>
                            <p className="instruction-item">
                                Go to <span className="blue-bold">My SAT</span> to see when<br /> your scores will be available.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Button */}
                <button 
                    className="return-button"
                    onClick={handleReturnToHomepage}
                >
                    Return to Homepage
                </button>
            </div>
            {/* --- Original Content Ends Here --- */}
        </div>
    );
};

export default FinishTestScreen;