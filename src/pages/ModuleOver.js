import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/BreakScreen.css';

// Multi-Dot Loader Component
const LoadingDotsSpinner = () => (
    <div className="loading-dots-spinner">
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

const ModuleOverScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get data from navigation state
    const { nextSectionIndex, sections, testData } = location.state || {};

    useEffect(() => {
        // Navigate to next module after 4 seconds
        const loadingTimer = setTimeout(() => {
            navigate('/Testface', {
                state: {
                    testData: testData,
                    initialSectionIndex: nextSectionIndex
                },
                replace: true
            });
        }, 4000);

        return () => clearTimeout(loadingTimer);
    }, [navigate, nextSectionIndex, testData]);

    return (
        <div className="break-screen-container loading-state">
            <div className="loading-content">
                <h2 className="module-over-title">This Module Is Over</h2>
                <p className="module-over-text">All your work has been saved.</p>
                <p className="module-over-text">You'll move on automatically in just a moment.</p>
                <p className="module-over-text no-refresh">Do not refresh this page or quit the app.</p>
                <LoadingDotsSpinner />
            </div>
        </div>
    );
};

export default ModuleOverScreen;










