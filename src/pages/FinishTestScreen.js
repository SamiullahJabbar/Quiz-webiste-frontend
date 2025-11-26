import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/FinishTestScreen.css'; 
import laptopImage from '../images/laptop.png'; 

// --- SVG Icons (Unchanged) ---
const HouseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
        <g><rect fill="none" height="24" width="24"/></g>
        <g><g><path d="M19,9.3V4h-3v2.6L12,3L2,12h3v8h6v-6h2v6h6v-8h3L19,9.3z M17,18h-2v-6H9v6H7v-7.81l5-4.5l5,4.5V18z"/>
        <path d="M10,10h4c0-1.1-0.9-2-2-2S10,8.9,10,10z"/></g></g>
    </svg>
);

const HelpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
    </svg>
);

// 1. Main FinishTestScreen Component
const FinishTestScreen = () => {
    const navigate = useNavigate();

    const handleReturnToHomepage = () => {
        navigate('/dashboard'); 
    };

    return (
        <div className="finish-screen-container">
            
            <div className="finish-screen-header">
                <div className="header-left">
                    <span className="header-link help-link">
                        <HelpIcon /> Help
                    </span>
                </div>
                <div className="header-right">
                    <span className="header-link return-home-link" onClick={handleReturnToHomepage}>
                        Return to Home <HouseIcon />
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
        </div>
    );
};

export default FinishTestScreen;