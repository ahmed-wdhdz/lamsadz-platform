/**
 * Admin API Service
 * Handles: users, workshops, leads, subscriptions management
 */

const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';

// ==================== USERS ====================

/**
 * Get all users (admin only)
 * @param {string} token - JWT token
 * @param {Object} filters - { page, limit, role }
 * @returns {Promise<{users, total, pages}>}
 */
export async function getUsers(token, filters = {}) {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_URL}/admin/users?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Block/unblock user (admin only)
 * @param {string} token - JWT token
 * @param {number} userId - User ID
 * @param {boolean} blocked - Block status
 * @returns {Promise<User>}
 */
export async function toggleUserBlock(token, userId, blocked) {
    const res = await fetch(`${API_URL}/admin/users/${userId}/block`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ blocked })
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

// ==================== WORKSHOPS ====================

/**
 * Get all workshops with any status (admin only)
 * @param {string} token - JWT token
 * @param {Object} filters - { page, limit, status }
 * @returns {Promise<{workshops, total, pages}>}
 */
export async function getAdminWorkshops(token, filters = {}) {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_URL}/admin/workshops?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Approve or reject workshop (admin only)
 * @param {string} token - JWT token
 * @param {number} workshopId - Workshop ID
 * @param {string} status - APPROVED or REJECTED
 * @param {string} note - Optional admin note
 * @returns {Promise<Workshop>}
 */
export async function updateWorkshopStatus(token, workshopId, status, note = '') {
    const res = await fetch(`${API_URL}/admin/workshops/${workshopId}/status`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, note })
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

// ==================== LEADS ====================

/**
 * Get all leads (admin only)
 * @param {string} token - JWT token
 * @param {Object} filters - { page, limit, status }
 * @returns {Promise<{leads, total, pages}>}
 */
export async function getAdminLeads(token, filters = {}) {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_URL}/admin/leads?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Distribute lead to workshops (admin only)
 * @param {string} token - JWT token
 * @param {number} leadId - Lead ID
 * @param {number[]} workshopIds - Array of workshop IDs
 * @returns {Promise<{success: boolean}>}
 */
export async function distributeLead(token, leadId, workshopIds) {
    const res = await fetch(`${API_URL}/admin/leads/${leadId}/distribute`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ workshopIds })
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

// ==================== SUBSCRIPTIONS ====================

/**
 * Get pending payments (admin only)
 * @param {string} token - JWT token
 * @returns {Promise<{payments}>}
 */
export async function getPendingPayments(token) {
    const res = await fetch(`${API_URL}/admin/subscriptions/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Validate or reject payment (admin only)
 * @param {string} token - JWT token
 * @param {number} paymentId - Payment ID
 * @param {string} status - VALIDATED or REJECTED
 * @param {string} note - Optional admin note
 * @returns {Promise<WorkshopPayment>}
 */
export async function validatePayment(token, paymentId, status, note = '') {
    const res = await fetch(`${API_URL}/admin/subscriptions/${paymentId}/validate`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, note })
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

// ==================== DASHBOARD ====================

/**
 * Get admin dashboard overview (admin only)
 * @param {string} token - JWT token
 * @returns {Promise<{stats, recentActivity}>}
 */
export async function getAdminDashboard(token) {
    const res = await fetch(`${API_URL}/admin/overview`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw await res.json();
    return res.json();
}
