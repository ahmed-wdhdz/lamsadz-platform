/**
 * Leads API Service
 * Handles: submitLead, getWorkshopLeads, respondToLead
 */

const API_URL = import.meta.env.VITE_API_URL || `${API_URL}';

/**
 * Submit a new lead/request (public)
 * @param {FormData} formData - { clientName, clientPhone, type, description, wilaya, budgetMin, budgetMax, images[] }
 * @returns {Promise<{success: boolean, leadId: number}>}
 */
export async function submitLead(formData) {
    const res = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        body: formData
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Get leads delivered to workshop (authenticated)
 * @param {string} token - JWT token
 * @param {Object} filters - { page, limit, status }
 * @returns {Promise<{leads, total, pages}>}
 */
export async function getWorkshopLeads(token, filters = {}) {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_URL}/workshop/leads?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Submit offer for a lead (workshop only)
 * @param {string} token - JWT token
 * @param {number} leadDeliveryId - Lead delivery ID
 * @param {Object} offer - { price, leadTimeDays, message }
 * @returns {Promise<Offer>}
 */
export async function submitOffer(token, leadDeliveryId, offer) {
    const res = await fetch(`${API_URL}/workshop/leads/${leadDeliveryId}/offer`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(offer)
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Mark lead as viewed (workshop only)
 * @param {string} token - JWT token
 * @param {number} leadDeliveryId - Lead delivery ID
 * @returns {Promise<{success: boolean}>}
 */
export async function markLeadViewed(token, leadDeliveryId) {
    const res = await fetch(`${API_URL}/workshop/leads/${leadDeliveryId}/view`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw await res.json();
    return res.json();
}
