import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenManager, BASE_URL } from '../api/baseurls'; 
import '../css/BreakScreen.css';

// --- Component Definitions ---

// 1. Loading/Spinner Icon (New Round Circle Spinner)
const LoadingSpinnerCircle = () => (
    // 'spinner-circle' class will be defined in CSS for the round spinner
    <div className="spinner-circle-container">
        <div className="spinner-circle"></div>
    </div>
);


// 2. Main BreakScreen Component (Rest of the logic is unchanged)
const BreakScreen = () => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(10); 
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [isLoadingComplete, setIsLoadingComplete] = useState(false);
    const [userName, setUserName] = useState('Loading User...');

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
        return 'Aisha Syrym'; 
    };


    // --- Effects (Unchanged) ---
    useEffect(() => {
        setUserName(getUserName());
        
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsTimeUp(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);


    useEffect(() => {
        if (isTimeUp) {
            const loadingTimer = setTimeout(() => {
                setIsLoadingComplete(true); 
                navigate('/finshTest');
            }, 5000); 

            return () => clearTimeout(loadingTimer);
        }
    }, [isTimeUp, navigate]);


    // --- Render Logic ---

    // Loading State (Image 2 - now with Circle Spinner)
    if (isTimeUp && !isLoadingComplete) {
        return (
            <div className="break-screen-container loading-state">
                <div className="loading-content">
                    <h2 className="module-over-title">This Module Is Over</h2>
                    <p className="module-over-text">All your work has been saved.</p>
                    <p className="module-over-text">You'll move on automatically in just a moment.</p>
                    <p className="module-over-text no-refresh">Do not refresh this page or quit the app.</p>
                    {/* *** Changed to the new Circle Spinner *** */}
                    <LoadingSpinnerCircle /> 
                </div>
            </div>
        );
    }
    
    // Default Break Screen Render (Image 1 - Unchanged)
    return (
        <div className="break-screen-container">
            {/* <div className="battery-indicator">78% 🔋</div>  */}
            
            <div className="break-content-wrapper">
                
                <div className="break-text-content">
                    <h1>Take a Break: Do Not Close <br/> Your Device</h1>
                    <p>After the break, a <strong>Resume Testing Now</strong> button will appear and you'll start the next section.</p>
                    
                    <h3 className="break-rules-heading">Follow these rules during the break:</h3>
                    <ol className="break-rules-list">
                        <li>Do not disturb students who who are still testing.</li>
                        <li>Do not exit the app or close your laptop.</li>
                        <li>Do not access phones, smartwatches, textbooks, notes, or the internet.</li>
                        <li>Do not eat or drink near any testing device.</li>
                    </ol>
                </div>
                
                <div className="break-timer-box">
                    <p className="timer-label">Remaining Break Time:</p>
                    <div className="timer-display">{formatTime(timeLeft)}</div>
                </div>

                <div className="break-user-name">
                    {userName}
                </div>
            </div>
        </div>
    );
};

export default BreakScreen;