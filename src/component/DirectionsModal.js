// src/component/DirectionsModal.js

import { fontFamily, fontWeight } from '@mui/system';
import React from 'react';

/**
 * DirectionsModal Component
 * Renders a tooltip-style pop-up with directions and a close button.
 * @param {boolean} isOpen - Controls the visibility of the modal.
 * @param {function} onClose - Function to call when the Close button is clicked.
 */
const DirectionsModal = ({ isOpen, onClose }) => {
    // 1. Hide the component completely when not open
    if (!isOpen) {
        return null;
    }

    // --- Inline CSS Styles ---

    // 1. Pop-up Container Style - FIXED POSITION
    const modalContainerStyles = {
        // *** CRITICAL FIX: position: 'fixed' ***
        // This makes it an **OVERLAY** that doesn't affect document flow
        position: 'fixed', 
        
        // Positioning based on the screenshot:
        top: '80px', 
        left: '50px', 
        
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        
        // Adjusted width for the compact look:
        width: '1200px', 
        height: '700px', // Auto height based on content
        
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start', 
        border: '1px solid #ddd',
    };

    // 2. Arrow (Nub/Tip) Outer Layer Style (for border/shadow)
    const arrowOuterStyles = {
        position: 'absolute',
        width: '0',
        height: '0',
        borderLeft: '15px solid transparent',
        borderRight: '15px solid transparent',
        borderBottom: '15px solid #ddd', // The border color of the box
        top: '-15px', 
        left: '10px', // Points to the "Directions" link
        zIndex: 1001,
        filter: 'drop-shadow(0 -2px 1px rgba(0, 0, 0, 0.1))',
    };
    
    // 3. Arrow Inner Layer Style (for white fill)
    const arrowInnerStyles = {
        position: 'absolute',
        width: '0',
        height: '0',
        borderLeft: '15px solid transparent',
        borderRight: '15px solid transparent',
        borderBottom: '15px solid white', // The fill color
        top: '1px', 
        left: '-15px', 
        zIndex: 1002,
    };

    // 4. Text Content Style
    const textStyles = {
        fontSize: '25px',
        lineHeight: '1.6',
        fontWeight: 400,
        color: '#333',
        marginBottom: '15px',
        textAlign: 'left',
        width: '100%', 
        fontFamily: "Georgia, 'Times New Roman', Times, serif", 
    };

    // 5. Close Button Style (Yellow/Orange color)
    const closeButtonStyles = {
        backgroundColor: '#e9b61fff', 
        color: 'black',
        border: 'none',
        borderRadius: '20px', 
        padding: '10px 20px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '400px', // Small margin below the text
        alignSelf: 'flex-end',
        transition: 'background-color 0.2s', 
        
    };

    // 6. OVERLAY STYLE - To dim the background content
    const overlayStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)', // Light dim effect
        zIndex: 999, // Just below the modal
    };

    // --- Component JSX ---

    return (
        <>
            {/* Background Overlay - This creates the dim effect */}
            <div style={overlayStyles} onClick={onClose} />
            
            {/* Modal Content */}
            <div style={modalContainerStyles}>
                
                {/* Arrow Element */}
                <div style={arrowOuterStyles}>
                    <div style={arrowInnerStyles}></div>
                </div>
                
                {/* Text Content */}
                <div style={textStyles}>
                    <p>
                        The questions in this section address a number of important reading and writing skills. Each question includes one
                        or more passages, which may include a table or graph. Read each passage and question carefully, and then choose
                        the best answer to the question based on the passage(s).
                    </p>
                    <p>
                        All questions in this section are multiple-choice with four answer choices. Each question has a single best answer.
                    </p>
                </div>
                
                {/* Close Button */}
                <button style={closeButtonStyles} onClick={onClose}>
                    Close
                </button>
            </div>
        </>
    );
};

export default DirectionsModal;