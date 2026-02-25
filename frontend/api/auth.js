/**
 * Auth API Service
 * Handles: login, register, getCurrentUser
 */

const API_URL = import.meta.env.VITE_API_URL || `${API_URL}';

/**
 * Register a new user
 * @param {Object} data - { name, email, password, role }
 * @returns {Promise<{token, user}>}
 */
export async function register(data) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Login user
 * @param {Object} data - { email, password }
 * @returns {Promise<{token, user}>}
 */
export async function login(data) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Get current logged-in user
 * @param {string} token - JWT token
 * @returns {Promise<{id, name, role}>}
 */
export async function getMe(token) {
    const res = await fetch(`${API_URL}/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw await res.json();
    return res.json();
}
