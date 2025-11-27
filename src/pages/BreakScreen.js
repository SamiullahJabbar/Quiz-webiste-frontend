import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TokenManager, BASE_URL } from '../api/baseurls'; 
import '../css/BreakScreen.css';

// --- Component Definitions ---

// 1. Multi-Dot Loader (No Change)
const LoadingDotsSpinner = () => (
    <div className="loading-dots-spinner">
        {/* 8 dots, image jaisa effect dene ke liye */}
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
);


// 2. Battery Icon (No Change)
const BatteryIcon = () => (
    <svg className="battery-icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#d1d1d1ff">
        <path d="M160-240q-50 0-85-35t-35-85v-240q0-50 35-85t85-35h540q50 0 85 35t35 85v240q0 50-35 85t-85 35H160Zm0-80h540q17 0 28.5-11.5T740-360v-240q0-17-11.5-28.5T700-640H160q-17 0-28.5 11.5T120-600v240q0 17 11.5 28.5T160-320Zm700-60v-200h20q17 0 28.5 11.5T920-540v120q0 17-11.5 28.5T880-380h-20Zm-700 20v-240h400v240H160Z"/>
    </svg>
);

// 3. Main BreakScreen Component
const BreakScreen = () => {
    const navigate = useNavigate();
    // TimeLeft ko 2 minute (120 seconds) se badal kar 2 seconds par set kiya gaya hai 
    // taake aap jaldi se loading screen dekh saken. Agar aapko 2 minute hi chahiye 
    // toh isko 120 rakh dein.
    const [timeLeft, setTimeLeft] = useState(2); 
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [isLoadingComplete, setIsLoadingComplete] = useState(false);
    const [userName, setUserName] = useState('Loading User...');

    // --- Utility Functions (No Change) ---
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

    // --- Effects (No Change) ---
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
            // Loading time ko 500000 se kam kiya gaya hai taake aap test kar saken.
            const loadingTimer = setTimeout(() => {
                setIsLoadingComplete(true); 
                navigate('/finshTest');
            }, 5000); 

            return () => clearTimeout(loadingTimer);
        }
    }, [isTimeUp, navigate]);


    // --- Render Logic ---

    // Loading State (Image 2 - Module Over)
    if (isTimeUp && !isLoadingComplete) {
        return (
            <div className="break-screen-container loading-state">
                {/* 🚨 Battery Indicator ko yahan se HATA diya gaya hai taake woh Module Over screen par na dikhe 🚨 */}
                
                <div className="loading-content">
                    <h2 className="module-over-title">This Module Is Over</h2>
                    <p className="module-over-text">All your work has been saved.</p>
                    <p className="module-over-text">You'll move on automatically in just a moment.</p>
                    <p className="module-over-text no-refresh">Do not refresh this page or quit the app.</p>
                    <LoadingDotsSpinner /> 
                </div>
            </div>
        );
    }
    
    // Default Break Screen Render (Image 1)
    return (
        <div className="break-screen-container">
            {/* ✅ Battery Indicator ab sirf is break screen par dikhega ✅ */}
            <div className="battery-indicator">
                <BatteryIcon />
                <span>81%</span>
            </div>
            
            <div className="break-content-wrapper">
                <div className="break-text-content">
                    <h1>Take a Break: Do Not Close <br/> Your Device</h1>
                    <p>After the break, a <strong style={{color: '#ffffff'}}>Resume Testing Now</strong> button will <br/>appear and you'll start the next section.</p>
                    
                    <h3 className="break-rules-heading">Follow these rules during the break:</h3>
                    <ol className="break-rules-list">
                        <li>Do not disturb students who who are still testing.</li>
                        <li>Do not exit the app or close your laptop.</li>
                        <li>Do not access phones, smartwatches,<br/> textbooks, notes, or the internet.</li>
                        <li>Do not eat or drink near any testing device.</li>
                    </ol>
                </div>
                
                <div className="break-timer-box">
                    <p className="timer-label"><strong>Remaining Break Time:</strong></p>
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