import React, { useState, useContext, createContext, useEffect } from 'react';
import jwt_decode from 'jwt-decode'; // You'll need to install this: npm install jwt-decode

// 1. Create the Auth Context
// This context will hold the authentication state and functions.
const AuthContext = createContext(null);

// 2. Create the AuthProvider Component
// This component will wrap your application and provide the auth context to all children.
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Holds user data if logged in
    const [token, setToken] = useState(null); // Holds the JWT
    const [isLoading, setIsLoading] = useState(true); // Used to show a loader on initial check

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
    const login = async (username, password) => {
        setIsLoading(true);
        console.log("Attempting login with:", username);

        try {
            // Replace '/api/login' with your actual login endpoint
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Note: Your backend expects encrypted data.
                // This example sends plain text. You would need to implement
                // the same crypto-js AES encryption on the client-side.
                // For simplicity, this example assumes the backend can handle plain text.
                body: JSON.stringify({
                    data: { username, password }, // Adjust payload as per your backend needs
                    // municipality_code: 'your_code_if_needed'
                }),
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
            return decodedUser;

        } catch (err) {
            console.error("Login failed:", err.message);
            // Ensure state is clean on failure
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
            throw err; // Re-throw the error to be caught by the form
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
        isAuthenticated: !!user, // True if user object is not null
        isLoading,
        login,
        logout,
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