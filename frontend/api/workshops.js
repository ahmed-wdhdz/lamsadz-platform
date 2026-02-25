/**
 * Workshops API Service
 * Handles: getWorkshops, getWorkshop, createWorkshop, getMyWorkshop, getDashboard
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';

/**
 * Get all approved workshops (public)
 * @param {Object} filters - { wilaya, page, limit }
 * @returns {Promise<{workshops, total, pages}>}
 */
export async function getWorkshops(filters = {}) {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_URL}/workshops?${params}`);
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Get single workshop by ID (public)
 * @param {number} id - Workshop ID
 * @returns {Promise<Workshop>}
 */
export async function getWorkshop(id) {
    const res = await fetch(`${API_URL}/workshops/${id}`);
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Get current user's workshop profile (authenticated)
 * @param {string} token - JWT token
 * @returns {Promise<Workshop>}
 */
export async function getMyWorkshop(token) {
    const res = await fetch(`${API_URL}/workshops/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Create or update workshop profile (authenticated)
 * @param {string} token - JWT token
 * @param {Object} data - { name, description, location, phone, skills }
 * @returns {Promise<Workshop>}
 */
export async function saveWorkshop(token, data) {
    const res = await fetch(`${API_URL}/workshops`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Get workshop dashboard stats (authenticated)
 * @param {string} token - JWT token
 * @returns {Promise<{stats, activity}>}
 */
export async function getDashboard(token) {
    const res = await fetch(`${API_URL}/workshop/home`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Get subscription status (authenticated)
 * @param {string} token - JWT token
 * @returns {Promise<{plan, status, expiresAt}>}
 */
export async function getSubscription(token) {
    const res = await fetch(`${API_URL}/workshop/subscription`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Upload payment proof (authenticated)
 * @param {string} token - JWT token
 * @param {FormData} formData - { plan, proofImage }
 * @returns {Promise<{success: boolean}>}
 */
export async function uploadPaymentProof(token, formData) {
    const res = await fetch(`${API_URL}/workshop/subscription/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });
    if (!res.ok) throw await res.json();
    return res.json();
}
