import { CenterFocusStrong } from '@mui/icons-material';
import React, { useState } from 'react';

const styles = {
    // --- Overlay and Container Styles (Unchanged) ---
    popupOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    feedbackPopupContainer: {
        background: '#ffffff',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '500px',
        padding: '24px',
        position: 'relative',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },

    // --- Title and Close Button (Unchanged) ---
    popupTitle: {
        fontSize: '1.5rem',
        fontWeight: 600,
        color: '#1f1f1f',
        marginTop: 0,
        marginBottom: '24px',
        lineHeight: 1.4,
        textAlign: 'center'
    },
    closeButton: {
        position: 'absolute',
        top: '24px',
        right: '24px',
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        color: '#666',
        padding: 0,
    },

    // --- Rating Options (Unchanged) ---
    ratingOptions: {
        marginBottom: '24px',
    },
    radioOption: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 16px',
        marginBottom: '8px',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: '#f7f7f7',
        transition: 'background-color 0.2s',
        userSelect: 'none',
        position: 'relative',
        minHeight: '20px',
    },
    radioOptionSelected: {
        backgroundColor: '#e6f0ff',
    },
    
    // --- Custom Radio Button Styles (Unchanged) ---
    customRadioCircle: {
        height: '20px',
        width: '20px',
        borderRadius: '50%',
        border: '2px solid #a9a9a9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '12px',
        transition: 'border-color 0.2s',
        flexShrink: 0,
    },
    customRadioCircleSelected: {
        borderColor: '#006aff',
    },
    customRadioInnerDot: {
        height: '10px',
        width: '10px',
        borderRadius: '50%',
        backgroundColor: '#006aff',
    },
    optionText: {
        fontSize: '1rem',
        color: '#333',
        fontWeight: 500,
    },

    // --- Textarea Section (Unchanged) ---
    feedbackPrompt: {
        fontSize: '1rem',
        fontWeight: 600,
        color: '#1f1f1f',
        marginTop: 0,
        marginBottom: '12px',
    },
    feedbackTextarea: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxSizing: 'border-box',
        resize: 'vertical',
        fontSize: '1rem',
        fontFamily: 'inherit',
        marginBottom: '24px',
        minHeight: '100px',
    },
    
    // --- Action Buttons (IMPROVED STYLES) ---
    popupActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '16px', // Gap increased for better spacing
        paddingTop: '8px', // Slight padding above buttons
    },
    dismissButton: {
        background: 'none',
        border: 'none',
        color: '#006aff',
        fontSize: '1.05rem', // Slightly larger font
        fontWeight: 600,
        padding: '10px 18px', // Increased padding
        cursor: 'pointer',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
    },
    submitButton: {
        backgroundColor: '#ffc107',
        color: '#1f1f1f',
        border: 'none',
        borderRadius: '25px',
        fontSize: '1.05rem', // Slightly larger font
        fontWeight: 600,
        padding: '15px 24px', // Increased padding for better visual weight
        cursor: 'pointer',
        minWidth: '120px', // Minimum width increased
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)', // Sharper, more visible shadow
        transition: 'background-color 0.2s, box-shadow 0.2s',
    },
};

// --- RadioOption Component (Unchanged) ---
const RadioOption = ({ value, isSelected, onSelect }) => {
    const radioOptionStyle = isSelected 
        ? { ...styles.radioOption, ...styles.radioOptionSelected }
        : styles.radioOption;

    const customRadioCircleStyle = isSelected 
        ? { ...styles.customRadioCircle, ...styles.customRadioCircleSelected }
        : styles.customRadioCircle;
        
    return (
        <div 
            style={radioOptionStyle}
            onClick={() => onSelect(value)}
            role="radio"
            aria-checked={isSelected}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onSelect(value);
                }
            }}
        >
            <div style={customRadioCircleStyle}>
                {isSelected && <div style={styles.customRadioInnerDot}></div>}
            </div>
            <span style={styles.optionText}>{value}</span>
        </div>
    );
};


// --- FeedbackPopup Component ---
const FeedbackPopup = ({ isOpen, onClose, onSubmit }) => {
    const [rating, setRating] = useState('Fair');
    const [feedbackText, setFeedbackText] = useState('');

    if (!isOpen) {
        return null;
    }

    const handleSubmit = () => {
        // Log data and call the parent onSubmit function
        console.log("Feedback Submitted:", { rating, feedbackText });
        onSubmit({ rating, feedbackText });
        // Close the popup after submission
        onClose(); 
    };

    return (
        <div style={styles.popupOverlay}>
            <div style={styles.feedbackPopupContainer}>
                
                <button style={styles.closeButton} onClick={onClose}>&times;</button>
                
                <h2 style={styles.popupTitle}>
                    Overall, how would you rate your experience taking a test?
                </h2>

                <div style={styles.ratingOptions}>
                    {['Excellent', 'Good', 'Fair', 'Poor'].map((option) => (
                        <RadioOption
                            key={option}
                            value={option}
                            isSelected={rating === option}
                            onSelect={setRating}
                        />
                    ))}
                </div>

                <div style={styles.feedbackSection}>
                    <p style={styles.feedbackPrompt}>
                        What went well? What can we improve?
                    </p>
                    <textarea
                        style={styles.feedbackTextarea}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        rows="4"
                    />
                </div>

                <div style={styles.popupActions}>
                    <button style={styles.dismissButton} onClick={onClose}>
                        Dismiss
                    </button>
                    <button style={styles.submitButton} onClick={handleSubmit}>
                        Submit
                    </button>
                </div>

            </div>
        </div>
    );
};

export default FeedbackPopup;