import React, { useState } from 'react';
import '../css/TestCodeVerification.css';
import { Home, HelpOutline, Description } from '@mui/icons-material';
import { TokenManager, BASE_URL } from '../api/baseurls'; // <-- ADDED

const StartCodeScreen = () => {
    const [code, setCode] = useState(new Array(6).fill(''));
    
    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newCode = [...code];
        newCode[index] = element.value;
        setCode(newCode);

        if (element.value !== '' && index < 5) {
            document.getElementById(`code-input-${index + 1}`).focus();
        }
    };

    // UPDATED with BASE_URL + TokenManager
    const handleStartTest = async () => {
        const fullCode = code.join('');

        if (fullCode.length !== 6) {
            alert('Please enter a complete 6-digit code.');
            return;
        }

        try {
            const token = TokenManager.getToken(); // if you use token
            const response = await fetch(`${BASE_URL}/tests/verify_code/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { Authorization: `Bearer ${token}` })
                },
                body: JSON.stringify({ code: fullCode })
            });

            const data = await response.json();

            if (response.ok && data.valid === true) {
                window.location.href = "/Testface";
            } else {
                alert(data.message || "Invalid start code. Try again.");
            }

        } catch (error) {
            console.error(error);
            alert("Server error. Please try again.");
        }
    };

    return (
        <div className="start-code-container">
            <header className="top-nav-bar">
                <div className="nav-left">
                    <HelpOutline className="nav-icon" />
                    <span>Help</span>
                </div>
                <div className="nav-right">
                    <span>Return to Home</span>
                    <Home className="nav-icon" />
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
                            />
                        ))}
                    </div>

                    <button
                        className="start-test-button"
                        onClick={handleStartTest}
                        disabled={code.join('').length !== 6}
                    >
                        Start Test
                    </button>
                </div>

                <footer className="instructions-footer">
                    <div className="instruction-box">
                        <div className="document-icon-wrapper">
                            <Description className="document-icon" />
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
