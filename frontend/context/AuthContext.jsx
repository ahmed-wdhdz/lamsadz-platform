import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('user');
            if (token && savedUser && savedUser !== 'undefined') {
                setUser(JSON.parse(savedUser));
            }
        } catch (e) {
            console.error('Failed to load user', e);
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    }, [token]);

    const handleAuthResponse = (data) => {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
    };

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw data;
            }

            if (data.requireOtp) {
                return data;
            }

            handleAuthResponse(data);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const register = async (name, email, password, role, additionalData = {}) => {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role, ...additionalData }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw data;
            }

            if (data.requireOtp) {
                return data;
            }

            handleAuthResponse(data);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const verifyEmail = async (email, otp) => {
        try {
            const response = await fetch(`${API_URL}/auth/verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw data;
            }

            handleAuthResponse(data);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const resendOtp = async (email) => {
        try {
            const response = await fetch(`${API_URL}/auth/resend-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw data;
            }
            return data;
        } catch (error) {
            throw error;
        }
    };

    const googleLogin = async (tokenData, role) => {
        try {
            const response = await fetch(`${API_URL}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: tokenData, role }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw data;
            }

            handleAuthResponse(data);
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, verifyEmail, resendOtp, googleLogin, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
