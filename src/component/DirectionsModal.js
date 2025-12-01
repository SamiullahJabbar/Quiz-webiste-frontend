// src/component/DirectionsModal.js

import React from 'react';

const DirectionsModal = ({ isOpen, onClose }) => {
    if (!isOpen) {
        return null;
    }

    // --- Inline CSS Styles ---

    // 1. Pop-up Container Style
    const modalContainerStyles = {
        position: 'fixed',
        top: '80px',
        left: '50px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        padding: '20px',
        width: '80vw',  /* ✅ 80% of viewport width */
        maxWidth: '1600px', /* ✅ Maximum limit */
        height: '70vh', /* ✅ 70% of viewport height */
        maxHeight: '650px', /* ✅ Maximum limit */
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #ddd',
        overflow: 'visible',
    };

    // 2. Arrow (Nub/Tip) Outer Layer
    const arrowOuterStyles = {
        position: 'absolute',
        width: '0',
        height: '0',
        borderLeft: '15px solid transparent',
        borderRight: '15px solid transparent',
        borderBottom: '15px solid #ddd',
        top: '-15px',
        left: '10px',
        zIndex: 1001,
    };
    
    // 3. Arrow Inner Layer
    const arrowInnerStyles = {
        position: 'absolute',
        width: '0',
        height: '0',
        borderLeft: '15px solid transparent',
        borderRight: '15px solid transparent',
        borderBottom: '15px solid white',
        top: '1px',
        left: '-15px',
        zIndex: 1002,
    };

    // 4. Text Content Container Style
    const textContainerStyles = {
        flex: 1, // ✅ Takes available space
        overflowY: 'auto', // ✅ Scroll if content is long
        marginBottom: '15px',
    };

    // 5. Text Content Style
    const textStyles = {
        fontSize: '25px',
        lineHeight: '1.6',
        fontWeight: 400,
        color: '#333',
        textAlign: 'left',
        width: '100%',
        fontFamily: "Georgia, 'Times New Roman', Times, serif",
    };

    // 6. Close Button Style
    const closeButtonStyles = {
        backgroundColor: '#e9b61fff',
        color: 'black',
        border: 'none',
        borderRadius: '20px',
        padding: '10px 20px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
        alignSelf: 'flex-end',
        flexShrink: 0, // ✅ Button size fixed
    };

    // 7. OVERLAY STYLE
    const overlayStyles = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        zIndex: 999,
    };

    // --- Responsive Styles ---
    
    // Get screen width
    const screenWidth = window.innerWidth;
    
    // Responsive modal styles
    const responsiveModalStyles = {
        ...modalContainerStyles,
        ...(screenWidth <= 1400 && {
            width: '1000px',
            height: '500px', // ✅ Fixed height
            left: '40px',
        }),
        ...(screenWidth <= 1200 && {
            width: '900px',
            height: '500px', // ✅ Fixed height
            left: '30px',
        }),
        ...(screenWidth <= 992 && {
            width: '800px',
            height: '450px', // ✅ Fixed height
            left: '20px',
            top: '100px',
        }),
        ...(screenWidth <= 768 && {
            width: '90%',
            height: '400px', // ✅ Fixed height
            maxHeight: '80vh',
            left: '5%',
            top: '120px',
            padding: '15px',
        }),
        ...(screenWidth <= 480 && {
            width: '95%',
            height: '350px', // ✅ Fixed height
            left: '2.5%',
            top: '100px',
            padding: '12px',
        }),
    };

    // Responsive arrow styles
    const responsiveArrowStyles = {
        ...arrowOuterStyles,
        ...(screenWidth <= 768 && {
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderBottom: '12px solid #ddd',
            top: '-12px',
            left: '20px',
        }),
        ...(screenWidth <= 480 && {
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderBottom: '10px solid #ddd',
            top: '-10px',
            left: '25px',
        }),
    };

    // Responsive inner arrow styles
    const responsiveInnerArrowStyles = {
        ...arrowInnerStyles,
        ...(screenWidth <= 768 && {
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderBottom: '12px solid white',
            left: '-12px',
        }),
        ...(screenWidth <= 480 && {
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderBottom: '10px solid white',
            left: '-10px',
        }),
    };

    // Responsive text styles
    const responsiveTextStyles = {
        ...textStyles,
        ...(screenWidth <= 1200 && {
            fontSize: '22px',
            lineHeight: '1.5',
        }),
        ...(screenWidth <= 992 && {
            fontSize: '20px',
            lineHeight: '1.5',
        }),
        ...(screenWidth <= 768 && {
            fontSize: '18px',
            lineHeight: '1.4',
        }),
        ...(screenWidth <= 480 && {
            fontSize: '16px',
            lineHeight: '1.3',
        }),
    };

    // Responsive button styles
    const responsiveButtonStyles = {
        ...closeButtonStyles,
        ...(screenWidth <= 480 && {
            padding: '8px 16px',
            fontSize: '14px',
        }),
    };

    // --- Component JSX ---

    return (
        <>
            {/* Background Overlay */}
            <div style={overlayStyles} onClick={onClose} />
            
            {/* Modal Content */}
            <div style={responsiveModalStyles}>
                
                {/* Arrow Element */}
                <div style={responsiveArrowStyles}>
                    <div style={responsiveInnerArrowStyles}></div>
                </div>
                
                {/* Text Content Container with Scroll */}
                <div style={textContainerStyles}>
                    <div style={responsiveTextStyles}>
                        <p>
                            The questions in this section address a number of important reading and writing skills. Each question includes one
                            or more passages, which may include a table or graph. Read each passage and question carefully, and then choose
                            the best answer to the question based on the passage(s).
                        </p>
                        <p>
                            All questions in this section are multiple-choice with four answer choices. Each question has a single best answer.
                        </p>
                    </div>
                </div>
                
                {/* Close Button - Always inside modal */}
                <button style={responsiveButtonStyles} onClick={onClose}>
                    Close
                </button>
            </div>
        </>
    );
};

export default DirectionsModal;