'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Qr_gen from './qr_generator';
import Cookies from 'js-cookie'; // Assuming you are using 'js-cookie' for cookie management
import ErroToaster from './errorToaster';

const PopupComponent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [qrLoginCode, setQrLoginCode] = useState('');
    const [error, setError] = useState(null);

    // Using useCallback to memoize the fetchQrCode function
    const fetchQrCode = useCallback(async () => {
        setIsLoading(true);
        const token = Cookies.get('jwt_token');

        if (!token || token === 'undefined') {
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_HOST || "http://127.0.0.1:3000"}/user/get/code`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ token: token }),
            });

            if (response.ok) {
                const resp = await response.json();
                const loginCode = resp.data.code
                if (!loginCode || loginCode === 'undefined') {
                    setError('No login code found');
                    setIsLoading(false);
                    return;
                }
                setQrLoginCode(loginCode); // Store the QR code
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'An error occurred while logging in.');
            }
        } catch (error) {
            setError('Failed to connect to the server.');
            console.error('Login failed:', error);
        } finally {
            setIsLoading(false);
        }
    }, []); // Empty dependency array ensures it doesn’t change on every render

    const handleOpenModal = () => {
        fetchQrCode(); // Call the API when the modal is opened
    };

    return (
        <Popup
            trigger={<button className="button">Add device</button>}
            modal
            nested
            onOpen={handleOpenModal} // Trigger the API call when the modal opens
        >
            {(close) => (
                <div className="modal">
                    <button className="close" onClick={close}>
                        &times;
                    </button>
                    <div className="header">Scan to Login</div>
                    <div className="content">
                        {isLoading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <ErroToaster message={error} />
                        ) : (
                            qrLoginCode && <Qr_gen qr_link={{ link: `${process.env.NEXT_PUBLIC_HOST || "http://127.0.0.1:3000"}/user/login/code/${qrLoginCode}`, code: qrLoginCode }} />
                        )}
                    </div>
                    <div className="actions">
                        <Popup
                            trigger={<button className="button">pp</button>}
                            position="top center"
                            nested
                        >
                            scan this to login to your account
                        </Popup>
                        <button
                            className="button"
                            onClick={() => {
                                close();
                            }}
                        >
                            Close modal
                        </button>
                    </div>
                </div>
            )}
        </Popup>
    );
};

export default PopupComponent;
