// src/component/QuestionNavigatorModal.js

import React from 'react';

// 3. MARK ICON (Bookmark) - Using your provided SVG for status icons
const MarkIcon = ({ fill = '#4e4c4cff', height = '20px', width = '20px' }) => (
    <svg 
        className="mark-icon-bookmark" 
        xmlns="http://www.w3.org/2000/svg" 
        height={height} 
        viewBox="0 -960 960 960" 
        width={width} 
        fill={fill}
    >
        <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z"/>
    </svg>
);

// Close Icon SVG (Simple 'X')
const CloseIcon = ({ size = '24px', color = '#555' }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        height={size} 
        viewBox="0 -960 960 960" 
        width={size} 
        fill={color}
    >
        <path d="m251-213-38-38 229-229-229-229 38-38 229 229 229-229 38 38-229 229 229 229-38 38-229-229-229 229Z"/>
    </svg>
);


/**
 * QuestionNavigatorModal Component
 * Renders the question grid pop-up for navigation.
 * @param {boolean} isOpen - Controls the visibility.
 * @param {function} onClose - Function to call when Close button or X is clicked.
 * @param {string} sectionTitle - e.g., "Section 1, Module 2: Reading and Writing"
 * @param {number} totalQuestions - Total number of questions (e.g., 27)
 * @param {number} currentQuestionIndex - 0-indexed current question
 * @param {Set<number>} markedQuestions - Set of 1-indexed marked question numbers
 * @param {function} onQuestionSelect - Function to handle question button click (1-indexed)
 */
const QuestionNavigatorModal = ({ 
    isOpen, 
    onClose, 
    sectionTitle = "Section 1, Module 2: Reading and Writing", 
    totalQuestions = 27, 
    currentQuestionIndex = 0, // 0-indexed
    markedQuestions = new Set(),
    onQuestionSelect = () => {} 
}) => {
    
    if (!isOpen) {
        return null;
    }

    // Convert 0-indexed to 1-indexed for display
    const currentQuestionNumber = currentQuestionIndex + 1;
    
    // --- Inline CSS Styles ---

    // 1. Modal Overlay Container Style (Full Screen)
    const modalContainerStyles = {
        position: 'fixed',
        zIndex: 1010,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '350px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative', 
    };
    
    // 2. Arrow (Nub/Tir) Outer Layer Style (for border/shadow)
    const arrowOuterStyles = {
        position: 'absolute',
        width: '0',
        height: '0',
        borderLeft: '12px solid transparent',
        borderRight: '12px solid transparent',
        borderBottom: '12px solid #ddd',
        top: '-12px', 
        right: '30px',
        zIndex: 1011,
        filter: 'drop-shadow(0 -1px 1px rgba(0, 0, 0, 0.05))',
    };
    
    // 3. Arrow Inner Layer Style (for white fill)
    const arrowInnerStyles = {
        position: 'absolute',
        width: '0',
        height: '0',
        borderLeft: '12px solid transparent',
        borderRight: '12px solid transparent',
        borderBottom: '12px solid white',
        top: '1px', 
        left: '-12px', 
        zIndex: 1012,
    };

    // 4. Header Style
    const headerStyles = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        borderBottom: '1px solid #eee',
    };

    const headerTitleStyles = {
        fontSize: '15px',
        fontWeight: '600',
        color: '#333',
        margin: 0,
    };
    
    // 5. Status Indicators Container
    const statusContainerStyles = {
        display: 'flex',
        justifyContent: 'flex-start',
        gap: '20px',
        padding: '15px 20px',
        borderBottom: '1px solid #eee',
    };
    
    // 6. Individual Status Item
    const statusItemStyles = {
        display: 'flex',
        alignItems: 'center',
        fontSize: '13px',
        color: '#555',
        fontWeight: '500',
    };
    
    const statusDotCurrentStyles = {
        height: '10px',
        width: '10px',
        borderRadius: '50%',
        backgroundColor: '#D9D9D9',
        border: '2px solid #FBC02D',
        marginRight: '6px',
    };
    
    const statusDotUnansweredStyles = {
        height: '10px',
        width: '10px',
        borderRadius: '50%',
        backgroundColor: '#D9D9D9',
        marginRight: '6px',
    };
    
    const statusMarkIconStyles = {
        marginRight: '6px',
    };

    // 7. Question Grid Styles
    const gridContainerStyles = {
        padding: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '12px',
        justifyContent: 'center',
    };

    // 8. Question Button Styles
    const getQuestionButtonStyles = (number) => {
        const isCurrent = number === currentQuestionNumber;
        const isMarked = markedQuestions.has(number);
        
        const baseStyle = {
            height: '40px',
            width: '40px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            backgroundColor: isCurrent ? '#FBC02D' : (isMarked ? '#FFF9C4' : 'white'),
            color: isCurrent ? 'black' : '#333',
            fontSize: '14px',
            fontWeight: isCurrent ? '700' : '500',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            transition: 'background-color 0.1s',
        };

        const currentStyle = isCurrent ? {
            boxShadow: '0 0 0 2px black inset', 
        } : {};

        return { ...baseStyle, ...currentStyle };
    };
    
    // 9. Mark Badge Style for button
    const markBadgeStyles = {
        position: 'absolute',
        top: '2px',
        right: '2px',
        height: '10px',
        width: '10px',
    };
    
    // 10. Footer Style
    const footerStyles = {
        padding: '15px 20px',
        borderTop: '1px solid #eee',
        textAlign: 'center',
    };
    
    const goButtonStyles = {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '20px', 
        padding: '10px 25px',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '600',
        transition: 'background-color 0.2s',
    };

    // --- Component JSX ---

    return (
        <div style={modalContainerStyles}>
            
            {/* Arrow Element */}
            <div style={arrowOuterStyles}>
                <div style={arrowInnerStyles}></div>
            </div>
            
            {/* Header */}
            <div style={headerStyles}>
                <p style={headerTitleStyles}>{sectionTitle}</p>
                <div onClick={onClose} style={{ cursor: 'pointer', padding: '5px' }}>
                    <CloseIcon />
                </div>
            </div>

            {/* Status Indicators */}
            <div style={statusContainerStyles}>
                <div style={statusItemStyles}>
                    <div style={statusDotCurrentStyles}></div>
                    Current
                </div>
                <div style={statusItemStyles}>
                    <div style={statusDotUnansweredStyles}></div>
                    Unanswered
                </div>
                <div style={statusItemStyles}>
                    <div style={statusMarkIconStyles}>
                        <MarkIcon fill="#007bff" height="15px" width="15px" /> 
                    </div>
                    For Review
                </div>
            </div>
            
            {/* Question Grid */}
            <div style={gridContainerStyles}>
                {Array.from({ length: totalQuestions }, (_, i) => i + 1).map(number => {
                    const isMarked = markedQuestions.has(number);
                    
                    return (
                        <button 
                            key={number}
                            style={getQuestionButtonStyles(number)}
                            onClick={() => onQuestionSelect(number)}
                        >
                            {number}
                            {/* Marker icon for Marked for Review questions */}
                            {isMarked && (
                                <div style={markBadgeStyles}>
                                    <MarkIcon fill="#007bff" height="100%" width="100%" /> 
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Footer */}
            <div style={footerStyles}>
                <button style={goButtonStyles}>
                    Go to Review Page
                </button>
            </div>
        </div>
    );
};

export default QuestionNavigatorModal;