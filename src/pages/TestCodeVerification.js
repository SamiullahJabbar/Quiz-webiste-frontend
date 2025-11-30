import React, { useState, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- useNavigate ADDED
import '../css/TestCodeVerification.css';
import { HelpOutline } from '@mui/icons-material';
import { TokenManager, BASE_URL } from '../api/baseurls';

// NEW ICON 1: Custom Home Icon (using provided SVG path)
const CustomHomeIcon = forwardRef((props, ref) => (
    <svg
        {...props}
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        height="28px" // Adjusted size for consistency
        viewBox="0 -960 960 960"
        width="28px" // Adjusted size for consistency
        fill="#141414ff" 
    >
        <path d="M200.67-160v-383.33L80-451.33 40-504l440-336 172 131.33V-800h106.67v172.67L920-504l-40.67 52.67L758.67-544v384h-232v-240h-93.34v240H200.67Zm66.66-66.67h99.34v-240h226.66v240H692v-367.66l-212-162-212.67 162v367.66Zm129.34-339.66h166.66q0-32.67-25-53.84-25-21.16-58.33-21.16t-58.33 21.06q-25 21.06-25 53.94Zm-30 339.66v-240h226.66v240-240H366.67v240Z"/>
    </svg>
));

// NEW ICON 2: Custom Document Icon (using provided SVG path)
const CustomDocumentIcon = forwardRef((props, ref) => (
    <svg
        {...props}
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        height="26px" // Adjusted size for consistency
        viewBox="0 -960 960 960"
        width="24px" // Adjusted size for consistency
        fill="#666262ff" // ***UPDATED: Hardcoded fill to WHITE***
    >
        <path d="M319.33-246.67h321.34v-66.66H319.33v66.66Zm0-166.66h321.34V-480H319.33v66.67ZM226.67-80q-27 0-46.84-19.83Q160-119.67 160-146.67v-666.66q0-27 19.83-46.84Q199.67-880 226.67-880H574l226 226v507.33q0 27-19.83 46.84Q760.33-80 733.33-80H226.67Zm314-542.67v-190.66h-314v666.66h506.66v-476H540.67Zm-314-190.66v190.66-190.66 666.66-666.66Z"/>
    </svg>
));

const StartCodeScreen = () => {
    // Add useNavigate hook
    const navigate = useNavigate();
    
    const [code, setCode] = useState(new Array(6).fill(''));
    
    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newCode = [...code];
        newCode[index] = element.value;
        setCode(newCode);

        // Auto-focus logic
        if (element.value !== '' && index < 5) {
            document.getElementById(`code-input-${index + 1}`).focus();
        }
    };

    // --- UPDATED: handleStartTest function to handle new API response and navigation ---
    const handleStartTest = async () => {
        const fullCode = code.join('');

        if (fullCode.length !== 6) {
            alert('Please enter a complete 6-digit code.');
            return;
        }

        try {
            const token = TokenManager.getToken();
            const response = await fetch(`${BASE_URL}/tests/verify_code/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` })
                },
                body: JSON.stringify({ code: fullCode })
            });

            const data = await response.json();

            // Check if verification was successful and 'valid' is true
            if (response.ok && data.valid === true && data.test) {
                
                // Success: Pass the entire response data (test details and summary) 
                // to the next route using navigate's state.
                navigate("/Testface", { state: { testData: data } });
                
            } else {
                // Handle invalid code or verification failure
                alert(data.message || "Invalid start code. Try again.");
            }

        } catch (error) {
            console.error('Test verification error:', error);
            alert("Server error. Please try again.");
        }
    };
    // --- END UPDATED FUNCTION ---

    const isCodeComplete = code.join('').length === 6;

    return (
        <div className="start-code-container">
            <header className="top-nav-bar">
                <div className="nav-left">
                    <HelpOutline className="nav-icon" />
                    <span>Help</span>
                </div>
                <div className="nav-right">
                    <span>Return to Home</span>
                    <CustomHomeIcon className="nav-icon" />
                </div>
            </header>
            
            <main className="main-content-area">
                <div className="start-code-box">
                    <h1 className="start-code-title">Start Code</h1>

                    <p className="start-code-instruction">
                        Enter your start code now to begin testing. Good luck!
                        <br />
                        The start code contains <strong>numbers only</strong>.
                    </p>

                    <div className="code-input-group">
                        {code.map((data, index) => (
                            <input
                                key={index}
                                id={`code-input-${index}`}
                                className="code-input-box"
                                type="text"
                                maxLength="1"
                                value={data}
                                onChange={e => handleChange(e.target, index)}
                                onFocus={e => e.target.select()}
                                inputMode="numeric" 
                                pattern="[0-9]*"
                            />
                        ))}
                    </div>

                    <button
                        className={`start-test-button ${isCodeComplete ? 'start-test-button-ready' : ''}`}
                        onClick={handleStartTest}
                        disabled={!isCodeComplete}
                    >
                        Start Test
                    </button>
                </div>

                <footer className="instructions-footer">
                    <div className="instruction-box">
                        <div className="document-icon-wrapper">
                            <CustomDocumentIcon className="document-icon" />
                        </div>
                        <p>
                            You can <strong>review the Instructions</strong><br /> 
                            that the proctor reads aloud.
                        </p>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default StartCodeScreen;