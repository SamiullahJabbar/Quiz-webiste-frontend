import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExamImage from '../images/exam.JPG'; // Make sure the image is in the correct location

// --- Inline CSS Styles Object ---
const styles = {
    screenContainer: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        boxSizing: 'border-box'
    },
    contentWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '800px'
    },
    header: {
        fontSize: '24px',
        fontWeight: '500',
        marginBottom: '10px',
        color: '#0c0c0cff',
        textAlign: 'center',
        width: '100%'
    },
    subtext: {
        fontSize: '16px',
        lineHeight: '1.4',
        marginBottom: '40px',
        color: '#252424ff',
        textAlign: 'center',
        width: '100%'
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '30px 40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
        maxWidth: '700px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box'
    },
    uploadingSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        padding: '20px 0',
        width: '100%'
    },
    imageStyle: {
        width: '350px',
        height: 'auto',
        marginBottom: '20px',
        maxWidth: '100%'
    },
    bottomInstruction: {
        fontSize: '14px',
        marginTop: '20px',
        marginBottom: '8px',
        color: '#2b2525ff',
        textAlign: 'center',
        width: '100%'
    },
    returnLink: {
        fontSize: '14px',
        color: '#333333',
        textDecoration: 'none',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    spinnerWrapper: {
        position: 'relative',
        width: '80px',
        height: '80px',
        marginBottom: '25px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: '40px'
    },
    progressBar: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#333',
        zIndex: 2,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        margin: 10
    },
    loadingDotsSpinner: {
        display: 'inline-block',
        position: 'relative',
        width: '80px',
        height: '80px',
        marginTop: '20px'
    },
    dot: {
        position: 'absolute',
        width: '10px',
        height: '10px',
        background: '#0f0f0f',
        borderRadius: '50%',
        animation: 'multi-dot-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite'
    },
    // Dot positions
    dot1: {
        top: '5px',
        left: '45px',
        animationDelay: '-0.4s'
    },
    dot2: {
        top: '13px',
        left: '65px',
        animationDelay: '-0.5s'
    },
    dot3: {
        top: '30px',
        left: '72px',
        animationDelay: '-0.6s'
    },
    dot4: {
        top: '50px',
        left: '65px',
        animationDelay: '-0.7s'
    },
    dot5: {
        top: '58px',
        left: '45px',
        animationDelay: '-0.8s'
    },
    dot6: {
        top: '50px',
        left: '25px',
        animationDelay: '-0.9s'
    },
    dot7: {
        top: '30px',
        left: '18px',
        animationDelay: '-1.0s'
    },
    dot8: {
        top: '13px',
        left: '25px',
        animationDelay: '-1.1s'
    }
};
// --- End of Inline CSS Styles Object ---

// --- Loading Dots Spinner Component ---
const LoadingDotsSpinner = () => {
    return (
        <div style={styles.loadingDotsSpinner}>
            <div style={{...styles.dot, ...styles.dot1}}></div>
            <div style={{...styles.dot, ...styles.dot2}}></div>
            <div style={{...styles.dot, ...styles.dot3}}></div>
            <div style={{...styles.dot, ...styles.dot4}}></div>
            <div style={{...styles.dot, ...styles.dot5}}></div>
            <div style={{...styles.dot, ...styles.dot6}}></div>
            <div style={{...styles.dot, ...styles.dot7}}></div>
            <div style={{...styles.dot, ...styles.dot8}}></div>
            
            {/* Animation style as inline style tag */}
            <style>{`
                @keyframes multi-dot-spin {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                        
                    }
                    50% {
                        transform: scale(0.5);
                        opacity: 0.5;
                    }
                }
                
                .loading-dots-spinner div {
                    animation: multi-dot-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
                }
            `}</style>
        </div>
    );
};
// --- End of Loading Dots Spinner Component ---

// --- Main Exam Finished Screen Component ---
const ExamFinishedScreen = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/finishTest');
        }, 5000); // 5 सेकंड के बाद रीडायरेक्ट

        return () => clearTimeout(timer); // क्लीनअप
    }, [navigate]);

    return (
        <div style={styles.screenContainer}>
            <div style={styles.contentWrapper}>
                <h1 style={styles.header}>The Exam Is Over: Stand By!</h1>
                <p style={styles.subtext}>
                    All your work has been saved, and we're <br/>uploading it now. Do not refresh this page or <br/>quit the app.
                </p>

                <div style={styles.card}>
                    <div style={styles.uploadingSection}>
                        {/* 100% Text and Circular Spinner */}
                        <div style={styles.spinnerWrapper}>
                            <p style={styles.progressBar}>100%</p>
                            <LoadingDotsSpinner />
                        </div>
                        
                        {/* Image used as the main icon */}
                        <img 
                            src={ExamImage} 
                            alt="Exam Upload in Progress" 
                            style={styles.imageStyle} 
                        />
                    </div>

                    {/* Instruction and Link */}
                    <p style={styles.bottomInstruction}>
                        If this screen doesn't update in a few minutes, hit
                    </p>
                    <a 
                        href="#" 
                        style={styles.returnLink}
                        onClick={(e) => { 
                            e.preventDefault(); 
                            console.log('Return to Home clicked'); 
                        }}
                    >
                        Return to Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ExamFinishedScreen;