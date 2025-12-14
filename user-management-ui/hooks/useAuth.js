"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { encryptObjectValues } from "../utils/crypto-utils";
import { getDeviceInfo } from "../utils/getDeviceInfo";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const login = async (username, password, apiUrl) => {
        setLoading(true);
        setError(null);
        
        try {
            // Get device info
            const device_info = await getDeviceInfo();

            // Encrypt credentials
            const encryptedData = await encryptObjectValues(
                { username, password }, 
                ['username', 'password']
            );
            
            const response = await fetch(`${apiUrl}/user/public/login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...encryptedData,
                    device_info
                }),
            });
            
            const resp = await response.json();
            
            if (response.ok) {
                const token = resp?.data?.token;
                if (token && token !== "undefined") {
                    Cookies.set('jwt_token', token, { expires: 1 });
                    return { success: true, token };
                }
            }
            
            setError(resp.message || 'Login failed');
            return { success: false, message: resp.message };
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };
    
    // Register User
    const register = async (userData, apiUrl) => {
        setLoading(true);
        setError(null);
        
        try {
            // Get device info
            const device_info = await getDeviceInfo();

            // Encrypt sensitive fields
            const encryptedData = await encryptObjectValues(
                userData, 
                ['username', 'password', 'email', 'mobile', 'first_name', 'middle_name', 'last_name']
            );
            
            const response = await fetch(`${apiUrl}/user/public/create`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...encryptedData,
                    profile_photo: userData.profile_photo, // Don't encrypt heavy image data usually, or handle separately if needed
                    device_info
                }),
            });
            
            const resp = await response.json();
            
            if (response.ok) {
                const token = resp?.data?.token;
                if (token && token !== "undefined") {
                    Cookies.set('jwt_token', token, { expires: 1 });
                    return { success: true, token };
                }
                 return { success: true, message: "User registered successfully" };
            }
            
            setError(resp.message || 'Registration failed');
            return { success: false, message: resp.message };
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };

    // Login with Code (QR)
    const loginWithCode = async (code, apiUrl) => {
        setLoading(true);
        setError(null);
        
        try {
            const device_info = await getDeviceInfo();
            
            const response = await fetch(`${apiUrl}/user/login/code/${code}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ device_info }),
            });
            
            const resp = await response.json();
            
            if (response.ok) {
                const token = resp?.token || resp?.data?.token;
                if (token && token !== "undefined") {
                    Cookies.set('jwt_token', token, { expires: 1 });
                    return { success: true, token };
                }
            }
            
            setError(resp.message || 'Login failed');
            return { success: false, message: resp.message };
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };
    
    // Check if authenticated
    const checkAuthStatus = () => {
        const token = getToken();
        return !!(token && token !== "undefined" && token !== "null");
    };

    // Google Auth Login
    const loginWithGoogle = async (googleData, apiUrl) => {
        setLoading(true);
        setError(null);
        
        try {
             const device_info = await getDeviceInfo();
             
             const response = await fetch(`${apiUrl}/user/public/register`, { // Maps to google-auth in backend often or verify endpoint
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...googleData,
                    device_info
                }),
            });
            
             const resp = await response.json();
             
             if (response.ok) {
                const token = resp?.data?.token;
                if (token && token !== "undefined") {
                    Cookies.set('jwt_token', token, { expires: 1 });
                    return { success: true, token };
                }
            }
             setError(resp.message || 'Google login failed');
             return { success: false, message: resp.message };
        } catch (err) {
             setError(err.message);
             return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    }
    
    const logout = () => {
        Cookies.remove('jwt_token');
    };
    
    const getToken = () => {
        return Cookies.get('jwt_token');
    };
    
    const isAuthenticated = () => {
        const token = getToken();
        return !!(token && token !== "undefined" && token !== "null");
    };
    
    return { login, register, loginWithCode, loginWithGoogle, logout, getToken, isAuthenticated, loading, error };
};

export default useAuth;
