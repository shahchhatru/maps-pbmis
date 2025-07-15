import React, { useState, useContext, createContext, useEffect } from 'react';
import jwt_decode from 'jwt-decode'; // You'll need to install this: npm install jwt-decode
import CryptoJS from 'crypto-js'; // For AES encryption/decryption, install with: npm install crypto-js
import { BASE_URL } from '../constants/index';
import { useHistory } from 'react-router-dom';

// 1. Create the Auth Context
// This context will hold the authentication state and functions.
const AuthContext = createContext(null);

// 2. Create the AuthProvider Component
// This component will wrap your application and provide the auth context to all children.
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Holds user data if logged in
    const [token, setToken] = useState(null); // Holds the JWT
    const [isLoading, setIsLoading] = useState(true); // Used to show a loader on initial check
    const [isAuthenticated,setIsAuthenticated] = useState(false);
    const history = useHistory();

    // Effect to check for a logged-in user in localStorage on component mount
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                const decodedUser = jwt_decode(storedToken);
                setUser(decodedUser);
                setToken(storedToken);
            }
        } catch (error) {
            console.error("Failed to parse token from localStorage", error);
            localStorage.removeItem('token');
        }
        setIsLoading(false); // Finished initial loading
    }, []);

    // Login function
    const login = async (username, password, municipality_code = null) => {
    setIsLoading(true);
    console.log("Attempting login with:", username);

    try {
        const loginPayload = {
            username,
            password,
        };

        // Encrypt data using AES (must match backend's encryption)
        const secret = process.env.REACT_APP_CIPHER_SECRET || 'random'; // Use .env for secret in production
        const encryptedData = CryptoJS.AES.encrypt(
            JSON.stringify(loginPayload),
            secret
        ).toString();

        const body = {
            data: encryptedData,
        };

        if (municipality_code) {
            body.municipality_code = municipality_code;
        }

        const response = await fetch(BASE_URL +'login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Login failed');
        }

        const receivedToken = result.data.token.replace('Bearer ', '');
        const decodedUser = jwt_decode(receivedToken);

        setUser(decodedUser);
        setToken(receivedToken);
        localStorage.setItem('token', receivedToken);
        console.log("Login successful");
        setIsAuthenticated(true);
        history("/")
        return decodedUser;

    } catch (err) {
        console.error("Login failed:", err.message);
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        throw err;
    } finally {
        setIsLoading(false);
    }
};


    // Logout function
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        console.log("User logged out");
    };

    // The context value that will be supplied to any descendants
    const authContextValue = {
        user,
        token,
        isAuthenticatedUser: !!user, // True if user object is not null
        isLoading,
        login,
        logout,
        isAuthenticated,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Create the custom hook `useAuth`
// This hook is a simple wrapper around `useContext` for easier consumption.
export const useAuth = () => {
    return useContext(AuthContext);
};